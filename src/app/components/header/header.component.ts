import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink , ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  logged: boolean = false;
  searchForm: FormGroup;
  private searchSubscription?: Subscription;

  private busqueda!: string;

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private supaService: SupabaseService,
    public router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      searchInput: ['']
    });
  }

  ngOnInit(): void {
    this.logged = SupabaseService.loggerSubject.getValue();
    SupabaseService.loggerSubject.subscribe(logged => this.logged = logged);
    this.supaService.isLogged();

    this.searchForm.get('searchInput')?.valueChanges.subscribe(searchValue => {
      this.busqueda = searchValue;
      //this.searchService.searchDinosaurs("name",searchValue);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  async logout() {
    await this.supaService.logout();
  }

  confirmarBusqueda(){
    if (this.busqueda === undefined) {
      return;
    }
    this.searchService.updateSearch(this.busqueda);
  }
}
