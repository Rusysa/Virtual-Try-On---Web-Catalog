// Importar los paquetes necesarios
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');

require('dotenv').config(); // Cargar variables de entorno desde .env

// --- Configuración ---
// Inicializar Express
const app = express();
const port = 3001;

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Para parsear JSON en el cuerpo de la petición

// Configurar Multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Lógica de Google AI ---

// Validar que la API key esté presente
const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
if (!apiKey) {
    throw new Error("Por favor, define GOOGLE_CLOUD_API_KEY en tu archivo .env");
}

// Inicializar el cliente de Google AI
const ai = new GoogleGenAI({ apiKey: apiKey });

const model = 'gemini-2.5-flash-image';

// Configuración de generación
const generationConfig = {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ["TEXT", "IMAGE"],
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
    ],
};

// --- Definición del Endpoint de la API ---

// Endpoint para generar la imagen de prueba virtual
app.post(
    '/api/generate-try-on',
    upload.fields([
        { name: 'userImage', maxCount: 1 },
        { name: 'productImage', maxCount: 1 },
    ]),
    async (req, res) => {
        console.log("Petición recibida en /api/generate-try-on");

        try {
            // Verificar que los archivos se hayan subido
            if (!req.files || !req.files.userImage || !req.files.productImage) {
                return res.status(400).json({ error: 'Se requieren ambas imágenes (usuario y producto).' });
            }

            // Convertir los archivos de imagen (buffers) a formato base64
            const userImageBase64 = req.files.userImage[0].buffer.toString('base64');
            const productImageBase64 = req.files.productImage[0].buffer.toString('base64');

            // Crear el mensaje con el prompt y las imágenes
            const msgText = {
                text: `Generate a photorealistic image where the person from the first image is wearing the t-shirt from the second image. The result must be a high-quality image that maintains the person's pose, fits the t-shirt naturally, preserves the background, and has realistic lighting. Return the image inline.`,
            };

            const msgUserImage = {
                inlineData: {
                    mimeType: req.files.userImage[0].mimetype,
                    data: userImageBase64,
                },
            };

            const msgProductImage = {
                inlineData: {
                    mimeType: req.files.productImage[0].mimetype,
                    data: productImageBase64,
                },
            };

            console.log("Enviando petición a la API de Gemini...");

            // Crear una nueva sesión de chat con el modelo Flash Image
            const chat = ai.chats.create({ model: model, config: generationConfig });

            // Enviar y procesar respuesta en stream
            try {
                const stream = await chat.sendMessageStream({ message: [msgText, msgUserImage, msgProductImage] });

                let imageData = null;
                let imageMime = null;
                let textAccum = '';

                console.log('Procesando stream de respuesta...');
                for await (const chunk of stream) {
                    // Si el chunk contiene candidates, extraemos la imagen de ahí
                    if (chunk.candidates && chunk.candidates.length > 0) {
                        const candidate = chunk.candidates[0];
                        if (candidate.content && candidate.content.parts) {
                            for (const part of candidate.content.parts) {
                                if (part.inlineData) {
                                    imageData = part.inlineData.data;
                                    imageMime = part.inlineData.mimeType || 'image/png';
                                }
                            }
                        }
                    }
                    // También guardamos cualquier texto que pueda venir
                    if (chunk.text) {
                        textAccum += chunk.text;
                    }
                }

                if (imageData) {
                    console.log('Imagen generada correctamente');
                    // Limpiamos el string base64 de cualquier metadata extra
                    const cleanBase64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
                    return res.status(200).json({ 
                        success: true, 
                        imageData: cleanBase64,
                        mimeType: imageMime || 'image/png'
                    });
                }

                // Si no encontramos imagen en la respuesta
                console.error('No se encontró imagen en la respuesta. Texto recibido:', textAccum);
                return res.status(500).json({ 
                    error: 'No se pudo generar la imagen virtual', 
                    details: 'La API no devolvió una imagen en el formato esperado'
                });
            } catch (streamErr) {
                console.error('Error al procesar el stream de Gemini:', streamErr);
                return res.status(500).json({ error: 'Error del stream de Gemini', details: streamErr.message });
            }
        } catch (err) {
            console.error('Error en /api/generate-try-on:', err);
            return res.status(500).json({ error: 'Error en el servidor', details: err.message });
        }
    }
);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});