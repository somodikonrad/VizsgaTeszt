import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
 users: User[] = [];

  editUserId: number | null = null;
  editName: string = '';
  editEmail: string = '';
  editAge: number = 0;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.errorMessage = 'Felhasználók lekérése sikertelen.';
        this.clearMessagesAfterTimeout();
      }
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

  startEdit(user: User): void {
    this.editUserId = user.id;
    this.editName = user.name;
    this.editEmail = user.email;
    this.editAge = user.age;
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editName = '';
    this.editEmail = '';
    this.editAge = 0;
  }

  onUpdateUser(): void {
    if (this.editUserId === null) return;

    const updatedUser: User = {
      id: this.editUserId,
      name: this.editName,
      email: this.editEmail,
      age: this.editAge,
    };

    this.apiService.updateUser(updatedUser).subscribe({
      next: () => {
        this.successMessage = 'Felhasználó sikeresen frissítve!';
        this.errorMessage = null;
        this.cancelEdit();
        this.fetchUsers();
        this.clearMessagesAfterTimeout();
      },
      error: () => {
        this.errorMessage = 'Hiba történt a felhasználó frissítésekor.';
        this.successMessage = null;
        this.clearMessagesAfterTimeout();
      }
    });
  }

  clearMessagesAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 4000);
  }
}
