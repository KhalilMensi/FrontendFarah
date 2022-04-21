import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl ='https://localhost:44389/api/Project/';
  constructor(private http: HttpClient) { }

  addProject(project: any){
    return this.http.post(this.baseUrl , project, {responseType: "text"})
  }

  updateProjectState(id: number, stage: string){
    return this.http.put(this.baseUrl+id+"?stage="+stage,null, {responseType: "text"}
    )
  }

  deleteProject(id: number){
    return this.http.delete(this.baseUrl+id, {responseType: "text"} );
  }
}
