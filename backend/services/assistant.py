import os
import json
import re
from groq import Groq
from sqlalchemy.orm import Session
from models import ChatMessage

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_patient_response(
    db: Session,
    user_id: int,
    user_message: str
):

    cleaned = user_message.strip().lower()

    # ================= GREETING MODE =================
    greetings = {"hi", "hello", "hey", "good morning", "good evening"}

    if cleaned in greetings:
        reply = """
## Welcome 👋

Hello! I'm your AI Health Assistant.

You can describe any symptoms you're experiencing, and I’ll guide you with possible causes, self-care advice, and when to seek medical attention.

How can I help you today?
""".strip()

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 1
        }

    # ================= VAGUE DISTRESS MODE =================
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
## I'm Here to Help 🤝

I'm sorry you're not feeling well.

Could you tell me a bit more about what you're experiencing?

For example:
- Do you have pain? Where?
- Any fever?
- How long have you felt this way?
- Any other symptoms?

The more details you share, the better I can assist you.
""".strip()

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 2
        }

    # ================= CLINICAL AI MODE =================

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
1–3 → Mild, self-care likely sufficient  
4–6 → Monitor closely  
7–8 → See a doctor soon  
9–10 → Emergency / urgent care recommended  

Rules:
- Do NOT include markdown.
- Do NOT include extra commentary.
- Always return valid JSON.
- triage_score MUST be an integer between 1 and 10.
- Arrays must NEVER be empty.
- Avoid definitive diagnosis.
"""

    # -------- Fetch conversation history --------
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
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.2,
        max_tokens=700,
    )

    raw = response.choices[0].message.content

    try:
        data = json.loads(raw)
        triage_score = int(data.get("triage_score", 3))

        if triage_score < 1:
            triage_score = 1
        if triage_score > 10:
            triage_score = 10

    except Exception:
        reply = "Something went wrong. Please try again."

        _store_chat(db, user_id, user_message, reply)

        return {
            "reply": reply,
            "triage_score": 3
        }

    markdown = f"""
## Current Symptoms
{data['current_symptoms']}

## Possible Cause
{data['possible_cause']}

## What You Can Do
""" + "\n".join([f"- {item}" for item in data["what_you_can_do"]]) + f"""

## Seek Medical Attention If
""" + "\n".join([f"- {item}" for item in data["seek_medical_attention_if"]]) + f"""

## Next Step
{data['next_step']}
"""

    reply = markdown.strip()

    _store_chat(db, user_id, user_message, reply)

    return {
        "reply": reply,
        "triage_score": triage_score
    }


# ================= HELPER FUNCTION =================
def _store_chat(db: Session, user_id: int, user_message: str, assistant_reply: str):

    db.add(ChatMessage(
        user_id=user_id,
        role="user",
        content=user_message
    ))

    db.add(ChatMessage(
        user_id=user_id,
        role="assistant",
        content=assistant_reply
    ))

    db.commit()