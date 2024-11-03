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
                    "url":  "https://media.istockphoto.com/id/673642938/photo/single-black-male-in-his-30s-smiling-while-commuting-to-work-by-bicycle.jpg?s=612x612&w=0&k=20&c=yBRwkBSYpWXQAGi7LBovd9AmfZrhWp6HqstGVCmKGiA="
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