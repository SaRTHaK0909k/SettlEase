import tempfile
import os
import re
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded

load_dotenv()

def extract_json_from_output(output):
    """
    Extracts JSON content enclosed in ```json ... ``` from the output string.
    Returns a Python dictionary or None if not found/invalid.
    """
    pattern = r'```json\n([\s\S]*?)\n```'
    match = re.search(pattern, output)
    if not match:
        print("No JSON found in output.")
        return None

    json_string = match.group(1)
    # Clean up escape sequences
    json_string = json_string.replace('\\\\', '\\').replace('\\"', '"')
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return None

def generate_content_with_file(file, system_instruction):
    API_KEY = os.getenv('REACT_APP_geminiAIKey', "")
    if not API_KEY:
        print("API key not found in environment variables.")
        return None

    genai.configure(api_key=API_KEY)

    GENERATION_CONFIG = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 0,
    }

    SAFETY_SETTINGS = [
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        },
    ]

    try:
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=True) as temp_file:
            file.save(temp_file.name)
            temp_file.flush()
            with open(temp_file.name, 'r', encoding='utf-8') as f:
                content = f.read(900000)
    except Exception as e:
        print(f"Error handling file: {e}")
        return None

    model = genai.GenerativeModel(
        "models/gemini-1.5-pro-latest",
        system_instruction=system_instruction,
        generation_config=GENERATION_CONFIG,
        safety_settings=SAFETY_SETTINGS,
    )

    attempts = 2
    for attempt in range(1, attempts + 1):
        try:
            response = model.generate_content(["Follow the system instructions", content])
            print("Original Response:", getattr(response, 'text', 'No text in response'))
            newText = extract_json_from_output(getattr(response, 'text', ''))
            if newText is not None:
                return newText
            else:
                print("Extracted JSON is None. Retrying...")
        except DeadlineExceeded:
            print(f"Deadline exceeded (attempt {attempt}/{attempts}). Retrying in 1 second...")
            time.sleep(1)
        except ResourceExhausted:
            print(f"Resource exhausted (attempt {attempt}/{attempts}). Retrying in 10 seconds...")
            time.sleep(10)
        except json.JSONDecodeError as e:
            print(f"JSON decode error (attempt {attempt}/{attempts}): {e}. Retrying in 1 second...")
            time.sleep(1)
        except ValueError as e:
            print(f"Value error (attempt {attempt}/{attempts}): {e}.")
            if 'response' in locals() and response is not None:
                print("Prompt feedback:", getattr(response, 'prompt_feedback', None))
                candidates = getattr(response, 'candidates', [])
                if candidates:
                    print("Finish reason:", getattr(candidates[0], 'finish_reason', None))
                    print("Safety ratings:", getattr(candidates[0], 'safety_ratings', None))
            time.sleep(1)
        except Exception as e:
            print(f"Unexpected error (attempt {attempt}/{attempts}): {e}")
            time.sleep(1)
    print("Failed to generate content after multiple attempts.")
    return None
