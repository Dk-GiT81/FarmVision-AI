from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# =======================
# MONGODB SETUP
# =======================
client = MongoClient("mongodb://localhost:27017/")
db = client["farmvision"]
collection = db["predictions"]
users_collection = db["users"]

# =======================
# LOAD MODEL
# =======================
MODEL_PATH = "model/farmvision_pomegranate_5class_tf"

loaded_model = tf.saved_model.load(MODEL_PATH)
infer = loaded_model.signatures["serving_default"]

# =======================
# CLASS LABELS
# =======================
CLASS_LABELS = [
    "cercospora",
    "alternaria",
    "anthracnose",
    "bacterial_blight",
    "healthy"
]

# =======================
# PESTICIDE DATA
# =======================
PESTICIDE_RECOMMENDATION = {
    "anthracnose": {
        "diagnosis": "Anthracnose disease detected on pomegranate fruit.",
        "pesticide": "Carbendazim 50% WP or Mancozeb 75% WP",
        "precaution": "Remove infected fruits and avoid excess moisture."
    },
    "bacterial_blight": {
        "diagnosis": "Bacterial blight infection detected on pomegranate fruit.",
        "pesticide": "Copper oxychloride or Streptocycline spray",
        "precaution": "Use disease-free planting material and ensure proper drainage."
    },
    "cercospora": {
        "diagnosis": "Cercospora spot detected on pomegranate fruit.",
        "pesticide": "Chlorothalonil or Mancozeb fungicide",
        "precaution": "Avoid overcrowding and ensure good air circulation."
    },
    "alternaria": {
        "diagnosis": "Alternaria fruit rot detected on pomegranate.",
        "pesticide": "Azoxystrobin or Difenoconazole",
        "precaution": "Remove affected fruits and follow crop rotation."
    },
    "healthy": {
        "diagnosis": "Fruit is healthy with no visible disease symptoms.",
        "pesticide": "No pesticide required",
        "precaution": "Maintain regular monitoring and balanced nutrition."
    }
}

# =======================
# IMAGE PREPROCESSING
# =======================
IMG_SIZE = 224

def preprocess_image(image):
    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# =======================
# PREDICT API
# =======================
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image_path = "temp.jpg"
    file.save(image_path)

    img = cv2.imread(image_path)
    if img is None:
        os.remove(image_path)
        return jsonify({"error": "Invalid image"}), 400

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = preprocess_image(img)

    input_tensor = tf.convert_to_tensor(img, dtype=tf.float32)
    outputs = infer(input_tensor)
    predictions = list(outputs.values())[0].numpy()[0]

    predicted_index = int(np.argmax(predictions))
    confidence = float(predictions[predicted_index] * 100)

    os.remove(image_path)

    disease = CLASS_LABELS[predicted_index]
    rec = PESTICIDE_RECOMMENDATION[disease]

    #  SAVE TO DATABASE
    user_email = request.form.get("email", "unknown")  # from frontend

    collection.insert_one({
    "user_email": user_email,
    "disease": disease,
    "confidence": round(confidence, 2),
    "timestamp": str(datetime.now())
    })

    return jsonify({
        "disease": disease,
        "confidence": round(confidence, 2),
        "diagnosis": rec["diagnosis"],
        "recommended_pesticide": rec["pesticide"],
        "precaution": rec["precaution"]
    })

# =======================
# HISTORY API
# =======================
@app.route("/history", methods=["GET"])
def history():
    email = request.args.get("email")
    role = request.args.get("role")

    if role == "admin":
        data = list(collection.find({}, {"_id": 0}))
    else:
        data = list(collection.find({"user_email": email}, {"_id": 0}))

    return jsonify(data)


@app.route("/clear-history", methods=["DELETE"])
def clear_history():
    collection.delete_many({})
    return jsonify({"message": "History cleared"})


@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "farmer")  # default farmer

    # check if user exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": password,
        "role": role
    })

    return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })

# =======================
# RUN
# =======================
if __name__ == "__main__":
    app.run(debug=True)