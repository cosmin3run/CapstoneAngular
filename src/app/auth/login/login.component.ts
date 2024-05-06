import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginError!: string | null;
  subscriptions: Subscription[] = [];
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private errorSrv: ErrorService
  ) {
    this.subscriptions.push(
      this.errorSrv.error.subscribe((res) => (this.loginError = res))
    );
  }

  ngOnInit(): void {}

  onLogin(form: NgForm) {
    console.log(form.value);
    const data = {
      email: form.value.email,
      password: form.value.password,
    };
    try {
      this.authSrv.login(data).subscribe();
      this.router.navigate(['/home']);
    } catch (error) {
      alert('Login errato');
      console.log(error);
      this.router.navigate(['/login']);
    }
  }
}
