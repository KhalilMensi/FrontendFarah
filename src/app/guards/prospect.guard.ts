import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientEmployeeService } from '../services/clientEmployee/client-employee.service';
@Injectable({
  providedIn: 'root'
})
export class ProspectGuard implements CanActivate {
  constructor(private clientEmployeeService: ClientEmployeeService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.clientEmployeeService.isLoggedInProspect()){
        return true
      }else{
        this.router.navigateByUrl('/');
        return false;
      }
    }
  
}
