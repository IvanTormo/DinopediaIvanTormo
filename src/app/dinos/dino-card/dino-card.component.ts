import { Component, Input } from '@angular/core';
import { Dinosaur } from '../I-Dino';
import { SupabaseService } from '../../services/supabase.service';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-dino-card',
  imports: [RouterLink],
  templateUrl: './dino-card.component.html',
  styleUrl: './dino-card.component.css'
})
export class DinoCardComponent {
  @Input() dino!: Dinosaur;
  logged: boolean = false;
  url: string = '';

  constructor(private supaService: SupabaseService) {}

  async ngOnInit() {
    // Verificar el estado de inicio de sesión y configurar la URL inicial
    this.logged = SupabaseService.loggerSubject.getValue();
    SupabaseService.loggerSubject.subscribe(logged => this.logged = logged);
    this.supaService.isLogged();
    this.url = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${this.dino.name}.jpg&w=1920&q=75`;
  
    // Llamar a la función para obtener la imagen, no es asincrónico aquí, solo manejamos los flujos de datos
    this.uploadDinoImage();
  }
  
  onImageError(event: any) {
    const fallbackUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${this.dino.name?.split("saurus")[0]}.jpg&w=1920&q=75`;
  
    const defaultUrl = "/placeholder.png";
  
    if (!event.target.dataset.errorCount) {
      event.target.dataset.errorCount = "0";
    }
  
    let errorCount = parseInt(event.target.dataset.errorCount, 10);
  
    if (errorCount === 0) {
      event.target.src = fallbackUrl;
    } else {
      event.target.src = defaultUrl;
    }
  
    event.target.dataset.errorCount = (errorCount + 1).toString();
  }
  
  uploadDinoImage(): void {
    if (!this.dino.name) return;

    const encodedName = encodeURIComponent(this.dino.name!);
    this.url = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${encodedName}.jpg&w=1920&q=75`
    // El nombre del archivo que se guarda en Supabase (ejemplo: 'Tyrannosaurus_Rex.jpeg')
    /*const fileName = `${this.dino.name.replace(/\s+/g, '_')}.jpeg`;
  
    // Verificamos primero si ya tenemos la URL de la imagen en el objeto 'dino'
    let imageUrl = this.dino.image_url;  // Esto es solo el nombre del archivo
  
    if (imageUrl) {
      console.log("Hay imagen de ",this.dino.name,": ",imageUrl);
      
      // Si tenemos el nombre del archivo, generamos la URL completa para acceder a Supabase
      this.supaService.getImageUrl(imageUrl).subscribe({
        next: (url) => {
          // Si encontramos la imagen en Supabase, la usamos
          console.log(url);
          
          this.url = url;
        },
        error: () => {
          // Si no encontramos la imagen en Supabase, intentamos con la URL externa
          const encodedName = encodeURIComponent(this.dino.name!);
          const sourceImageUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${encodedName}.jpg&w=1920&q=75`;
  
          fetch(sourceImageUrl).then(response => {
            if (!response.ok) {
              throw new Error('No se pudo descargar la imagen desde la fuente externa');
            }
            return response.blob();
          }).then(() => {
            // Si la imagen externa es válida, la usamos
            this.url = sourceImageUrl;
          }).catch(() => {
            // Si falla la descarga de la imagen externa, usamos el fallback
            this.url = '/placeholder.png'; // Ruta al placeholder en la carpeta public
          });
        }
      });
      return; // Si ya tenemos la imagen, no necesitamos hacer más
    }
  
    // Si no tenemos la imagen, intentamos obtenerla desde Supabase
    this.supaService.getImageUrl(fileName).subscribe({
      next: (url) => {
        // Si encontramos la imagen en Supabase, la usamos
        this.url = url;
      },
      error: () => {
        // Si no encontramos la imagen en Supabase, intentamos con la URL externa
        const encodedName = encodeURIComponent(this.dino.name!);
        const sourceImageUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${encodedName}.jpg&w=1920&q=75`;
  
        fetch(sourceImageUrl).then(response => {
          if (!response.ok) {
            throw new Error('No se pudo descargar la imagen desde la fuente externa');
          }
          return response.blob();
        }).then(() => {
          // Si la imagen externa es válida, la usamos
          this.url = sourceImageUrl;
        }).catch(() => {
          // Si falla la descarga de la imagen externa, usamos el fallback
          this.url = '/placeholder.png'; // Ruta al placeholder en la carpeta public
        });
      }
    });*/
  }
  
  
  
}
