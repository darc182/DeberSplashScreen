import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonImg, 
  IonButton, 
  IonIcon, 
  IonFab, 
  IonFabButton 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class HomePage {
  constructor(public photoService: PhotoService) {}

  async loadPhotos() {
    await this.photoService.loadSaved();
  }
}