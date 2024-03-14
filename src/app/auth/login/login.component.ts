import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(form: NgForm) {
    try {
      this.authSrv.login(form.value).subscribe();
    } catch (error) {
      alert('Login errato!');
      this.router.navigate(['/login']);
    }
  }
}
