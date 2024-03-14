import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup | null = null;

  constructor(
    private authSrv: AuthService,
    private router: Router // private formBuilder: FormBuilder
  ) {
    // this.registerForm = this.formBuilder.group({
    //   username: new FormControl('', [Validators.required]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   password: new FormControl('', [Validators.required]),
    //   confirmPassword: ['', Validators.required],
    // });
  }

  userData: User = {
    username: '',
    email: '',
    password: '',
  };

  ngOnInit(): void {}

  register() {
    try {
      this.authSrv.register(this.userData).subscribe();
    } catch (error: any) {
      alert(error);
      this.router.navigate(['/register']);
    }
  }

  passwordsMatch(): boolean {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = this.registerForm?.get('confirmPassword')?.value;
    return password === confirmPassword;
  }
}
