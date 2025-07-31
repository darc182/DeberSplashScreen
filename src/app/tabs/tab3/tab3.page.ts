import { Component } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgFor] // Añade los imports necesarios
})
export class Tab3Page {
  constructor(public photoService: PhotoService) {}

  async ionViewWillEnter() {
    await this.photoService.loadSaved();
  }
}