import { Component, OnInit } from '@angular/core';
import { MainComponent } from "../main/main.component";
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  logged: boolean = false;

    constructor(private supaService:SupabaseService){ }
  
    ngOnInit() {
      this.logged = SupabaseService.loggerSubject.getValue();
      SupabaseService.loggerSubject.subscribe(logged => this.logged = logged)
      this.supaService.isLogged();
    }
  
    async logout(){
      await this.supaService.logout();
    }
}
