import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientEntreprise } from 'src/app/models/client-entreprise';

@Injectable({
  providedIn: 'root'
})
export class ClientEntrepriseService {

  baseUrl ='https://localhost:44389/api/ClientEntreprise/';

  constructor(private http: HttpClient) { }

  getAllEntreprises(): Observable<ClientEntreprise[]>{
    return this.http.get<ClientEntreprise[]>(this.baseUrl + "GetAllClientEntreprisesWithEmployees");
  }

  getAllClientEntreprisesProjects(stage : string): Observable<ClientEntreprise[]>{
    return this.http.get<ClientEntreprise[]>(this.baseUrl + "AllClientEntreprisesProjects?s="+stage);
  }

  getOneClientEntreprisesProjects(id: number, stage : string): Observable<ClientEntreprise>{
    return this.http.get<ClientEntreprise>(this.baseUrl + "OneClientEntreprisesProjects?id="+id+"&s="+stage);
  }
  
  getClientEntreprise(id: number): Observable<ClientEntreprise>{
    return this.http.get<ClientEntreprise>(this.baseUrl+"Id/"+ id) 
  }

  deleteClientEntreprise(id: number) {
    return this.http.delete<number>(this.baseUrl + id)
  }

  addClientEntreprise(clientEntreprise : ClientEntreprise) {
    return this.http.post(this.baseUrl , clientEntreprise, {responseType: "text"});
  }

  updateClientEntreprise(id: number,clientEntreprise : ClientEntreprise){
    return this.http.put<any>(this.baseUrl+id, clientEntreprise);
  }

  updateClientEntrepriseType(clientEntrepriseId: number,type : string){
    return this.http.put(this.baseUrl+"updateType/"+clientEntrepriseId+"?type="+ type,"" );
  }
}
