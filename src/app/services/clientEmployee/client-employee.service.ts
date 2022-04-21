import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  { ClientEmployee } from '../../models/client-employee';
import { map, Observable, ReplaySubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoggedInUser } from 'src/app/models/loggedInUser';

const API_URL = 'http://localhost:4200/api/test/';

@Injectable({
  providedIn: 'root'
})
export class ClientEmployeeService {
  private currentUserSource = new ReplaySubject<LoggedInUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  

  baseUrl ='https://localhost:44389/api/ClientEmployee/';
  private registerUserUrl="https://localhost:44389/api/register/";
  private loginUserUrl="https://localhost:44389/api/login/";

  constructor(private http: HttpClient) { }

  getAllClientEmployees(): Observable<ClientEmployee[]>{
    return this.http.get<ClientEmployee[]>(this.baseUrl);
  }

  getClientEmployeeByEmail(email: string) {
    return this.http.get<any>(this.baseUrl+ email);
  }

  deleteClientEmployee(id: number) {
    return this.http.delete(this.baseUrl + id, {responseType: "text"})
  }

  registerClientEmployee(clientEmployee: any) {
    return this.http.post(this.baseUrl+"Register" , clientEmployee)
  }

  addClientEmployee(clientEmployee: any){
    return this.http.post(this.baseUrl+"Add" , clientEmployee, {responseType: "text"})
  }

  updateClientEmployee(id: number,ClientEmployee:ClientEmployee){
    return this.http.put<any>(this.baseUrl+id, ClientEmployee);
  }

  updateClientEmployeesRole(clientEntrepriseId: number,role : string){
    return this.http.put(this.baseUrl+"updateRole/"+clientEntrepriseId+"?role="+role, "");
  }

  safeUpdateClientEmployee(id: number,ClientEmployee:ClientEmployee){
    return this.http.put(this.baseUrl+"safeUpdate/"+id, ClientEmployee, {responseType: "text"});
  }
   //Register & Login

   registerClient(clientEmployee : ClientEmployee){
    return this.http.post<any>(this.registerUserUrl, clientEmployee);
  }

  loginClient(clientEmployee:ClientEmployee){
    return this.http.post<any>(this.loginUserUrl, clientEmployee);
  }

  isLoggedIn(){

    let token = localStorage.getItem("myToken");

    if (token) {
      return true ;
    } else {
      return false;
    }
  }
  isLoggedInClient(){

    let token = localStorage.getItem("myToken");

    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if(decodedToken.data.role =="Client"){
        return true
      }else
      {return false ;}
    } else {
      return false;
    }
  }
  isLoggedInProspect(){

    let token = localStorage.getItem("myToken");

    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if(decodedToken.data.role =="Prospect"){
        return true
      }else
      {return false ;}
    } else {
      return false;
    }
  }
}
