import json
import os
import re

from groq import Groq
from sqlalchemy.orm import Session

from models import ChatMessage


api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


def generate_patient_response(
    db: Session,
    user_id: int,
    user_message: str,
):
    cleaned = user_message.strip().lower()
    normalized = _normalize_message(cleaned)

    greetings = {
        "hi",
        "hello",
        "hey",
        "hi there",
        "hello there",
        "hey there",
        "good morning",
        "good afternoon",
        "good evening",
    }

    if normalized in greetings:
        reply = """
## 👋 Welcome

Hello! I'm your AI Health Assistant.

You can describe any symptoms you're experiencing, and I'll guide you with possible causes, self-care advice, and when to seek medical attention.

### ✨ How can I help today?
Tell me what you're feeling, where it's happening, and when it started.
""".strip()

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 1,
        }

    vague_distress_patterns = [
        r"not feeling well",
        r"don't feel well",
        r"dont feel well",
        r"feeling sick",
        r"i feel bad",
        r"i feel unwell",
        r"am not feeling well",
    ]

    if any(re.search(pattern, cleaned) for pattern in vague_distress_patterns):
        reply = """
## 💙 I'm Here to Help

I'm sorry you're not feeling well.

Could you tell me a bit more about what you're experiencing?

### Helpful details
- Do you have pain? Where?
- Any fever?
- How long have you felt this way?
- Any other symptoms?

The more details you share, the better I can assist you.
""".strip()

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 2,
        }

    if _is_brief_non_medical_message(normalized):
        reply = """
## 🩺 Tell Me What's Going On

I can help with symptoms, possible causes, self-care steps, and when to seek medical attention.

### Please include
- What you are feeling
- Where it is happening
- When it started
- Whether it is getting better or worse
""".strip()

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 1,
        }

    system_prompt = """
You are an evidence-based clinical AI health assistant.

You must analyze the user's message carefully and provide medically reasonable guidance.

You MUST respond ONLY in valid JSON.

STRICT FORMAT:

{
  "current_symptoms": "Concise summary of reported symptoms.",
  "possible_cause": "Most likely explanation.",
  "what_you_can_do": ["Actionable step 1", "Actionable step 2"],
  "seek_medical_attention_if": ["Red flag 1", "Red flag 2"],
  "next_step": "Clear next recommended action",
  "triage_score": 1
}

Triage Score Rules:
1-3 -> Mild, self-care likely sufficient
4-6 -> Monitor closely
7-8 -> See a doctor soon
9-10 -> Emergency / urgent care recommended

Rules:
- Do NOT include markdown.
- Do NOT include extra commentary.
- Always return valid JSON.
- triage_score MUST be an integer between 1 and 10.
- Arrays must NEVER be empty.
- Avoid definitive diagnosis.
- Focus primarily on the latest user message.
- Do not carry forward old symptoms unless the latest message clearly continues them.
"""

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
        .all()
    )

    history = list(reversed(history))

    messages = [{"role": "system", "content": system_prompt}]

    for msg in history:
        messages.append(
            {
                "role": msg.role,
                "content": msg.content,
            }
        )

    messages.append({"role": "user", "content": user_message})

    if client is None:
        return _store_and_return_fallback(db, user_id, user_message)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.2,
            max_tokens=700,
        )
        raw = response.choices[0].message.content or ""
        data = _extract_json(raw)
        triage_score = max(1, min(10, int(data.get("triage_score", 3))))
        reply = _format_reply(data)
    except Exception:
        return _store_and_return_fallback(db, user_id, user_message)

    _store_chat(db, user_id, user_message, reply)

    return {
        "reply": reply,
        "triage_score": triage_score,
    }


def _format_reply(data: dict):
    current_symptoms = data.get("current_symptoms", "No symptom summary was provided.")
    possible_cause = data.get("possible_cause", "A likely cause could not be determined.")
    what_you_can_do = data.get("what_you_can_do") or ["Monitor your symptoms and rest."]
    seek_medical_attention_if = data.get("seek_medical_attention_if") or ["Symptoms become severe or feel urgent."]
    next_step = data.get("next_step", "Share more detail about your symptoms.")

    markdown = f"""
## 🩺 Current Symptoms
{current_symptoms}

## 🔎 Possible Cause
{possible_cause}

## ✅ What You Can Do
""" + "\n".join([f"- {item}" for item in what_you_can_do]) + f"""

## 🚨 Seek Medical Attention If
""" + "\n".join([f"- {item}" for item in seek_medical_attention_if]) + f"""

## 📌 Next Step
{next_step}
"""

    return markdown.strip()


def _extract_json(raw: str):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


def _normalize_message(message: str):
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", message)).strip()


def _is_brief_non_medical_message(normalized_message: str):
    if not normalized_message:
        return True

    medical_keywords = {
        "pain",
        "fever",
        "cough",
        "cold",
        "headache",
        "nausea",
        "vomiting",
        "dizziness",
        "rash",
        "injury",
        "sore",
        "ache",
        "swelling",
        "burning",
        "bleeding",
        "diarrhea",
        "constipation",
        "back",
        "chest",
        "throat",
        "stomach",
        "arm",
        "leg",
    }

    tokens = normalized_message.split()

    if any(token in medical_keywords for token in tokens):
        return False

    return len(tokens) <= 3


def _fallback_response(user_message: str):
    return f"""
## 🩺 Current Symptoms
{user_message.strip() or "Symptoms were not provided."}

## 🔎 Possible Cause
I can't safely determine a likely cause from the available information alone.

## ✅ What You Can Do
- Share when the symptoms started and whether they are getting worse
- Rest, stay hydrated, and monitor your temperature or pain levels
- Contact a clinician if you have an existing condition that may raise your risk

## 🚨 Seek Medical Attention If
- You develop trouble breathing, chest pain, confusion, or severe weakness
- Symptoms become rapidly worse or do not improve
- You feel this could be an emergency

## 📌 Next Step
Please send a little more detail about your symptoms so I can guide you better.
""".strip()


def _store_and_return_fallback(db: Session, user_id: int, user_message: str):
    reply = _fallback_response(user_message)
    _store_chat(db, user_id, user_message, reply)
    return {
        "reply": reply,
        "triage_score": 3,
    }


def _store_chat(db: Session, user_id: int, user_message: str, assistant_reply: str):
    db.add(
        ChatMessage(
            user_id=user_id,
            role="user",
            content=user_message,
        )
    )

    db.add(
        ChatMessage(
            user_id=user_id,
            role="assistant",
            content=assistant_reply,
        )
    )

    db.commit()
