import face_recognition
import os
import sys
import json

# Ruta de las imágenes de referencia
FACES_DIR = './faces'

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

def recognize_face(image_path):
    known_encodings, known_names = load_known_faces()
    
    try:
        unknown_image = face_recognition.load_image_file(image_path)
    except Exception as e:
        return json.dumps({"match": False, "name": None, "error": f"Error al cargar imagen: {str(e)}"})

    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return json.dumps({"match": False, "name": None, "error": "No se detectó ningún rostro en la imagen"})

    for known_encoding, name in zip(known_encodings, known_names):
        match = face_recognition.compare_faces([known_encoding], unknown_encodings[0])[0]
        if match:
            return json.dumps({"match": True, "name": name})

    return json.dumps({"match": False, "name": None})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"match": False, "name": None, "error": "No se proporcionó ruta de imagen"}))
    else:
        image_path = sys.argv[1]
        print(recognize_face(image_path))
