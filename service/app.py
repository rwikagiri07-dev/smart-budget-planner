import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
from ai_engine import ask_ai

app = Flask(__name__)
CORS(app)  # internal service — not exposed to browsers directly

PORT = int(os.getenv("PORT", 5001))


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()

    if not question:
        return jsonify({"success": False, "message": "Question is required"}), 400
    if not token:
        return jsonify({"success": False, "message": "Missing auth token"}), 401

    try:
        answer = ask_ai(question, token)
        return jsonify({"success": True, "answer": answer})
    except Exception as exc:
        return jsonify({"success": False, "message": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)