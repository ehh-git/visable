from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

client = OpenAI()

# Decoding function
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  
# Path to your image
image_path = "path_to_your_image.jpg"

# Getting the base64 string
base64_image = encode_image("blind.jpg")
  
app = Flask(__name__)
CORS(app)  # This will allow requests from any origin

@app.route("/gpt-test", methods=["POST"])
def gpt_test():
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
    print("running first")
    print(message)
    print("done running")   
    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(port=5000)