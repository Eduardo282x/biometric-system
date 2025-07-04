import face_recognition
import os
import sys
import json

# Ruta de las imágenes de referencia
FACES_DIR = './faces'
TEST_IMAGE_PATH = './temp/verificacion.jpg'

def load_known_faces():
    known_encodings = []
    known_names = []

    for filename in os.listdir(FACES_DIR):
        path = os.path.join(FACES_DIR, filename)
        image = face_recognition.load_image_file(path)
        encodings = face_recognition.face_encodings(image)
        if encodings:
            known_encodings.append(encodings[0])
            name = os.path.splitext(filename)[0].replace("_", " ")
            known_names.append(name)

    return known_encodings, known_names

def recognize_face():
    known_encodings, known_names = load_known_faces()
    unknown_image = face_recognition.load_image_file(TEST_IMAGE_PATH)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return json.dumps({"match": False, "name": None})

    for known_encoding, name in zip(known_encodings, known_names):
        match = face_recognition.compare_faces([known_encoding], unknown_encodings[0])[0]
        if match:
            return json.dumps({"match": True, "name": name})

    return json.dumps({"match": False, "name": None})

if __name__ == "__main__":
    print(recognize_face())
