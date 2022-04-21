import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientEmployee } from 'src/app/models/client-employee';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { LoggedInUser } from 'src/app/models/loggedInUser';
import { ClientEmployeeService } from 'src/app/services/clientEmployee/client-employee.service';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { map } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  clientEntrepriseList: ClientEntreprise[];
  allClientEntreprises: ClientEntreprise[];
  clientEntreprise: ClientEntreprise = new ClientEntreprise();
  entrepriseId;
  errorMsg:"";

  constructor(private clientEmployeeService : ClientEmployeeService,
    private clientEntrepriseService : ClientEntrepriseService, 
    private http: HttpClient, private router : Router) { }
 
  ngOnInit(): void {
    this.getAllClientEntreprises();
    this.initializeForm();
  }
  
  clientEmployee : ClientEmployee = new ClientEmployee();

  initializeForm(){
    this.registerForm = new FormGroup({
      fullName: new FormControl('',Validators.required),
      phoneNumber: new FormControl('',[Validators.required]),
      gender: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      company: new FormControl('',Validators.required),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('',[Validators.required, this.matchValues('password')])
    })
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    })
    this.registerForm.get('company').valueChanges.subscribe(response => {
      this.filterData(response);
    })
  }

  getEntrepriseId(id: number){
    this.entrepriseId = id;
  }

  filterData(data: string){
    this.clientEntrepriseList = this.allClientEntreprises.filter(item => {
      return item.name.toLowerCase().indexOf(data.toLowerCase())> -1
    })
  }

  filterDataByName(name: string){
    let entreprise: ClientEntreprise = null;
    this.allClientEntreprises.filter(item => {
      if(item.name.toLowerCase() == name.toLowerCase())
        entreprise = item;
    });
    return entreprise;
  }
  //a validator for confirmPassword
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
      ? null : {isMatching: true}
    }
  }


  
  register(){
    this.clientEmployee.userName = this.registerForm.value.fullName;
    this.clientEmployee.phoneNumber = this.registerForm.value.phoneNumber;
    this.clientEmployee.gender = this.registerForm.value.gender;
    this.clientEmployee.email = this.registerForm.value.email;
    this.clientEmployee.passwordHash = this.registerForm.value.password;
    this.clientEmployee.creationDate = new Date();
    let entreprise = this.filterDataByName(this.registerForm.value.company); 
    if(entreprise != null){
      this.clientEmployee.entrepriseId = entreprise.id;
      if(entreprise.type == "0")
        this.clientEmployee.role = "Prospect";
      else 
        this.clientEmployee.role = "Client";
      this.addClientEmployee(this.clientEmployee);
    }else{
      this.clientEntreprise.name = this.registerForm.value.company;
      this.clientEntreprise.type = "Prospect";
      this.clientEmployee.role = "Prospect";
      this.clientEntrepriseService.addClientEntreprise(this.clientEntreprise).subscribe({
        next: response => {
          this.clientEmployee.entrepriseId = +response;
          this.addClientEmployee(this.clientEmployee);
          console.log(+response);
        }, error: error =>{
          console.log(error);
        }
      })
    }
    
  };

  addClientEmployee(clientEmployee: ClientEmployee){
    this.clientEmployeeService.registerClientEmployee(this.clientEmployee).pipe(
      map((response : LoggedInUser) => {
        const loggedInUser = response;
        if(loggedInUser) {
          localStorage.setItem('user', JSON.stringify(loggedInUser));
        }
      })
    ).subscribe({
      next: response =>{
        console.log(response);
        this.router.navigate(['/dashboard']);
      },
      error: error =>{
        console.log(error);
        this.errorMsg = error.error;
        this.getAllClientEntreprises();
      }
    });
  }

  getAllClientEntreprises(){
    this.clientEntrepriseService.getAllEntreprises().subscribe({
      next: response => {
        this.clientEntrepriseList = response;
        this.allClientEntreprises = response;
      },
      error: error =>{
        console.log(error);
      }
    })
  }
}
