from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import chat

app = FastAPI(
    title="Deligo Chatbot",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []
    user_id: str | None = None

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def root():
    return {"service": "Deligo Chatbot"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    try:
        reply = chat(
            message=req.message,
            history=req.history,
            user_id=req.user_id
        )

        return ChatResponse(reply=reply)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
