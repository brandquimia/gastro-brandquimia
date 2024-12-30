import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';

export const storageService = {
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      console.log('Iniciando upload:', path); // Debug
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.type,
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log('Upload completado:', snapshot); // Debug
      const url = await getDownloadURL(snapshot.ref);
      console.log('URL obtenida:', url); // Debug
      return url;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  },

  async deleteImage(path: string): Promise<void> {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  async uploadMultipleImages(files: FileList, basePath: string): Promise<string[]> {
    try {
      const uploadPromises = Array.from(files).map(file => {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const path = `${basePath}/${fileName}`;
        return this.uploadImage(file, path);
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error en uploadMultipleImages:', error);
      throw error;
    }
  }
}; 