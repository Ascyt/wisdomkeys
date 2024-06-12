import { Component } from '@angular/core';
import { BackendService } from '../../backend.service';
import { Router } from '@angular/router';
import { ValuesService } from '../../values.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  constructor(public backendService:BackendService, private router:Router, public valuesService:ValuesService) {
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
