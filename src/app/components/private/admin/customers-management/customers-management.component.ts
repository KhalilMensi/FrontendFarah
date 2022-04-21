import { Attribute, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ClientEntreprise } from 'src/app/models/client-entreprise';
import { LoggedInUser } from 'src/app/models/loggedInUser';
import { ClientEntrepriseService } from 'src/app/services/clientEntreprise/client-entreprise.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import {ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customers-management',
  templateUrl: './customers-management.component.html',
  styleUrls: ['./customers-management.component.css']
})
export class CustomersManagementComponent implements OnInit {
  registerForm: FormGroup;
  updateForm: FormGroup;
  entrepriseName: string;
  clientEntreprises: ClientEntreprise[];
  allClientEntreprises: ClientEntreprise[];
  clientEntreprise: ClientEntreprise = new ClientEntreprise();
  type: string = "Client";
  isOpen: boolean = false;
  closeResult: string; 
  constructor(private modalService: NgbModal,private clientEntrepriseService: ClientEntrepriseService, 
    private loginService: LoginService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllClientEntreprises();
    this.initializeRegisterForm();
    this.initializeUpdateForm();
    this.setCurrentUser
  }
  
  initializeUpdateForm() {
    this.updateForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('')
    })
  }
  initializeRegisterForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl(''),
    })
  }
  //type drop down list
  typeSelected(type: string) {
    this.type = type;
  }
  addClientEntreprise() {
    this.clientEntreprise.name = this.registerForm.value.name;
    this.clientEntreprise.address = this.registerForm.value.address;
    this.clientEntreprise.email = this.registerForm.value.email;
    this.clientEntreprise.type = this.type;
    
    this.clientEntrepriseService.addClientEntreprise(this.clientEntreprise).subscribe({
      next: response => {
        console.log(response);  
        this.toastr.success('new customer added!','Success!'); 
        this.getAllClientEntreprises(); 
      },
      error: error => {
        console.log(error);
      }
    });
    this.registerForm.reset();
  }
  updateClientEntreprise() {  
    let id = this.updateForm.value.id;
    this.clientEntreprise.name = String(this.updateForm.value.name);
    this.clientEntreprise.address = String(this.updateForm.value.address);
    this.clientEntreprise.email = String(this.updateForm.value.email);
    this.clientEntreprise.type = String(this.type);
    this.clientEntrepriseService.updateClientEntreprise(id, this.clientEntreprise).subscribe({
      next: response => {
        console.log(response);
        //this.toastr.info('updated!', 'customer updated successfully!'); 
        //this.getAllClientEntreprises(); 
      },
      error: error => {
        console.log(error);
      }
    });
   // location.reload();
   this.toastr.info('customer updated successfully!', 'updated!');
   this.getAllClientEntreprises(); 
  }
  putActualValues(clientEntreprise: ClientEntreprise) {
    this.updateForm.patchValue({
      id: [clientEntreprise.id],
      name: [clientEntreprise.name],
      address: [clientEntreprise.address],
      email: [clientEntreprise.email],
      type: clientEntreprise.type=="Client" ? "Client" : "Prospect"
    });
  }
  getAllClientEntreprises() {
    this.clientEntrepriseService.getAllEntreprises().subscribe({
      next: response => {
        this.clientEntreprises = response
        this.allClientEntreprises = response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  getClientEntreprise(id :number) {
    this.clientEntrepriseService.getClientEntreprise(id).subscribe({
      next: response => {
        this.clientEntreprise = response
      },
      error: error => {
        console.log(error)
      }
    })
  }
  setCurrentUser(){
    const user: LoggedInUser = JSON.parse(localStorage.getItem('user'));
    this.loginService.setCurrentUser(user);
  }
  deleteClientEntreprise(id: number) {
    this.clientEntrepriseService.deleteClientEntreprise(id).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error)
      }
    })
    //location.reload();
    this.toastr.error('customer deleted successfully!','Done!'); 
    this.getAllClientEntreprises();
  }
  open(content, id) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteClientEntreprise(id);  
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
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
  search() {
    this.clientEntreprises = this.allClientEntreprises.filter(item => {
      return item.name.toLowerCase().indexOf(this.entrepriseName.toLowerCase()) > -1
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
  changeRole(e) {
    this.type = String(e.target.value);
  }
}



