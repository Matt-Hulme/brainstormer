from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Brainstormer API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WordRequest(BaseModel):
    word: str

class WordResponse(BaseModel):
    words: List[str]

@app.get("/")
def read_root():
    return {"status": "API is running"}

@app.post("/api/generate", response_model=WordResponse)
async def generate_words(request: WordRequest):
    # This is a placeholder - will be replaced with OpenAI integration
    return {"words": [f"association-{i}-for-{request.word}" for i in range(5)]} 