import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'stream';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-upload-image',
  imports: [],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent implements OnInit {
  @Input() dinoName!: string;
  //@Output() imageUploaded = new EventEmitter<string>() as unknown as EventEmitter<string>;

  url: string = '';

  constructor(private supaService: SupabaseService) {}

  async ngOnInit() {
    if (!this.dinoName) return;
    await this.uploadDinoImage();
  }

  async uploadDinoImage() {
    const encodedName = encodeURIComponent(this.dinoName);
    const primaryUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${encodedName}.jpg&w=1920&q=75`;
  
    const fallbackUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${this.dinoName?.split("saurus")[0]}.jpg&w=1920&q=75`;
  
    try {
      const finalBlob = await this.downloadImage(primaryUrl) || await this.downloadImage(fallbackUrl);
  
      if (!finalBlob) {
        console.error('❌ No se pudo descargar la imagen con ninguna URL.');
        return;
      }
  
      const fileName = `${this.dinoName.replace(/\s+/g, '_')}.jpg`;
      const uploadedUrl: string | null = await this.supaService.uploadImage(finalBlob, fileName);
  
      // ✅ Solo emitimos si `uploadedUrl` es un string válido
      if (uploadedUrl) {
        this.url = uploadedUrl;
        //setTimeout(() => this.imageUploaded.emit(uploadedUrl), 0); // 🔥 Solución con `setTimeout`
      } else {
        console.error('❌ Error: No se pudo subir la imagen.');
      }
    } catch (error) {
      console.error('🚨 Error al manejar la imagen:', error);
    }
  }
  

  async downloadImage(url: string): Promise<Blob | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('🌍 Imagen no encontrada');
      return await response.blob();
    } catch (error) {
      console.warn(`⚠️ Falló: ${url}`);
      return null;
    }
  }
}
