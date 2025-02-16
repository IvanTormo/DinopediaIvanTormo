import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { SupabaseService } from '../../services/supabase.service';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { Dinosaur } from '../../dinos/I-Dino';
import { DinoCardComponent } from '../dino-card/dino-card.component';

@Component({
  selector: 'app-dinos-list',
  imports: [CommonModule, DinoCardComponent],
  templateUrl: './dinos-list.component.html',
  styleUrl: './dinos-list.component.css'
})
export class DinosListComponent {

  logged: boolean = false;
  public dinos: Dinosaur[] = [];
  private searchSubscription?: Subscription;

  constructor(
    private supaService: SupabaseService,  // Si aún lo necesitas para otras operaciones
    private searchService: SearchService  // Servicio para manejar la búsqueda
  ) {}

  ngOnInit(): void {
    this.logged = SupabaseService.loggerSubject.getValue();
    SupabaseService.loggerSubject.subscribe(logged => this.logged = logged);
    this.supaService.isLogged();
    
    // Nos suscribimos a los cambios en la búsqueda y recuperamos los dinosaurios
    this.searchSubscription = this.searchService.searchSubject
      .pipe(
        //debounceTime(500), // Retrasamos la búsqueda para evitar demasiadas peticiones
        distinctUntilChanged(), // Evitamos peticiones innecesarias si el usuario escribe lo mismo
        switchMap(searchValue => this.searchService.searchDinosaurs("name", searchValue))
      )
      .subscribe(dinosaurs => {
        console.log("Dinosaurios filtrados:", dinosaurs);
        this.dinos = dinosaurs; // Actualizamos la lista en el componente
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
