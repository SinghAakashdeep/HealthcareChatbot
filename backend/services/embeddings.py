from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from models import Visit
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def store_visit_embedding(db: Session, visit_id: int, text: str):

    embedding = generate_embedding(text)

    db.query(Visit).filter(
        Visit.id == visit_id
    ).update({
        Visit.embedding: embedding
    })

    db.commit()


def retrieve_relevant_visits(
    db: Session,
    patient_id: int,
    query: str,
    top_k: int = 5
):

    query_embedding = generate_embedding(query)

    results = db.execute(
        """
        SELECT *
        FROM visits
        WHERE patient_id = :patient_id
        ORDER BY embedding <-> :query_embedding
        LIMIT :top_k
        """,
        {
            "patient_id": patient_id,
            "query_embedding": query_embedding,
            "top_k": top_k
        }
    )

    return results.fetchall()
