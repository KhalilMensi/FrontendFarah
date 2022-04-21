import { Component, OnInit } from '@angular/core';
import { ClientEmployee } from 'src/app/models/client-employee';
import { Project } from 'src/app/models/project';
import { Document } from 'src/app/models/document';
import { ClientEmployeeService } from 'src/app/services/clientEmployee/client-employee.service';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { DocumentDto } from 'src/app/models/documentDto';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  clientEmployee: ClientEmployee;
  requests? : Project[];
  quotes? : Project[];
  contracts? : Project[];
  inProgress? : Project[];
  maintenance? : Project[];
  documents? : Document[];
  formData : FormData;
  project :Project;
  request =  new Project();
 
  file = null;
  constructor(private clientEntrepriseProjects: ClientEntrepriseService,
    private clientEmployeeService: ClientEmployeeService, private documentService: DocumentService,
    private toastr: ToastrService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getClientEmployee();
  }

  getClientEmployee(){
    this.clientEmployeeService.getClientEmployeeByEmail(JSON.parse(localStorage.getItem('user')).email).subscribe({
      next : response => {
        this.clientEmployee = response ; 
        this.getProjects()
      }, error: error =>{
        console.log(error.error)
      }
    }
    );
  } 

  getProjects(){
    this.getOneClientEntreprisesRequests();
    this.getOneClientEntreprisesQuotes();
    this.getOneClientEntreprisesContract();
    this.getOneClientEntreprisesInProgress();
    this.getOneClientEntreprisesMaintenance();
  }

  getOneClientEntreprisesRequests(){
    return this.clientEntrepriseProjects.getOneClientEntreprisesProjects(this.clientEmployee.entrepriseId, "Request")
    .subscribe({
      next : response => {
        if(response != null)
          this.requests = response.projects;
      }, error: error =>{
        console.log(error.error)
      }
    });
  }

  getOneClientEntreprisesQuotes(){
    return this.clientEntrepriseProjects.getOneClientEntreprisesProjects(this.clientEmployee.entrepriseId, "Quote")
    .subscribe({
      next : response => {
        if(response != null)
          this.quotes = response.projects;
      }, error: error =>{
        console.log(error.error)
      }
    });
  }

  getOneClientEntreprisesContract(){
    return this.clientEntrepriseProjects.getOneClientEntreprisesProjects(this.clientEmployee.entrepriseId, "Contract")
    .subscribe({
      next : response => {
        if(response !=null)
          this.contracts = response.projects;
      }, error: error =>{
        console.log(error.error)
      }
    });
  }

  getOneClientEntreprisesInProgress(){
    return this.clientEntrepriseProjects.getOneClientEntreprisesProjects(this.clientEmployee.entrepriseId, "InProgress")
    .subscribe({
      next : response => {
        if(response !=null)
          this.inProgress = response.projects;
      }, error: error =>{
        console.log(error.error)
      }
    });
  }

  getOneClientEntreprisesMaintenance(){
    return this.clientEntrepriseProjects.getOneClientEntreprisesProjects(this.clientEmployee.entrepriseId, "Maintenance")
    .subscribe({
      next : response => {
        if(response !=null)
          this.maintenance = response.projects;
      }, error: error =>{
        console.log(error.error)
      }
    });
  }

  openCollapse(id: string){
    let attribut = document.getElementById(id);
    if(attribut.classList.contains("show")){
      attribut.classList.remove("show");
    }else{
      attribut.classList.add("show")
    }
  }

  seeDetails(project: Project){
    this.project = project,
    this.documentService.getDocumentByProjectId(project.id, "Quote").subscribe({
      next : response => {
        this.documents = response;
        console.log(this.documents)
      }, error : error =>{
        console.log(error.error);
      }
    })
  }

  seeRequestDetails(request: Project){
    this.request = request;
  }

  fileChange(event) {
    let fileList = event.target.files;
    if(fileList.length > 0) {
      this.formData = new FormData();
        let doc = new DocumentDto()
        this.file = fileList[0];
        this.formData.append('file', this.file);
        this.formData.append('status', "Contract");
        this.formData.append('projectId', this.project.id.toString());
        this.formData.append('creationDate', new Date().toISOString());
        document.getElementById("collapse");
    }
  }

  updateProjectState(id: number){
    this.projectService.updateProjectState(id, "Contract").subscribe({
      next: response => {
        console.log(response);
        this.toastr.success('SUCCESS', 'The project state is updated successfully!');
      },error : error => {
        console.log(error.error);
        this.toastr.error("Error");
      } 
    })
  }

  submitQuote(){
    this.documentService.addDocument(this.formData).subscribe({
      next: response => {
        console.log(response);
        this.updateProjectState(this.project.id);
        this.toastr.success('SUCCESS', 'The quote is added successfully!');
        this.getOneClientEntreprisesQuotes();
        this.getOneClientEntreprisesContract();
        if(this.clientEmployee.role == "3"){
          this.updateEmployeesRole();
          this.updateEntrepriseType();
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

  rejectQuote(){
    this.documentService.updateDocumentStatus(this.documents[0].id, "NonValidatedQuote").subscribe({
      next: response => {
        console.log(response)
      },error : error => {
        console.log(error.error)
      } 
    })
  }
  updateEmployeesRole(){
    this.clientEmployeeService.updateClientEmployeesRole(this.clientEmployee.entrepriseId, "Client")
    .subscribe({
      next : response => {
        console.log(response)
      }, error : error => {
        console.log(error.error)
      }
    })
  }

  updateEntrepriseType(){
    this.clientEntrepriseProjects.updateClientEntrepriseType(this.clientEmployee.entrepriseId, "Client")
    .subscribe({
      next : response => {
        console.log(response)
      }, error : error => {
        console.log(error.error)
      }
    })
  }

  deleteRequest(id: number){
    this.projectService.deleteProject(id).subscribe({
      next: response => {
        console.log(response);
        this.toastr.success("The request is deleted seccessfully")
      }, error : error => {
        this.toastr.error("Error!")
      }
    })
  }
  fileNull(){
    this.file = null
  }

  projectNull(){
    this.project = null;
  }

}
