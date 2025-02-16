import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { CreateDinoFormComponent } from './dinos/create-dino-form/create-dino-form.component';
import { supabaseLoginGuard } from './guards/supabase-login.guard';
import { RegisterComponent } from './components/register/register.component';
import { DinoDetailsComponent } from './dinos/dino-details/dino-details.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'main', component: MainComponent },
    { path: 'crear', component: CreateDinoFormComponent, canActivate: [supabaseLoginGuard] },
    { path: 'dino/:id', component: DinoDetailsComponent, canActivate: [supabaseLoginGuard] },

    // Rutas de Login y Register deben ser accesibles directamente desde la raíz
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Ruta predeterminada (si no se encuentra la ruta, redirige a home)
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
