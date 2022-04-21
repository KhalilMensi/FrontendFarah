import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { ProjectService } from 'src/app/services/project/project.service';
@Component({
  selector: 'app-pipeline-sales',
  templateUrl: './pipeline-sales.component.html',
  styleUrls: ['./pipeline-sales.component.css']
})
export class PipelineSalesComponent implements OnInit {

  closeResult = '';
  clientEntreprisesQuotes: ClientEntreprise[];
  clientEntreprisesContracts: ClientEntreprise[];
  clientEntreprisesInProgress: ClientEntreprise[];
  clientEntreprisesMaintenance: ClientEntreprise[];
  
  
  
  constructor(private modalService: NgbModal, private clientEntrepriseService: ClientEntrepriseService) {}
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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

}
