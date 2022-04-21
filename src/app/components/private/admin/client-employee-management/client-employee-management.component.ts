import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientEmployee } from 'src/app/models/client-employee';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { LoggedInUser } from 'src/app/models/loggedInUser';
import { ClientEmployeeService } from 'src/app/services/clientEmployee/client-employee.service';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-client-employee-management',
  templateUrl: './client-employee-management.component.html',
  styleUrls: ['./client-employee-management.component.css']
})
export class ClientEmployeeManagementComponent implements OnInit {

  registerForm: FormGroup;
  updateForm: FormGroup;
  employeeName: string;
  clientEmployees: ClientEmployee[];
  allClientEmployees:ClientEmployee[];
  clientEmployee: ClientEmployee = new ClientEmployee();
  role: string;
  clientEntrepriseList: ClientEntreprise[];
  allClientEntreprises: ClientEntreprise[];
  clientEntreprise: ClientEntreprise = new ClientEntreprise();
  entrepriseId;
  errorMsg:"";
  title='pagination';
  page:number =1;
  count:number=0;
  tableSize:number=10;
  tableSizes:any=[5,10,15,20];
  constructor(private clientEmployeeService : ClientEmployeeService,
    private clientEntrepriseService : ClientEntrepriseService, 
    private http: HttpClient, private router : Router, private loginService: LoginService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllClientEmployees();
    this.getAllClientEntreprises();
    this.initializeAddForm();
    this.initializeUpdateForm();
  }
  setCurrentUser(){
    const user: LoggedInUser = JSON.parse(localStorage.getItem('user'));
    this.loginService.setCurrentUser(user);
  }
  changeRole(e) {
    this.role = String(e.target.value);
  }
  search() {
    this.clientEmployees = this.allClientEmployees.filter(item => {
      return item.userName.toLowerCase().indexOf(this.employeeName.toLowerCase()) > -1
    })
  }

  //Add client employee form
  getAllClientEmployees() {
    this.clientEmployeeService.getAllClientEmployees().subscribe({
      next: response => {
        this.clientEmployees = response
        this.allClientEmployees=response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getAllClientEmployees();
  }
  onTableSizeChange(event :any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllClientEmployees();
  }

  initializeAddForm(){
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
    console.log(this.clientEntrepriseList)
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
      this.clientEmployee.role = entreprise.type;
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
    this.clientEmployeeService.addClientEmployee(this.clientEmployee).subscribe({
      next: response =>{
        console.log(response);
        this.toastr.success('new account added!','Success!'); 
        this.getAllClientEmployees();
      },
      error: error =>{
        console.log(error);
        this.errorMsg = error.error;
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

  //Update client employee form

  initializeUpdateForm() {
    this.updateForm = new FormGroup({
      id: new FormControl(),
      userName: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
    })
  }

  updateClientEmployee() {
    let id = this.updateForm.value.id;
    this.clientEmployee.userName = this.updateForm.value.userName;
    this.clientEmployee.gender = this.updateForm.value.gender;
    this.clientEmployee.phoneNumber = this.updateForm.value.phoneNumber;
    this.clientEmployeeService.safeUpdateClientEmployee(id, this.clientEmployee).subscribe({
      next: response => {
        console.log(response);
        this.toastr.info('account updated successfully!', 'updated!');
       this.getAllClientEmployees(); 
      },
      error: error => {
        console.log(error);
      }
    });
  }

  putActualValues(clientEmployee: ClientEmployee) {
    this.updateForm.patchValue({
      id: clientEmployee.id,
      userName: clientEmployee.userName,
      gender: clientEmployee.gender,
      phoneNumber: clientEmployee.phoneNumber,    
    });
  }


  deleteClientEmployee(id){
    this.clientEmployeeService.deleteClientEmployee(id).subscribe({
      next : response => {
        console.log(response);
        this.getAllClientEmployees();
      }, error : error => {
        console.log(error);
      }
    })
    this.toastr.error('account deleted successfully!','Done!'); 
    this.getAllClientEmployees();
  }
}
