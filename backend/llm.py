import os
from mistralai.client import Mistral
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

class PromptGenerator:
    def __init__(self):
        api_key = os.getenv("MISTRAL_API_KEY")
        # Increase timeout to 120 seconds (120000 ms) to avoid ReadTimeout errors on large responses
        self.client = Mistral(api_key=api_key, timeout_ms=120000) if api_key else None
        
        self.system_prompt = """You are an expert prompt engineer for hyper-realistic fashion photography. 
I will give you a JSON object of a model's physical specifications.
Your task is to convert these specifications into an extremely detailed, lengthy, and clear comma-separated image generation prompt.
Crucially, the prompt MUST explicitly state that the model is "standing, full body shot from head to toe, showing entire outfit and shoes".
Also explicitly state the model is "wearing the exact garment from the provided reference photo".
Target aesthetic: High-end fashion editorial photography, Vogue magazine cover, shot on Hasselblad medium format camera, 8k resolution, cinematic studio lighting, clean seamless studio background.
Prioritize absolute realism: hyper-detailed fabric textures, realistic skin pores, sharp focus, professional color grading. Avoid any plastic, over-smoothed, or generic "AI" look. Expand on the given specifications to create a rich, vivid, and comprehensive scene description.
Do not include any conversational text, explanations, or quotes in your response. Only return the raw prompt string.
Ensure all attributes (like gender, glasses, and accessories) are naturally incorporated into the prompt."""

    def generate_prompt(self, specs_dict: dict) -> str:
        """Generates an enhanced prompt using Mistral LLM."""
        if not self.client:
            raise Exception("Mistral API key is missing or client is not initialized")
            
        user_content = str(specs_dict)

        response = self.client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_content}
            ]
        )
        
        enhanced_prompt = response.choices[0].message.content.strip('"')
        return enhanced_prompt

# Create a singleton instance
prompt_gen = PromptGenerator()
