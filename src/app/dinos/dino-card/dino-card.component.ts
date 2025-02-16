import { Component, Input } from '@angular/core';
import { Dinosaur } from '../I-Dino';
import { SupabaseService } from '../../services/supabase.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-dino-card',
  imports: [],
  templateUrl: './dino-card.component.html',
  styleUrl: './dino-card.component.css'
})
export class DinoCardComponent {
  @Input() dino!: Dinosaur;
  logged: boolean = false;
  url: string = '';

  constructor(private supaService: SupabaseService) {}

  ngOnInit() {
    //this.getUrl();
    this.logged = SupabaseService.loggerSubject.getValue();
    SupabaseService.loggerSubject.subscribe(logged => this.logged = logged);
    this.supaService.isLogged();
    this.url = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${this.dino.name}.jpg&w=1920&q=75`;
  }
  
  onImageError(event: any) {
    const fallbackUrl = `https://www.nhm.ac.uk/discover/dino-directory/_next/image?url=https%3A%2F%2Fwww.nhm.ac.uk%2Fresources%2Fnature-online%2Flife%2Fdinosaurs%2Fdinosaur-directory%2Fimages%2Freconstruction%2Fsmall%2F${this.dino.name?.split("saurus")[0]}.jpg&w=1920&q=75`;
  
    const defaultUrl = "";
  
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
}
