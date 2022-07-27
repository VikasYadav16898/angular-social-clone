import { Component, OnInit } from '@angular/core';
// Imports
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password } = f.form.value;

    this.auth
      .signIn(email, password)
      .then((res) => {
        this.toastr.success('SignIn Success');
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        this.toastr.error(err.message, '', {
          closeButton: true,
        });
      });
  }
}
