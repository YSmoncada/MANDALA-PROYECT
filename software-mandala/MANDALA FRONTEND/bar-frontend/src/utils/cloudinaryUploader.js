import axios from 'axios';
import toast from 'react-hot-toast';

// Lee las variables de entorno de Vite
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Sube un archivo a Cloudinary usando un preset no firmado.
 * @param {File} file - El archivo a subir.
 * @returns {Promise<string>} - Una promesa que resuelve con la URL segura de la imagen subida.
 */
export const uploadToCloudinary = async (file) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        console.error("Cloudinary config (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET) is missing.");
        toast.error("La configuración para subir imágenes no está completa.");
        throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(UPLOAD_URL, formData);
    return response.data.secure_url; // Devuelve la URL segura de la imagen
};