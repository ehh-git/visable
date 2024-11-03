from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # This will allow requests from any origin


@app.route("/gpt-test", methods=["POST"])
def gpt_test():
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": "Say this is a test",
        }],
    )
    message = response.choices[0].message.content.strip() 
    print(message)
    return jsonify({"message": message})


if __name__ == "__main__":
    app.run(port=5000)
