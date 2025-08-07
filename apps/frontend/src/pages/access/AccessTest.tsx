import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'


function AccessTest() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // LOAD FROM USEEFFECT
    useEffect(() => {
        startVideo()
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        videoRef && loadModels()

    }, [])



    // OPEN YOU FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // LOAD MODELS FROM FACE API

    const loadModels = () => {
        Promise.all([
            // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
            faceapi.nets.tinyFaceDetector.loadFromUri("../../../../../models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("../../../../../models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("../../../../../models"),
            faceapi.nets.faceExpressionNet.loadFromUri("../../../../../models")

        ]).then(() => {
            faceMyDetect()
        })
    }

    const faceMyDetect = () => {
        setInterval(async () => {
            if (videoRef.current) {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks().withFaceExpressions()

                // DRAW YOU FACE IN WEBCAM
                if (canvasRef.current) {
                    // Optionally clear the canvas before drawing
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    }

                    faceapi.matchDimensions(canvas, {
                        width: 940,
                        height: 650
                    })

                    const resized = faceapi.resizeResults(detections, {
                        width: 940,
                        height: 650
                    })

                    faceapi.draw.drawDetections(canvas, resized)
                    faceapi.draw.drawFaceLandmarks(canvas, resized)
                    faceapi.draw.drawFaceExpressions(canvas, resized)
                }
            }
        }, 1000)
    }

    return (
        <div className="myapp">
            <h1>FAce Detection</h1>
            <div className="appvide">

                <video crossOrigin="anonymous"  ref={videoRef} autoPlay></video>
            </div>
            <canvas ref={canvasRef} width="940" height="650"
                className="appcanvas" />
        </div>
    )

}

export default AccessTest;