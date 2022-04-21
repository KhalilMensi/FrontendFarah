import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { Project } from 'src/app/models/project';
import { ClientEmployeeService } from 'src/app/services/clientEmployee/client-employee.service';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ProjectService } from 'src/app/services/project/project.service';
@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {

  clientEntreprise: ClientEntreprise;
  clientEntreprises: ClientEntreprise[];
  documents? : Document[];
  formData : FormData;
  project :Project =null;
  closeResult = '';
  clientEntreprisesQuotes: ClientEntreprise[];
  clientEntreprisesContracts: ClientEntreprise[];
  clientEntreprisesInProgress: ClientEntreprise[];
  clientEntreprisesMaintenance: ClientEntreprise[];
  file = null;
  constructor(private clientEntrepriseProjects: ClientEntrepriseService,
    private clientEmployeeService: ClientEmployeeService, private documentService: DocumentService,
    private clientEntrepriseService:ClientEntrepriseService,
    private modalService: NgbModal, 
    private toastr: ToastrService, private projectService: ProjectService,config: NgbNavConfig) { // customize default values of navs used by this component tree
      config.destroyOnHide = false;
      config.roles = false;}
      getClientEntreprise() {
        this.clientEntrepriseService.getAllEntreprises().subscribe({
          next: response => {
            this.clientEntreprises = response
          },
          error: error => {
            console.log(error)
          }
        })
      }
  ngOnInit(): void { 
    this.getAllClientEntreprisesQuote();
    this.getAllClientEntreprisesContract();
    this.getAllClientEntreprisesInProgress();
    this.getAllClientEntreprisesMaintenance();
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openCollapse(id: number){
    let attribut = document.getElementById("collapse"+id);
    if(attribut.classList.contains("show")){
      attribut.classList.remove("show");
    }else{
      attribut.classList.add("show")
    }
  }
  getAllClientEntreprisesQuote() {
    this.clientEntrepriseService.getAllClientEntreprisesProjects("Quote").subscribe({
      next: response => {
        response = response.filter(items => items.projects != null )
        this.clientEntreprisesQuotes = response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  getAllClientEntreprisesContract() {
    this.clientEntrepriseService.getAllClientEntreprisesProjects("Contract").subscribe({
      next: response => {
        response = response.filter(items => items.projects != null )
        this.clientEntreprisesContracts = response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  getAllClientEntreprisesInProgress() {
    this.clientEntrepriseService.getAllClientEntreprisesProjects("InProgress").subscribe({
      next: response => {
        response = response.filter(items => items.projects != null )
        this.clientEntreprisesInProgress = response
      },
      error: error => {
        console.log(error)
      }
    })
  }

  getAllClientEntreprisesMaintenance() {
    this.clientEntrepriseService.getAllClientEntreprisesProjects("Maintenance").subscribe({
      next: response => {
        response = response.filter(items => items.projects != null )
        this.clientEntreprisesMaintenance = response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  fileNull(){
    this.file = null
  }
}
