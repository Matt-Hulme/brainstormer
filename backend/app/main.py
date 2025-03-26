from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"

class WordRequest(BaseModel):
    word: str

@app.post("/api/generate")
async def generate_words(request: WordRequest):
    if not HUGGINGFACE_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
        
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    prompt = f"""You are a Scattershot Brainstormer. Your job is to take a single word input from the user and generate a diverse list of 100 relevant words associated with it.

    - Do not assume the user's intent—generate words that span multiple fields and applications, such as writing, science, medicine, gaming, design, history, etc.
    - The words should not be organized in any particular order. They should feel random yet relevant to the input word.
    - Ensure that both single words and multi-word phrases appear evenly throughout the list to maintain a natural scatter.
    - Output each word as a bullet point in a single-column format.

    Input word: {request.word}
    
    Generate the list:"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL,
                headers=headers,
                json={"inputs": prompt, "parameters": {"max_length": 1000}}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="LLM API error")
            
            return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 