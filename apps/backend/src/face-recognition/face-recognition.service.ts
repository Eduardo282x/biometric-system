import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import * as faceapi from 'face-api.js';
// import { Canvas, Image, ImageData } from 'canvas';
// const { Canvas, Image, ImageData } = require('canvas');
import * as fs from 'fs';
import * as path from 'path';

// import { loadImage, createCanvas } from 'canvas'
import * as canvas from 'canvas';
import { badResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';

const { Canvas, Image, ImageData } = canvas;

// Correct monkey patch for face-api.js in Node.js environment
faceapi.env.monkeyPatch({
    Canvas: canvas.Canvas as any,
    Image: canvas.Image as any,
    ImageData: canvas.ImageData as any
});
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
// const { createCanvas, loadImage } = require('canvas');

@Injectable()
export class FaceRecognitionService implements OnModuleInit {
    private modelsLoaded = false;
    private readonly modelsPath = path.join(process.cwd(), 'models');
    private readonly clientPhotosPath = path.join(process.cwd(), 'faces');
    private readonly tempPhotosPath = path.join(process.cwd(), 'temp');

    constructor(private readonly prismaService: PrismaService) {

    }

    async onModuleInit() {
        await this.loadModels();
    }

    private async loadModels(): Promise<void> {
        try {
            // Cargar los modelos necesarios
            await faceapi.nets.faceRecognitionNet.loadFromDisk(this.modelsPath);
            await faceapi.nets.faceLandmark68Net.loadFromDisk(this.modelsPath);
            await faceapi.nets.ssdMobilenetv1.loadFromDisk(this.modelsPath);

            this.modelsLoaded = true;
            console.log('Face-api.js models loaded successfully');
        } catch (error) {
            console.error('Error loading face-api.js models:', error);
        }
    }

    /**
     * Extraer descriptores faciales de una imagen
     */
    async extractFaceDescriptor(imagePath: string): Promise<Float32Array | null> {
        try {
            if (!this.modelsLoaded) {
                throw new Error('Models not loaded yet');
            }

            const image = await canvas.loadImage(imagePath);
            // const canvas = faceapi.createCanvasFromMedia(image as any);

            // Detectar cara y obtener descriptores
            const detection = await faceapi
                .detectSingleFace(image as any)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                return null;
            }

            return detection.descriptor;
        } catch (error) {
            console.error('Error extracting face descriptor:', error);
            return null;
        }
    }

    /**
     * Registrar un cliente con su foto
     */
    // async registerClient(clientId: string, photoPath: string): Promise<{ success: boolean; message: string }> {
    //     try {
    //         const descriptor = await this.extractFaceDescriptor(photoPath);

    //         if (!descriptor) {
    //             return {
    //                 success: false,
    //                 message: 'No se pudo detectar una cara en la imagen'
    //             };
    //         }

    //         // Guardar el descriptor en un archivo JSON
    //         const descriptorPath = path.join(this.clientPhotosPath, `${clientId}_descriptor.json`);

    //         // Crear directorio si no existe
    //         if (!fs.existsSync(this.clientPhotosPath)) {
    //             fs.mkdirSync(this.clientPhotosPath, { recursive: true });
    //         }

    //         const descriptorData = {
    //             clientId,
    //             descriptor: Array.from(descriptor), // Convertir Float32Array a array normal
    //             registeredAt: new Date().toISOString(),
    //             photoPath
    //         };

    //         fs.writeFileSync(descriptorPath, JSON.stringify(descriptorData, null, 2));

    //         return {
    //             success: true,
    //             message: 'Cliente registrado exitosamente'
    //         };
    //     } catch (error) {
    //         console.error('Error registering client:', error);
    //         return {
    //             success: false,
    //             message: 'Error al registrar el cliente'
    //         };
    //     }
    // }

    /**
     * Verificar identidad comparando con foto temporal
     */
    async verifyClient(tempPhotoPath: string, threshold: number = 0.6) {
        try {
            const tempDescriptor = await this.extractFaceDescriptor(tempPhotoPath);

            if (!tempDescriptor) {
                return {
                    success: false,
                    message: 'No se pudo detectar una cara en la imagen de verificación'
                };
            }

            // Leer todos los descriptores de clientes registrados
            const clientDescriptors = this.loadAllClientDescriptors();

            if (clientDescriptors.length === 0) {
                return {
                    success: false,
                    message: 'No hay clientes registrados'
                };
            }

            let bestMatch: { clientId: string; distance: number } | null = null;

            // Comparar con todos los descriptores registrados
            for (const clientData of clientDescriptors) {
                const storedDescriptor = new Float32Array(clientData.descriptor);
                const distance = faceapi.euclideanDistance(tempDescriptor, storedDescriptor);

                if (!bestMatch || distance < bestMatch.distance) {
                    bestMatch = { clientId: clientData.clientId, distance };
                }
            }

            if (bestMatch && bestMatch.distance < threshold) {
                const confidence = Math.round((1 - bestMatch.distance) * 100);
                const today = new Date();
                if(confidence > 0.50){

                }
                const findClientPayment = await this.prismaService.payment.findFirst({
                    where: { clientId: Number(bestMatch.clientId) }
                });

                if (!findClientPayment) {
                    badResponse.message = `No se encontró ningún pago de este cliente`
                    return badResponse;
                }

                const paymentClient = await this.prismaService.payment.findFirst({
                    orderBy: { datePay: 'desc' },
                    include: { client: true, user: true },
                    where: { clientId: Number(bestMatch.clientId) }
                }).then(item => {
                    return {
                        ...item,
                        status: item.nextDatePay > today
                    }
                })

                return {
                    message: 'Cliente encontrado.',
                    success: true,
                    data: paymentClient
                };
            } else {
                badResponse.message = 'No se encontró coincidencia con ningún cliente registrado'
                return badResponse;
            }
        } catch (error) {
            console.error('Error verifying client:', error);
            badResponse.message = 'Error durante la verificación'
            return badResponse;
        }
    }

    /**
     * Cargar todos los descriptores de clientes
     */
    private loadAllClientDescriptors(): Array<{ clientId: string; descriptor: number[] }> {
        try {
            if (!fs.existsSync(this.clientPhotosPath)) {
                return [];
            }

            const files = fs.readdirSync(this.clientPhotosPath);
            const descriptorFiles = files.filter(file => file.endsWith('_descriptor.json'));
            const descriptors = [];

            for (const file of descriptorFiles) {
                const filePath = path.join(this.clientPhotosPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                descriptors.push({
                    clientId: data.clientId,
                    descriptor: data.descriptor
                });
            }

            return descriptors;
        } catch (error) {
            console.error('Error loading client descriptors:', error);
            return [];
        }
    }

    /**
     * Limpiar archivos temporales
     */
    async cleanTempFiles(): Promise<void> {
        try {
            if (fs.existsSync(this.tempPhotosPath)) {
                const files = fs.readdirSync(this.tempPhotosPath);
                for (const file of files) {
                    fs.unlinkSync(path.join(this.tempPhotosPath, file));
                }
            }
        } catch (error) {
            console.error('Error cleaning temp files:', error);
        }
    }
}
