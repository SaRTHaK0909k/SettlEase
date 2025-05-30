import os
import time
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import DeadlineExceeded, ResourceExhausted, GoogleAPIError

load_dotenv()

class GeminiContentGenerator:
  def __init__(self, api_key_env='REACT_APP_geminiAIKey'):
    self.api_key = os.getenv(api_key_env, "")
    if not self.api_key:
      raise EnvironmentError(f"API key not found in environment variable '{api_key_env}'")
    genai.configure(api_key=self.api_key)
    self.generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 0,
    }
    self.safety_settings = [
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
      },
    ]

  @staticmethod
  def extract_json_from_output(output):
    try:
      # Remove code block markers and extract JSON
      cleaned = re.sub(r"^```json|```$", "", output, flags=re.MULTILINE).strip()
      return json.loads(cleaned)
    except json.JSONDecodeError as e:
      print(f"JSON decoding failed: {e}")
      return None

  def generate_content(self, system_instruction, search_prompt, max_retries=2, retry_delay=1):
    model = genai.GenerativeModel(
      "models/gemini-1.5-pro",
      system_instruction=system_instruction,
      generation_config=self.generation_config,
      safety_settings=self.safety_settings,
    )

    last_exception = None
    for attempt in range(max_retries):
      try:
        response = model.generate_content([
          "Follow the system instructions and", search_prompt
        ])
        print("Original Response:", response.text)
        result = self.extract_json_from_output(response.text)
        if result is not None:
          return result
        else:
          print("Failed to extract JSON from response.")
      except (DeadlineExceeded, ResourceExhausted) as e:
        print(f"{type(e).__name__} occurred. Retrying in {retry_delay} second(s)...")
        last_exception = e
      except ValueError as e:
        print(f"ValueError: {e}. Retrying in {retry_delay} second(s)...")
        if 'response' in locals() and response is not None:
          print("Prompt feedback:", getattr(response, 'prompt_feedback', None))
          candidate = getattr(response, 'candidates', [None])[0]
          if candidate:
            print("Finish reason:", getattr(candidate, 'finish_reason', None))
            print("Safety ratings:", getattr(candidate, 'safety_ratings', None))
        last_exception = e
      except GoogleAPIError as e:
        print(f"Google API error: {e}")
        last_exception = e
        break
      except Exception as e:
        print(f"Unexpected error: {e}")
        last_exception = e
        break
      time.sleep(retry_delay)
    print(f"Failed to generate content after {max_retries} attempts.")
    if last_exception:
      print(f"Last exception: {last_exception}")
    return None

# Example usage:
# generator = GeminiContentGenerator()
# result = generator.generate_content("Your system instruction", "Your search prompt")
# print(result)