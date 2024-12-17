from flask import Flask, request, jsonify
from flask_cors import CORS
from characterai import aiocai
import asyncio

app = Flask(__name__)
CORS(app, origins=["https://faabio.onrender.com"])

@app.route('/')
def home():
    return "Flask backend is running!"

CHARACTER_ID = "rWeY4d1UCMOQ_MKPsYFvQFzOx5dE4eZUxqHzcFrMT4A"
TOKEN = "d3c55e8c19473728d0055567ac29b5605e664f56"

async def get_response(user_input):
    client = aiocai.Client(TOKEN)
    async with await client.connect() as chat:
        new, answer = await chat.new_chat(CHARACTER_ID, (await client.get_me()).id)
        message = await chat.send_message(CHARACTER_ID, new.chat_id, user_input)
        return message.text

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    user_input = data.get('text', '')

    if not user_input:
        return jsonify({"message": "No input provided"}), 400

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    ai_response = loop.run_until_complete(get_response(user_input))

    return jsonify({"message": ai_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
