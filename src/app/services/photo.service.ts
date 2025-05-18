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

    // Guardar la foto y agregarla a la galería
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // Guardar en preferencias
    Preferences.set({
      key: 'photos',
      value: JSON.stringify(this.photos)
    });
  }

  

  public async deletePhoto(photo: UserPhoto, position: number) {
    // Eliminar foto del array
    this.photos.splice(position, 1);

    // Actualizar preferencias
    Preferences.set({
      key: 'photos',
      value: JSON.stringify(this.photos)
    });

    // Eliminar archivo del sistema de archivos
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  private async savePicture(photo: Photo) {
  // Convertir foto a base64
  const base64Data = await this.readAsBase64(photo);

  // Escribir el archivo
  const fileName = `${Date.now()}.jpeg`;
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
  }
}
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}