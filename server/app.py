from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

client = OpenAI()

app = Flask(__name__)
CORS(app)  # This will allow requests from any origin

@app.route("/generate-subtext", methods=["POST"])
def generate_subtext():
    data = request.get_json()
    image_url = data.get("image_url")
    detail_level = data.get("detail_level", "medium")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    # Define prompts based on detail level
    prompts = {
        "short": "Please provide a very brief alt text for the following image to make it ADA compliant. Keep it as concise as possible.",
        "medium": "Please provide an appropriate alt text for the following image to make it ADA compliant.",
        "long": "Please provide a detailed alt text for the following image to make it ADA compliant. Include as much descriptive information as necessary.",
    }

    prompt = prompts.get(detail_level, prompts["medium"])

    try:
        # Fetch the image from the URL
        import requests
        response = requests.get(image_url)
        response.raise_for_status()
        image_data = response.content

        # Encode the image as base64
        base64_image = base64.b64encode(image_data).decode('utf-8')

        # Use the OpenAI API to generate subtext
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
        )
        message = response.choices[0].message.content.strip()
        print(message)
        return jsonify({"subtext": message})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text")
    detail_level = data.get("detail_level", "medium")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Define prompts based on detail level
    prompts = {
        "short": "Please simplify and summarize the following text to make it easier to understand, keeping it as brief as possible:",
        "medium": "Please simplify and concisely summarize the following text to make it easier to understand:",
        "long": "Please simplify and provide a detailed summary of the following text to make it easier to understand:",
    }

    prompt = prompts.get(detail_level, prompts["medium"])

    try:
        # Use the OpenAI API to summarize the text
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}\n\n{text}",
                }
            ],
        )
        summary = response.choices[0].message.content.strip()
        print("Summary:", summary)
        return jsonify({"summary": summary})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
