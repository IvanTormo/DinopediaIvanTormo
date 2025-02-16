import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchSubject = new BehaviorSubject<string>(''); // Contiene el valor de búsqueda

  constructor(private supabaseService: SupabaseService) {}

  // Método para actualizar el valor de búsqueda
  updateSearch(value: string) {
    this.searchSubject.next(value); // Emitimos el nuevo valor de búsqueda
  }

  // Método para obtener dinosaurios filtrados
  searchDinosaurs(atributo: string, valorBusqueda: string): Observable<any[]> {
    return this.supabaseService.getDinosaursByAttribute(atributo, valorBusqueda).pipe(
      map(response => response.data || []),
      tap(dinos => console.log('Dinosaurios filtrados:', dinos))
    );
  }
}
