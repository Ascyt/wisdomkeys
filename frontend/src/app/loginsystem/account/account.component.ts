import { Component } from '@angular/core';
import { BackendService } from '../../backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  constructor(public backendService:BackendService, private router:Router) {
  }

  logout() {
    this.backendService.logout();

    this.router.navigate(['/']);
  }

  deleteAccount() {
    this.backendService.deleteAccount();
    this.backendService.logout();

    this.router.navigate(['/']);
  }
}
