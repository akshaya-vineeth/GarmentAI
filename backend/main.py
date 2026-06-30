from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from fastapi.responses import FileResponse
from model import image_gen
from llm import prompt_gen
from dotenv import load_dotenv
import urllib.parse

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Pre-initialize our cloud API configuration structure
image_gen.load_model()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/generate-prompt")
async def generate_prompt(specs: str = Form(...), garment: UploadFile = File(None)):
    try:
        # Parse the JSON string sent via FormData
        specs_dict = json.loads(specs)
        
        garment_path = None
        if garment:
            out_dir = os.path.join(os.getcwd(), "generated_images")
            os.makedirs(out_dir, exist_ok=True)
            garment_path = os.path.join(out_dir, f"temp_garment_{garment.filename}")
            with open(garment_path, "wb") as buffer:
                buffer.write(await garment.read())

        # 1. Generate the detailed prompt using your Mistral LLM engine
        enhanced_prompt = prompt_gen.generate_prompt(specs_dict)
        print(f"✨ Enhanced Prompt Generated: {enhanced_prompt}")
        
        # 2. Request the image from the cloud pipeline wrapper
        saved_image_path = image_gen.generate(enhanced_prompt, garment_path)
        
        # 3. Check if the generation script hit an exception and returned empty
        if not saved_image_path or saved_image_path == "":
            raise HTTPException(
                status_code=502, 
                detail="Hugging Face cloud generation failed. Look at your server terminal for the exact error trace."
            )
            
        # Double check the file physically landed on the drive before dispatching it
        if not os.path.exists(saved_image_path):
            raise HTTPException(
                status_code=404, 
                detail="Generated image file could not be found on the server disk."
            )
        
        # 4. Return the image file smoothly back to React
        # We URL-encode the prompt because HTTP headers strictly support latin-1 characters.
        return FileResponse(
            saved_image_path, 
            headers={"X-Generated-Prompt": urllib.parse.quote(enhanced_prompt)}
        )
        
    except HTTPException as http_ex:
        # Pass handled client/gateway HTTP status exceptions straight through
        raise http_ex
    except Exception as e:
        # Capture unexpected framework anomalies without silently terminating
        print(f"❌ Internal Server Exception:")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))