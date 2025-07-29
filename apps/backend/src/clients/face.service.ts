import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

@Injectable()
export class FaceService {
    async runRecognition(imageBuffer: Buffer): Promise<{ match: boolean; name: string }> {
        try {
            const tempImagePath = path.resolve(__dirname, '..', '..', 'temp', 'temp.jpg');

            // ⚠️ Validación clave
            if (!imageBuffer) {
                throw new Error('No se recibió la imagen correctamente.');
            }

            

            // Asegura que la carpeta exista
            fs.mkdirSync(path.dirname(tempImagePath), { recursive: true });

            // Guarda la imagen
            fs.writeFileSync(tempImagePath, imageBuffer);

            const scriptPath = path.resolve(__dirname, '..', '..', 'scripts', 'recognize.py');
            const { stdout } = await execPromise(`python "${scriptPath}" "${tempImagePath}"`);

            fs.unlinkSync(tempImagePath); // Elimina imagen temporal si todo va bien

            return JSON.parse(stdout);
        } catch (error) {
            console.error('Error ejecutando reconocimiento:', error);
            return { match: false, name: null };
        }
    }
}
