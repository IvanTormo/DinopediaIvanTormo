import { Component } from '@angular/core';
import { DinosListComponent } from "../../dinos/dinos-list/dinos-list.component";

@Component({
  selector: 'app-main',
  imports: [DinosListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
}
