import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import en from 'src/assets/translate/en';
import fr from '../../../../assets/translate/fr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  language: any = en; 
  loginForm : FormGroup;
  errorMsg :"";

  user : User = new User();

  constructor(private loginService : LoginService, private router : Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
    })
  }

  login(){
    this.user.email = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;
    
    this.loginService.login(this.user).subscribe({
      next : response => {
        console.log(response);
        this.router.navigate(['/dashboard']);
        this.loginForm.reset();
      },error : error => {
        console.log(error);
        this.errorMsg = error.error;
      }
    })
  }

}
