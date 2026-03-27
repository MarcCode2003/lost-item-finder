import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import requests
from io import BytesIO

# 1. Load the pre-trained, lightweight ResNet18 model
weights = models.ResNet18_Weights.DEFAULT
model = models.resnet18(weights=weights)

# 2. Chop off the final "guessing" layer. 
# We don't want the AI to say "This is a wallet." We just want the raw mathematical patterns!
model = nn.Sequential(*list(model.children())[:-1])
model.eval() # Set to evaluation mode (uses way less RAM on your laptop)

# 3. Standardize the image (AI models require exact sizes and colors)
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def extract_image_features(image_url):
    try:
        # Download the image from your Cloudinary link
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        
        # Apply the sizing rules and add a fake "batch" dimension
        img_tensor = preprocess(img).unsqueeze(0)
        
        # Run the image through the AI (no_grad saves your computer's CPU)
        with torch.no_grad():
            features = model(img_tensor)
            
        # Return a flat list of 512 numbers
        return features.flatten().tolist()
    
    except Exception as e:
        print(f"Error processing image: {e}")
        return None