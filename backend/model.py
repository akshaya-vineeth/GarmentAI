import uuid
import os
import traceback
import shutil
from huggingface_hub import InferenceClient
from gradio_client import Client, handle_file

class ImageGenerator:
    def __init__(self):
        from dotenv import load_dotenv
        load_dotenv()
        self.hf_token = os.getenv("HF_TOKEN")
        self.client = None

    def load_model(self):
        """Initializes the HuggingFace cloud Inference Client. Done only once."""
        if self.client is None:
            print("Connecting to Hugging Face Cloud Infrastructure...")
            self.client = InferenceClient(token=self.hf_token)
            print("Cloud Client initialized successfully!")

    def generate(self, prompt: str, garment_path: str = None) -> str:
        """Generates an image via the FLUX.1-dev Gradio Space (no local download needed)
        and optionally applies Virtual Try-On via IDM-VTON."""

        print("🎨 Generating base person image via FLUX.1-dev Cloud Space...")

        try:
            # ----------------------------------------------------------------
            # 1. Call FLUX.1-dev on HuggingFace Gradio Space (remote API)
            # ----------------------------------------------------------------
            flux_client = Client("black-forest-labs/FLUX.1-dev", token=self.hf_token)
            result = flux_client.predict(
                prompt=prompt,
                seed=0,
                randomize_seed=True,
                width=1024,
                height=1024,
                guidance_scale=3.5,
                num_inference_steps=28,
                api_name="/infer",
            )

            tmp_filepath = result[0] if isinstance(result, tuple) else result

            # Save with a unique filename
            ext = os.path.splitext(tmp_filepath)[1] or ".png"
            filename = f"generated_model_{uuid.uuid4().hex[:8]}{ext}"
            out_dir = os.path.join(os.getcwd(), "generated_images")
            os.makedirs(out_dir, exist_ok=True)
            filepath = os.path.join(out_dir, filename)
            shutil.copy2(tmp_filepath, filepath)
            print(f"✅ Base image saved → {filepath}")

            # ----------------------------------------------------------------
            # 2. Optional: Virtual Try-On via IDM-VTON (also cloud)
            # ----------------------------------------------------------------
            if garment_path and os.path.exists(garment_path):
                print("👔 Applying Virtual Try-On via IDM-VTON...")
                try:
                    vton_client = Client("yisol/IDM-VTON", token=self.hf_token)
                    vton_result = vton_client.predict(
                        dict={"background": handle_file(filepath), "layers": [], "composite": None},
                        garm_img=handle_file(garment_path),
                        garment_des="a clothing item",
                        is_checked=True,
                        is_checked_crop=False,
                        denoise_steps=30,
                        seed=42,
                        api_name="/tryon",
                    )

                    vton_filepath = vton_result[0] if isinstance(vton_result, (list, tuple)) else vton_result
                    print(f"✅ VTON successful → {vton_filepath}")
                    return vton_filepath

                except Exception as vton_e:
                    print(f"❌ VTON failed: {vton_e}")
                    print("Returning base FLUX image instead.")

            return filepath

        except Exception as e:
            error_message = f"❌ Cloud Generation Failed: {e}\n{traceback.format_exc()}"
            print(error_message)
            raise RuntimeError(error_message) from e


# Single global instance used by FastAPI routes
image_gen = ImageGenerator()