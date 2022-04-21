import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ClientEmployee } from 'src/app/models/client-employee';
import { Project } from 'src/app/models/project';
import { ClientEmployeeService } from 'src/app/services/clientEmployee/client-employee.service';
import { ProjectService } from 'src/app/services/project/project.service';
@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {
  
  public Editor = ClassicEditor;
  project: Project = new Project();
  requestForm: FormGroup;
  clientEmployee: ClientEmployee;
  ckeditorData: string;
  //c = 0;
  //contCharacter: string = this.c+"/1000";
  
  constructor(private projectService : ProjectService, private toastr: ToastrService,
    private clientEmployeeService: ClientEmployeeService) { }

  ngOnInit(): void {
    this.initializeAddForm();
    this.getClientEmployee();
  }

  initializeAddForm() {
    this.requestForm = new FormGroup({
      subject: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
    })
  }

  public onChange( { editor }: ChangeEvent ) {
    this.ckeditorData = editor.getData();
    //this.c = editor.getData().length
    //this.contCharacter = this.c+"/4000"
  }

  submit(){
    this.project.creationDate = new Date();
    this.project.subject = this.requestForm.value.subject;
    this.project.description = this.ckeditorData;
    this.project.clientEntrepriseId = this.clientEmployee.entrepriseId;
    this.project.stage = "Request";
    
    this.projectService.addProject(this.project).subscribe({
      next: response => {
        console.log(response);
        this.toastr.info('Request successfully submited!', 'SUCCESS');
        location.reload();
      }, error: error => {
        console.log(error.error);
        this.toastr.error('Failed to submit the request', 'Failure');
      }
    })
  }

  getClientEmployee(){
    this.clientEmployeeService.getClientEmployeeByEmail(JSON.parse(localStorage.getItem('user')).email).subscribe({
      next : response => {
        this.clientEmployee = response ; 
      }, error: error =>{
        console.log(error.error)
      }
    }
    );
  }  
  
}
