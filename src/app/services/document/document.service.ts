import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentDto } from 'src/app/models/documentDto';
import { Document } from 'src/app/models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  baseUrl ='https://localhost:44389/api/Document';
  constructor(private http: HttpClient) { }

  addDocument(document: FormData){
    return this.http.post(this.baseUrl+"/" , document, {responseType: "text"})
  }

  getDocumentByProjectId(id: number, status: string): Observable<Document[]>{
    return this.http.get<Document[]>(this.baseUrl+"?projectId="+id+"&status="+status );
  }

  updateDocumentStatus(id: number, status: string){
    return this.http.put(this.baseUrl+"?projectId="+id+"&status="+status, "", {responseType: "text"} )
  }
  
}
