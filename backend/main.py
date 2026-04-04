from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml import extract_image_features

app = FastAPI()

# 1. Unlock CORS so Next.js can talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # The asterisk means "Allow ALL websites"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define what data the frontend will send us
class ImageRequest(BaseModel):
    image_url: str

@app.get("/")
def read_root():
    return {"message": "Hello from your new Python AI Brain!"}

# 3. Create the new AI endpoint
@app.post("/extract-features")
def process_image(request: ImageRequest):
    # Send the URL to our ml.py file to do the heavy lifting
    features = extract_image_features(request.image_url)
    
    if features is None:
        raise HTTPException(status_code=400, detail="Failed to process image. Check the URL.")
        
    return {"features": features}