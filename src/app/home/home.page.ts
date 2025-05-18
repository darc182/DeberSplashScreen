import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonFab, 
  IonFabButton, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonImg, 
  IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, trash } from 'ionicons/icons';
import { NgFor } from '@angular/common'; // Importa NgFor

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonFab, 
    IonFabButton, 
    IonIcon, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonImg, 
    IonButton,
    NgFor // Añade NgFor a los imports
  ]
})
export class HomePage {
  constructor(public photoService: PhotoService) {
    addIcons({ camera, trash });
  }

  async ngOnInit() {
  await this.photoService.loadSaved();
}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  deletePhoto(photo: any, position: number) {
    this.photoService.deletePhoto(photo, position);
  }
}