import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlexEmployee } from '../../models/flex-employee';
import { JwtHelperService } from "@auth0/angular-jwt";
const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
  })
}
@Injectable({
  providedIn: 'root'
})
export class FlexEmployeeService {
  [x: string]: any;

  baseUrl ='https://localhost:44389/api/FlexEmployee/';
  private loginUserUrl="https://localhost:44389/api/login";

  constructor(private http: HttpClient) { }

  

  getAllFlexEmployees(): Observable<FlexEmployee[]>{
    return this.http.get<FlexEmployee[]>(this.baseUrl);
  }

  getFlexEmployeeById(id:number): Observable<FlexEmployee>{
    return this.http.get<FlexEmployee>(this.baseUrl+id) 
  }

  getFlexEmployeeByEmail(email: string){
    return this.http.get<FlexEmployee>(this.baseUrl+"Email/"+email);
  }
  // getFlexEmployeeById(id: number): Observable<FlexEmployee>{
  //   return this.http.get<FlexEmployee>(this.baseUrl+"Id/"+`/$ {id}`); 
  // }

  deleteFlexEmployee(id: number) {
    return this.http.delete(this.baseUrl + id, {responseType: "text"})
  }

  addFlexEmployee(flexEmployee : FlexEmployee) {
    return this.http.post(this.baseUrl , flexEmployee, {responseType: "text"});
  }

  updateFlexEmployee(id: number,flexEmployee : FlexEmployee){
    return this.http.put(this.baseUrl+id , flexEmployee, {responseType: "text"});
  }
  
  safeUpdateFlexEmployee(id: number,flexEmployee : FlexEmployee){
    return this.http.put(this.baseUrl+"SafeUpdate/"+id , flexEmployee, {responseType: "text"});
  }
  //Login

  loginAdmin(flexEmployee:FlexEmployee){
    return this.http.post<any>(this.loginUserUrl, flexEmployee);
  }

  isLoggedIn(){

    let token = localStorage.getItem("myToken");

    if (token) {
      return true ;
    } else {
      return false;
    }
  }

  isLoggedInAdmin(){

    var user = JSON.parse(localStorage.getItem('user'));
    let token = user.token;

    if (token) {
      
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      
      if(decodedToken.role =="Admin")
        return true
      else
        return false ;

    } else {
      return false;
    }
  }

  isLoggedInEmployee(){

    let token = localStorage.getItem("myToken");

    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if(decodedToken.data.role =="Employee"){
        return true
      }else
      {return false ;}
    } else {
      return false;
    }
  }
}
