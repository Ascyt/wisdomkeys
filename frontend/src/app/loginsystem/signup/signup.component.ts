import { Component } from '@angular/core';
import { BackendService } from '../../backend.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  error: string|undefined = undefined;

  constructor(public backendService:BackendService, private router:Router) {
    this.error = undefined;
  }
  
  onSubmit() {
    this.backendService.signup(this.username, this.password)
      .then((response) => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
          this.error = 'Signup failed';
          console.error('Signup failed', error);
      });
  }
}
