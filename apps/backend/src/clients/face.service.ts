// face.service.ts
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class FaceService {
    async runRecognition(): Promise<{ match: boolean; name: string }> {
        try {
            const { stdout } = await execPromise('python scripts/recognize.py');
            return JSON.parse(stdout);
        } catch (error) {
            console.error('Error ejecutando reconocimiento:', error);
            return { match: false, name: null };
        }
    }
}
