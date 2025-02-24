import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dinosaur } from '../I-Dino';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-dino-details',
  imports: [],
  templateUrl: './dino-details.component.html',
  styleUrl: './dino-details.component.css'
})
export class DinoDetailsComponent {
    @Input('nombre') dinoNombre!: string;
    dino!: Dinosaur;
    constructor(private searchService: SearchService){

   }
   ngOnInit(): void{
    this.searchService.searchDinosaurs("name", this.dinoNombre/*,1,5*/)
          .subscribe(dinosaurs => {
            this.dino = dinosaurs[0]; // Actualizamos la lista en el componente
          });
   }
}
