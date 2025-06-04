import { Routes } from '@angular/router';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'userList', pathMatch: 'full' }, // alapértelmezett átirányítás
  { path: 'userCreate', component: UserCreateComponent },
  { path: 'userList', component: UserListComponent },
];
