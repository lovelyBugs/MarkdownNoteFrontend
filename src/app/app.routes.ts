import { Routes } from '@angular/router';
import { NoteComponent } from './pages/note/note.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/notes' },
  // {path : 'note', pathMatch:"full", component:NoteComponent},
  {path : 'notes', children :[
    {path : '**', component:NoteComponent},
  ]},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
