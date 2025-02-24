import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, catchError, from, interval, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient
  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  

  getDataObservable(table: string): Observable<any[]> {
    return from(this.getData(table));
  }

  getRegistro(correo: string, contrasenya: string): Observable<AuthResponse>{
    return this.registerObservable(correo, contrasenya);
  }

  registerObservable(correo: string, contrasenya: string): Observable<AuthResponse> {
    return from(this.supabase.auth.signUp({
      email: correo,
      password: contrasenya,
    })).pipe(
      tap(({data, error}) => {
        if (error !== null) {
          console.log("Error en el registro:",error);
          throw error;
        } else {
          console.log(data);
        }
      })
    );
  }

  async getData(table: string): Promise<any[]> {
    const { data, error } = await this.supabase.from(table).select('*').limit(20);
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    
    return data;
  }

  getDinosaursByAttribute(attribute: string, value: string/*, page: number, pageSize: number*/): Observable<any> {
    /*const start = (page - 1) * pageSize; // El primer registro de la página
    const end = start + pageSize - 1; // El último registro de la página*/
  
    return from(
      this.supabase
        .from('dinosaurs')
        .select()
        .ilike(attribute, `%${value}%`)  // Filtro de búsqueda por el atributo
        .limit(20)  // Limitar los resultados por página
        /*.range(start, end)  // Rango de resultados, esto reemplaza al offset*/
    );
  }
  

  // Usando el método upsert en lugar de insert
  guardarDino(datos: any, tabla: string = "dinosaurs") {
    return from(this.supabase
      .from(tabla)
      .upsert([datos], { onConflict: 'name' })
    ).pipe(
      tap(({ data, error }) => {
        if (error) {
          console.log("Error en la inserción: ", error);
          throw error;
        } else {
          console.log(data);
        }
      })
    );
  }


  getInterval(): Observable<Number>{
    return interval(1000);
  }

  login(email: string, password: string) {
    return from(this.supabase.auth.signInWithPassword({
      email,
      password
    })).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return { data, error: null }; // Devuelve 'data' y un 'error' como null en caso de éxito
      }),
      catchError((error) => {
        return of({ data: null, error }); // Si hay error, devuelve 'data' como null y el error
      }),
      tap(() => this.isLogged())
    );
  }
  

  register(email: string,password: string){
    return from(this.supabase.auth.signUp({
      email,
      password
    })).pipe(
      
      map(({data, error}) => {
        if (error) {
          throw error;
        }
        return data;
      }),
      tap((data)=>console.log(data))
      //tap(() => this.isLogged())
    );
  }

  static loggerSubject = new BehaviorSubject(false);

  async isLogged(){
    const { data: {user}} = await this.supabase.auth.getUser();
    if(user) {
      SupabaseService.loggerSubject.next(true);
    } else {
      SupabaseService.loggerSubject.next(false);
    }
  }

  async logout(){
    await this.supabase.auth.signOut();
    SupabaseService.loggerSubject.next(false);
  }

  getImageUrl(fileName: string): Observable<string> {
    const uniqueFileName = `${fileName}`;
    
    // Obtenemos la URL pública desde Supabase
    const { data } = this.supabase
      .storage
      .from('dino-images')
      .getPublicUrl(uniqueFileName);
  
    // Si existe la URL pública, la devolvemos como un Observable
    if (data && data.publicUrl) {
      return of(data.publicUrl);
    } else {
      // Si no encontramos la imagen en Supabase, retornamos un error
      return throwError(() => new Error('No se pudo obtener la URL pública desde Supabase'));
    }
  }
  
  
}
