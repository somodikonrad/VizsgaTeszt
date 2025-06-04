import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, User } from '../../services/api.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;

  name: string = '';
  email: string = '';
  age: number = 0;

  users: User[] = [];

  isEditing: boolean = false;
  editUserId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  onSubmit(): void {
    const user: User = {
      name: this.name,
      email: this.email,
      age: this.age,
      id: 0
    };

    if (this.isEditing && this.editUserId !== null) {
      this.apiService.updateUser({ ...user, id: this.editUserId }).subscribe({
        next: () => {
          this.successMessage = 'A felhasználó sikeresen frissítve lett!';
          this.errorMessage = null;
          this.resetForm();
          this.fetchUsers();
          this.clearMessagesAfterTimeout();
        },
        error: () => {
          this.errorMessage = 'Hiba történt a felhasználó frissítésekor.';
          this.successMessage = null;
          this.clearMessagesAfterTimeout();
        }
      });
    } else {
      this.apiService.addUser(user).subscribe({
        next: () => {
          this.successMessage = 'Új felhasználó sikeresen hozzáadva!';
          this.errorMessage = null;
          this.resetForm();
          this.fetchUsers();
          this.clearMessagesAfterTimeout();
        },
        error: () => {
          this.errorMessage = 'Hiba történt az új felhasználó hozzáadásakor.';
          this.successMessage = null;
          this.clearMessagesAfterTimeout();
        }
      });
    }
  }

  fetchUsers(): void {
    this.apiService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  deleteUser(id: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'Felhasználó sikeresen törölve!';
          this.errorMessage = null;
          this.fetchUsers();
          this.clearMessagesAfterTimeout();
        },
        error: () => {
          this.errorMessage = 'Hiba történt a felhasználó törlésekor.';
          this.successMessage = null;
          this.clearMessagesAfterTimeout();
        }
      });
    }
  }

  clearMessagesAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 4000);
  }

  editUser(user: User): void {
    this.name = user.name;
    this.email = user.email;
    this.age = user.age;
    this.editUserId = user.id ?? null;
    this.isEditing = true;
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.age = 0;
    this.editUserId = null;
    this.isEditing = false;
  }
}
