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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  passwordVisible: boolean = false;
  passwordConfirmVisible: boolean = false;
  subscribeForm!: FormGroup;
  confirmPass$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  buttonIsClicked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router
  ) {}

  confirmPasswordCorrected() {
    this.confirmPass$.next(false);

    if (
      this.subscribeForm.controls['password'].value ===
      this.subscribeForm.controls['confirmPassword'].value
    ) {
      this.subscribeForm.controls['confirmPassword'].setErrors(null);
      this.confirmPass$.next(true);
    } else {
      this.subscribeForm.controls['confirmPassword'].setErrors({
        notEqual: true,
      });
      this.confirmPass$.next(false);
    }
  }

  ngOnInit(): void {
    this.subscribeForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      confirmPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  geterrorsC(username: string, error: string) {
    return this.subscribeForm.get(username)?.errors![error];
  }

  getFormC(username: string) {
    return this.subscribeForm.get(username);
  }

  onRegister() {
    const data = {
      username: this.subscribeForm.controls['username'].value,
      email: this.subscribeForm.controls['email'].value,
      password: this.subscribeForm.controls['password'].value,
    };

    try {
      this.authSrv.register(data).subscribe();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
      alert(error);
      this.router.navigate(['/register']);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('inputPassword');
    if (passwordInput) {
      passwordInput.setAttribute(
        'type',
        this.passwordVisible ? 'text' : 'password'
      );
    }
  }
  togglePasswordVisibilityConfirm(): void {
    this.passwordConfirmVisible = !this.passwordConfirmVisible;
    const passwordConfirmInput = document.getElementById(
      'inputConfirmPassword'
    );
    if (passwordConfirmInput) {
      passwordConfirmInput.setAttribute(
        'type',
        this.passwordConfirmVisible ? 'text' : 'password'
      );
    }
  }

  handleClick() {
    this.buttonIsClicked = true;

    // Rimuovi la classe dopo un certo periodo di tempo (ad esempio 300ms)
    setTimeout(() => {
      this.buttonIsClicked = false;
    }, 300);
  }
}
