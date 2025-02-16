import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, from, interval, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

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
    const { data, error } = await this.supabase.from(table).select('*');
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    
    return data;
  }

  getDinosaursByAttribute(attribute: string, value: string): Observable<any> {
    return from(
      this.supabase
        .from('dinosaurs')
        .select()
        .ilike(attribute, `%${value}%`)
        //.limit(20) // Número máximo de filas
    );
  }

  insertRow(table: string, data: any) {
    return from(this.supabase
      .from(table)
      .insert([data])).pipe(
        tap(({data, error}) => {
          if (error !== null) {
            console.log("Error en la inserción: ",error);
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

  login(email: string,password: string){
    return from(this.supabase.auth.signInWithPassword({
      email,
      password
    })).pipe(
      map(({data, error}) => {
        if (error) {
          throw error;
        }
        return data;
      }),
      tap(() => this.isLogged())
    );

    /*let {data,error} = await this.supabase.auth.signInWithPassword({
      email,
      password
    });*/
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
}
