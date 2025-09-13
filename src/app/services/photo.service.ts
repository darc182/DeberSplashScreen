import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  constructor() { }

  public async addNewToGallery() {
    // Tomar una foto
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    // Generar un nombre descriptivo para la foto
    const timestamp = new Date().toISOString();
    const fileName = `photo_${timestamp}.jpeg`.replace(/[:.]/g, '-');

    // Guardar la foto y agregarla a la galería
    const savedImageFile = await this.savePicture(capturedPhoto, fileName);
    this.photos.unshift({
      filepath: savedImageFile.filepath,
      webviewPath: savedImageFile.webviewPath,
      displayName: this.getDisplayName(fileName) // Añadir nombre para mostrar
    });

    // Guardar en preferencias
    await this.savePhotosToPreferences();
  }

  public async deletePhoto(photo: UserPhoto, position: number) {
    // Eliminar foto del array
    this.photos.splice(position, 1);

    // Actualizar preferencias
    await this.savePhotosToPreferences();

    // Eliminar archivo del sistema de archivos
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  private async savePicture(photo: Photo, fileName: string) {
    // Convertir foto a base64
    const base64Data = await this.readAsBase64(photo);

    // Escribir el archivo
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    // Obtener la foto, leer como blob, luego convertir a base64
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    // Cargar fotos guardadas
    const { value } = await Preferences.get({ key: 'photos' });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    // Reconstruir las URLs para cada foto
    for (let photo of this.photos) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });
      
      // Convertir a formato web
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      
      // Asegurar que todas las fotos tengan displayName
      if (!photo.displayName) {
        photo.displayName = this.getDisplayName(photo.filepath);
      }
    }
  }

  private async savePhotosToPreferences() {
    await Preferences.set({
      key: 'photos',
      value: JSON.stringify(this.photos)
    });
  }

  private getDisplayName(filepath: string): string {
    // Extraer el nombre del archivo sin la extensión
    const filename = filepath.split('/').pop() || filepath;
    return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  displayName?: string; // Nueva propiedad para el nombre a mostrar
}