import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { DocumentDto } from 'src/app/models/documentDto';
import { Project } from 'src/app/models/project';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  clientEntreprises: ClientEntreprise[];
  allClientEntreprises: ClientEntreprise[];
  formData : FormData;
  file = null;
  project :Project =null;
  constructor(private clientEntrepriseService: ClientEntrepriseService,
    private documentservice: DocumentService, private toastr: ToastrService, 
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getAllClientEntreprisesRequests();
  }
  fileChange(event) {
    let fileList = event.target.files;
    if(fileList.length > 0) {
      this.formData = new FormData();
        let doc = new DocumentDto()
        this.file = fileList[0];
        doc.file = fileList[0];
        doc.status = "Quote"; 
        doc.projectId= 1;
        doc.creationDate = new Date();
        // this.formData.append('file', doc.file);
        // this.formData.append('status', doc.status);
        // this.formData.append('projectId', doc.projectId.toString());
        // this.formData.append('creationDate', doc.creationDate.toISOString());
        this.formData.append('file', this.file);
        this.formData.append('status', "Quote");
        this.formData.append('projectId', this.project.id.toString());
        this.formData.append('creationDate', new Date().toISOString());
        document.getElementById("collapse");
    }
  }

  submitQuote(){
    this.documentservice.addDocument(this.formData).subscribe({
      next: response => {
        console.log(response);
        this.updateProjectState(this.project.id);
        this.toastr.success('SUCCESS', 'The quote is added successfully!');
        this.getAllClientEntreprisesRequests(); 
      },
      error: error => {
        console.log(error)
      }
    })
  }
  fileNull(){
    this.file = null
  }

  getProjectFrontEnd(project: Project){
    this.project = project;
  }

  updateProjectState(id: number){
    this.projectService.updateProjectState(id, "Quote").subscribe({
      next: response => {
        console.log(response);
        this.toastr.success('SUCCESS', 'The project state is updated successfully!');
      },error : error => {
        console.log(error.error);
        this.toastr.error("Error");
      } 
    })
  }

  openCollapse(id: number){
    let attribut = document.getElementById("collapse"+id);
    if(attribut.classList.contains("show")){
      attribut.classList.remove("show");
    }else{
      attribut.classList.add("show")
    }
  }

  openCollapseRequest(id: number){
    let attribut = document.getElementById("collapseRequest"+id);
    if(attribut.classList.contains("show")){
      attribut.classList.remove("show");
    }else{
      attribut.classList.add("show")
    }
  }
  getAllClientEntreprisesRequests() {
    this.clientEntrepriseService.getAllClientEntreprisesProjects("Request").subscribe({
      next: response => {
        response = response.filter(items => items.projects != null )
        this.clientEntreprises = response
        this.allClientEntreprises = response
      },
      error: error => {
        console.log(error)
      }
    })
  }

  
}
