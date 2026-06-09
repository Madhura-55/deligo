# chatbot-server/ingest.py
import os, json
from pymongo import MongoClient
from bson import ObjectId
import chromadb
import ollama
from dotenv import load_dotenv

load_dotenv("../.env.local")

MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client["deligo"]

chroma = chromadb.PersistentClient(path="./chroma_data")
collection = chroma.get_or_create_collection("deligo_kb")

def embed(text: str) -> list[float]:
    return ollama.embeddings(model="llama3.2", prompt=text)["embedding"]

docs, ids, embeddings, metas = [], [], [], []

# ── Products ──
for p in db.products.find({"status": "active"}, limit=500):
    text = f"Product: {p['name']}. Price: ₹{p['price'] - p.get('discount',0)}. Stock: {p['stock']}. {p.get('description','')}"
    docs.append(text)
    ids.append(f"product_{p['_id']}")
    embeddings.append(embed(text))
    metas.append({"type": "product", "id": str(p["_id"]), "name": p["name"]})

# ── FAQ / policy docs ──
faqs = [
    ("faq_returns", "Returns Policy", "Customers can return products within 30 days of delivery if unused and in original packaging."),
    ("faq_delivery", "Delivery Time", "Standard delivery takes 3-5 business days. Express delivery takes 1-2 days for an extra fee."),
    ("faq_payment", "Payment Methods", "We accept UPI, credit/debit cards, net banking, and cash on delivery via Razorpay."),
    ("faq_cancel", "Order Cancellation", "Orders can be cancelled before they are shipped. Go to My Orders and click Cancel Order."),
    ("faq_track", "Order Tracking", "Go to My Orders to see live order status and tracking number for your shipment."),
    ("faq_otp", "Delivery OTP", "A 6-digit OTP is sent to your email when the order is placed. Share it with the delivery person to confirm receipt."),
]
for fid, title, body in faqs:
    text = f"{title}: {body}"
    docs.append(text)
    ids.append(fid)
    embeddings.append(embed(text))
    metas.append({"type": "faq", "id": fid})

collection.upsert(documents=docs, ids=ids, embeddings=embeddings, metadatas=metas)
print(f"✅ Ingested {len(docs)} documents into ChromaDB")
