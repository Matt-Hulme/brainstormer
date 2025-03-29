from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://matt-hulme.com"],  # Only allow the production domain
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only allow necessary methods
    allow_headers=["Authorization", "Content-Type"],  # Only allow necessary headers
)

# Security
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 1000
    temperature: float = 0.7

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    if token_data.username != ADMIN_USERNAME:
        raise credentials_exception
    return token_data

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
API_URL = "https://api.openai.com/v1/chat/completions"

@app.post("/api/generate")
async def generate_words(
    request: GenerateRequest,
    current_user: TokenData = Depends(get_current_user)
):
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