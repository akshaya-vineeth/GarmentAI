import uuid
import os
import traceback
from huggingface_hub import InferenceClient
from gradio_client import Client, handle_file

class ImageGenerator:
    def __init__(self):
        # 1. Fetch your HF token from the .env file instead of hardcoding it
        from dotenv import load_dotenv
        load_dotenv()
        self.hf_token = os.getenv("HF_TOKEN")
        self.client = None

    def load_model(self):
        """Initializes the cloud Inference Client. Done only once."""
        if self.client is None:
            print("Connecting to Hugging Face Cloud Infrastructure...")
            
            # Initialize the remote endpoint client
            self.client = InferenceClient(token=self.hf_token)
            
            print("Cloud Client initialized successfully!")

    def generate(self, prompt: str, garment_path: str = None) -> str:
        """Generates an image from a prompt via the cloud, and applies VTON if a garment is provided."""
        
        print("Generating Base Person Image via Cloud (FLUX.1-dev Free Space)...")
        
        try:
            # Call the highly reliable FLUX model on the free Gradio Space
            import shutil
            flux_client = Client("black-forest-labs/FLUX.1-dev", token=self.hf_token)
            result = flux_client.predict(
                prompt=prompt,
                seed=0,
                randomize_seed=True,
                width=1024,
                height=1024,
                guidance_scale=3.5,
                num_inference_steps=28,
                api_name="/infer"
            )
            
            if isinstance(result, tuple):
                tmp_filepath = result[0]
            else:
                tmp_filepath = result
            
            # Save image with a unique filename matching your format
            ext = os.path.splitext(tmp_filepath)[1] or ".png"
            filename = f"generated_model_{uuid.uuid4().hex[:8]}{ext}"
            out_dir = os.path.join(os.getcwd(), "generated_images")
            os.makedirs(out_dir, exist_ok=True)
            filepath = os.path.join(out_dir, filename)
            
            shutil.copy2(tmp_filepath, filepath)
            
            # If a garment image was provided, apply Virtual Try-On
            if garment_path and os.path.exists(garment_path):
                print("Applying Virtual Try-On via IDM-VTON...")
                try:
                    vton_client = Client("yisol/IDM-VTON", token=self.hf_token)
                    result = vton_client.predict(
                        dict={"background": handle_file(filepath), "layers": [], "composite": None},
                        garm_img=handle_file(garment_path),
                        garment_des="a clothing item",
                        is_checked=True,
                        is_checked_crop=False,
                        denoise_steps=30,
                        seed=42,
                        api_name="/tryon"
                    )
                    
                    if isinstance(result, list) or isinstance(result, tuple):
                        vton_filepath = result[0]
                    else:
                        vton_filepath = result
                        
                    print(f"✅ VTON Successful: {vton_filepath}")
                    return vton_filepath
                    
                except Exception as vton_e:
                    print(f"❌ VTON Failed: {vton_e}")
                    print("Returning base FLUX image instead.")
                    return filepath
            
            return filepath
            
        except Exception as e:
            error_message = f"❌ Cloud Generation Failed: {e}\n{traceback.format_exc()}"
            print(error_message)
            raise RuntimeError(error_message) from e

# Create a single global instance for your application routes to use
image_gen = ImageGenerator()