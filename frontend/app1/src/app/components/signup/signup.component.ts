import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  username: string | undefined;
  password: string | undefined;
  email: string | undefined;

  onSubmit() {
    console.log('Form submitted!');
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Email:', this.email);
    
  }
}
