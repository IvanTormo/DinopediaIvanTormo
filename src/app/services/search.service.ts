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
  searchDinosaurs(atributo: string, valorBusqueda: string, page: number, pageSize: number): Observable<any[]> {
    const offset = (page - 1) * pageSize;
  
    return this.supabaseService.getDinosaursByAttribute(atributo, valorBusqueda, pageSize, offset).pipe(
      map(response => response.data || []),
      /* Si deseas, puedes usar 'tap' para debuguear los dinosaurios filtrados */
      /* tap(dinos => console.log('Dinosaurios filtrados:', dinos)) */
    );
  }
}
