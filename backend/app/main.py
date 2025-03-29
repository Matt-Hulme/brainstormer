from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import json

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

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_URL = "https://api.openai.com/v1/chat/completions"

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 1000  # Increased for longer responses
    temperature: float = 0.7

@app.post("/api/generate")
async def generate_words(request: GenerateRequest):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    messages = [
        {
            "role": "system",
            "content": (
                "You are a Scattershot Brainstormer. Your job is to take a single word input "
                "from the user and generate a diverse list of 100 relevant words associated with it.\n\n"
                "- Do not assume the user's intent—generate words that span multiple fields and "
                "applications, such as writing, science, medicine, gaming, design, history, etc.\n"
                "- The words should not be organized in any particular order. They should feel "
                "random yet relevant to the input word.\n"
                "- Ensure that both single words and multi-word phrases appear evenly throughout "
                "the list to maintain a natural scatter. Avoid clustering single words at the "
                "beginning and longer phrases at the end.\n"
                "- Format your response as a JSON object containing an array of strings under the 'results' key.\n\n"
                "The goal is to spark creativity and cover a wide range of potential connections.\n\n"
                "Example of required JSON format:\n"
                '{"results": ["word1", "creative phrase", "scientific term", "word4"]}'
            )
        },
        {
            "role": "user", 
            "content": f"Generate a list of words and phrases related to: {request.prompt}"
        }
    ]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL,
                headers=headers,
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "max_tokens": request.max_tokens,
                    "temperature": request.temperature,
                    "response_format": { "type": "json_object" }
                },
                timeout=None  # No timeout
            )
            
            if response.status_code != 200:
                error_detail = response.json().get('error', {}).get('message', 'OpenAI API error')
                print(f"OpenAI API Error: Status {response.status_code}, Detail: {error_detail}")
                raise HTTPException(status_code=500, detail=error_detail)
            
            response_data = response.json()
            if 'choices' not in response_data or not response_data['choices']:
                print(f"Invalid OpenAI response format: {response_data}")
                raise HTTPException(status_code=500, detail="Invalid response format from OpenAI")
                
            content = response_data['choices'][0]['message']['content']
            print(f"OpenAI Response Content: {content}")
            
            try:
                parsed_content = json.loads(content)
                
                if not isinstance(parsed_content, dict):
                    print(f"Response not a JSON object: {type(parsed_content)}")
                    raise HTTPException(status_code=500, detail="OpenAI response is not a JSON object")
                
                if 'results' not in parsed_content:
                    for key, value in parsed_content.items():
                        if isinstance(value, list):
                            return {"results": value}
                    print(f"Missing results key in response: {parsed_content.keys()}")
                    raise HTTPException(status_code=500, detail="Response missing 'results' array")
                
                if not isinstance(parsed_content['results'], list):
                    print(f"Results not an array: {type(parsed_content['results'])}")
                    raise HTTPException(status_code=500, detail="'results' is not an array")
                
                results = [str(item) for item in parsed_content['results']]
                return {"results": results}
                
            except json.JSONDecodeError as e:
                print(f"JSON Parse Error: {str(e)}")
                print(f"Problematic content: {content}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to parse OpenAI response: {str(e)}\nResponse: {content[:100]}..."
                )
            
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        print(f"Full error details: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 