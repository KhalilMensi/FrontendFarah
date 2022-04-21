import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlexEmployee } from 'src/app/models/flex-employee';
import { updateFlexEmployee } from 'src/app/models/updateFlexEmployee';
import { FlexEmployeeService } from 'src/app/services/FlexEmployee/flex-employee.service';

@Component({
  selector: 'app-consult-profil',
  templateUrl: './consult-profil.component.html',
  styleUrls: ['./consult-profil.component.css']
})
export class ConsultProfilComponent implements OnInit {
  id: number ;
  employee: FlexEmployee = new FlexEmployee();
  updateForm: FormGroup;
  errorMsg = "";
  constructor(private flexEmployeeService: FlexEmployeeService,private route:ActivatedRoute, 
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
   this.loadEmployee();
   this.initializeUpdateForm();
  }
  loadEmployee(){
    this.flexEmployeeService.getFlexEmployeeByEmail(JSON.parse(localStorage.getItem('user')).email).subscribe({
      next : response => {
        this.employee = response ; 
        this.putActualValues();
      }, error: error =>{
        console.log(error.error)
      }
    }
    );
  }

  initializeUpdateForm() {
    this.updateForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      oldPassword: new FormControl(''),
      newPassword: new FormControl('', [Validators.minLength(8)||null]),
      confirmNewPassword: new FormControl('', [this.matchValues('newPassword')]),
    })
    this.updateForm.controls['newPassword'].valueChanges.subscribe(() => {
      this.updateForm.controls['confirmNewPassword'].updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
      ? null : {isMatching: true}
    }
  }

  updateFlexEmployee() {
    let flexEmployee : updateFlexEmployee = new updateFlexEmployee();
    let id = this.employee.id;
    flexEmployee.userName = this.updateForm.value.userName;
    flexEmployee.gender = this.updateForm.value.gender;
    flexEmployee.phoneNumber = this.updateForm.value.phoneNumber;
    flexEmployee.department = this.updateForm.value.department;
    flexEmployee.oldPasswordHash = this.updateForm.value.oldPassword;
    flexEmployee.newPassword = this.updateForm.value.newPassword;
    
    this.flexEmployeeService.updateFlexEmployee(id, flexEmployee).subscribe({
      next: response => {
        console.log(response);
        this.toastr.info('account updated successfully!', 'updated!');
        this.errorMsg = ""
      },
      error: error => {
        console.log(error);
        this.errorMsg = error.error;
      }
    });
  }

  putActualValues() {
    this.updateForm.patchValue({
      userName: this.employee.userName,
      gender: this.employee.gender,
      phoneNumber: this.employee.phoneNumber,
      email: this.employee.email,
      department: this.employee.department,
        
    });
  }

}
