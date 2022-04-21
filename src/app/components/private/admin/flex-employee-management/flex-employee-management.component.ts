import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FlexEmployee } from 'src/app/models/flex-employee';
import { LoggedInUser } from 'src/app/models/loggedInUser';
import { FlexEmployeeService } from 'src/app/services/FlexEmployee/flex-employee.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-flex-employee-management',
  templateUrl: './flex-employee-management.component.html',
  styleUrls: ['./flex-employee-management.component.css']
})
export class FlexEmployeeManagementComponent implements OnInit {

  
  registerForm: FormGroup;
  updateForm: FormGroup;
  employeeName: string;
  flexEmployees: FlexEmployee[];
  allFlexEmployees: FlexEmployee[];
  flexEmployee: FlexEmployee = new FlexEmployee();
  role: string;
  constructor(private flexEmployeeService: FlexEmployeeService, private loginService: LoginService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllFlexEmployees();
    this.initializeRegisterForm();
    this.initializeUpdateForm();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user: LoggedInUser = JSON.parse(localStorage.getItem('user'));
    this.loginService.setCurrentUser(user);
    console.log(this.loginService.currentUser$);
  }

  search() {
    this.flexEmployees = this.allFlexEmployees.filter(item => {
      return item.userName.toLowerCase().indexOf(this.employeeName.toLowerCase()) > -1
    })
  }
  initializeRegisterForm() {
    this.registerForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),      
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    })
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    })

  }

  //a validator for confirmPassword
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }

  addFlexEmployee() {
    this.flexEmployee.userName = this.registerForm.value.userName;
    this.flexEmployee.gender = this.registerForm.value.gender;
    this.flexEmployee.email = this.registerForm.value.email;
    this.flexEmployee.role = this.role;
    this.flexEmployee.phoneNumber = this.registerForm.value.phoneNumber;
    this.flexEmployee.department = this.registerForm.value.department;
    this.flexEmployee.passwordHash = this.registerForm.value.password;
    this.flexEmployee.creationDate = new Date();
    this.flexEmployeeService.addFlexEmployee(this.flexEmployee).subscribe({
      next: response => {
        console.log(response);
        this.toastr.info('account updated successfully!', 'updated!');
        this.getAllFlexEmployees();
      },
      error: error => {
        console.log(error);
      }
    });
    this.registerForm.reset();
  }

  initializeUpdateForm() {
    this.updateForm = new FormGroup({
      id: new FormControl(),
      userName: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
    })
  }

  updateFlexEmployee() {
    let id = this.updateForm.value.id;
    this.flexEmployee.userName = this.updateForm.value.userName;
    this.flexEmployee.gender = this.updateForm.value.gender;
    this.flexEmployee.phoneNumber = this.updateForm.value.phoneNumber;
    this.flexEmployee.role = this.updateForm.value.role;
    this.flexEmployee.department = this.updateForm.value.department;
    this.flexEmployeeService.safeUpdateFlexEmployee(id, this.flexEmployee).subscribe({
      next: response => {
        console.log(response);
        this.toastr.info('account updated successfully!', 'updated!');
        this.getAllFlexEmployees()
      },
      error: error => {
        console.log(error);
      }
    });
  }

  putActualValues(flexEmployee: FlexEmployee) {
    this.updateForm.patchValue({
      id: flexEmployee.id,
      userName: flexEmployee.userName,
      gender: flexEmployee.gender,
      phoneNumber: flexEmployee.phoneNumber,
      email: flexEmployee.email,
      department: flexEmployee.department,
      role: flexEmployee.role=="Employee" ? "Employee" : "Admin"
        
    });
  }


  getAllFlexEmployees() {
    this.flexEmployeeService.getAllFlexEmployees().subscribe({
      next: response => {
        this.flexEmployees = response
        this.allFlexEmployees = response
      },
      error: error => {
        console.log(error)
      }
    })
  }

  deleteFlexEmployee(id: number) {
    this.flexEmployeeService.deleteFlexEmployee(id).subscribe({
      next: response => {
        console.log(response);
        this.getAllFlexEmployees();
      },
      error: error => {
        console.log(error)
      }
    })
    this.toastr.error('account deleted successfully!','Done!'); 
    this.getAllFlexEmployees();
  }

  changeRole(e) {
    this.role = String(e.target.value);
  }

}
