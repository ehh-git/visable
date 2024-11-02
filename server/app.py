# server/app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/process-image", methods=["POST"])
def process_image():
    # Placeholder for image processing (use OpenAI API later)
    return jsonify({"message": "Image processed!"})

if __name__ == "__main__":
    app.run(port=5000)
