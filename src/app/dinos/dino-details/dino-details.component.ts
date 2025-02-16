import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dinosaur } from '../I-Dino';

@Component({
  selector: 'app-dino-details',
  imports: [],
  templateUrl: './dino-details.component.html',
  styleUrl: './dino-details.component.css'
})
export class DinoDetailsComponent {
  @Input('id') dinoID?: string;
  
    dino!: Dinosaur;
     constructor(private activateRoute: ActivatedRoute){
    
   }
   ngOnInit(): void{
    //this.recipe = recipes.filter((recipe)=>recipe.idMeal===this.recipeID)[0];
    
    //this.activateRoute.params.subscribe(params => this.recipeID = params['id'])
   }
}
