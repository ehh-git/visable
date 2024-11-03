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

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

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
                            "text": "Please generate subtext for the image at this link such that it is ADA compliant. This should mean that the description is sufficient yet concise.",
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


@app.route("/gpt-test", methods=["POST"])
def gpt_test():
    # Decoding function
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    # Getting the base64 string
    base64_image = encode_image("Drizzle.jpg")
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": "Please generate subtext for the image at this link such that it is ADA compliant. This should mean that the description is sufficient yet concise.",
                },
                {
                "type": "image_url",
                "image_url": {
                    "url":  f"data:image/jpeg;base64,{base64_image}"
                },
                },
            ],
            }
        ],
    )
    message = response.choices[0].message.content.strip()
    print(message)
    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(port=5000)