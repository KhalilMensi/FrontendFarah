import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FlexEmployeeService } from 'src/app/services/FlexEmployee/flex-employee.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private flexEmployeeService: FlexEmployeeService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.flexEmployeeService.isLoggedInAdmin()){
        return true
      }else{
        this.router.navigate(['/']);
        return false;
      }
    }
  
}
