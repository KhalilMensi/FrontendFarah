import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientEmployeeManagementComponent } from './components/private/admin/client-employee-management/client-employee-management.component';
import { CustomersManagementComponent } from './components/private/admin/customers-management/customers-management.component';
import { FlexEmployeeManagementComponent } from './components/private/admin/flex-employee-management/flex-employee-management.component';
import { SeeProfilClientComponent } from './components/private/client/see-profil-client/see-profil-client.component';
import { UpdateProfilClientComponent } from './components/private/client/update-profil-client/update-profil-client.component';
import { ConsultProfilComponent } from './components/private/employee/profilManagement/consult-profil/consult-profil.component';
import { PipelineSalesComponent } from './components/private/employee/pipeline-sales/pipeline-sales.component';
import { RequestsComponent } from './components/private/employee/requestManagement/requests/requests.component';
import { UpdateProfilComponent } from './components/private/employee/profilManagement/update-profil/update-profil.component';
import { DashboardComponent } from './components/private/shared/dashboard/dashboard.component';
import { AboutComponent } from './components/public/about/about.component';
import { ContactComponent } from './components/public/contact/contact.component';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { Page404Component } from './components/public/page404/page404.component';
import { RegisterComponent } from './components/public/register/register.component';
import { AddRequestComponent } from './components/private/client/add-request/add-request.component';
import { MyProjectsComponent } from './components/private/client/my-projects/my-projects.component';
import { ProjectManagementComponent } from './components/private/employee/project-management/project-management.component';
import { AdminGuard } from './guards/admin.guard';
const routes: Routes = [
  { path : '' ,component:HomeComponent },
  { path:'login', component:LoginComponent },
  { path:'register', component:RegisterComponent },
  { path:'dashboard', component:DashboardComponent,canActivate:[AdminGuard]},
  { path:'flexEmployeeManagement', component:FlexEmployeeManagementComponent},
  { path:'clientEmployeeManagement', component:ClientEmployeeManagementComponent},
  { path:'customersManagementComponent', component:CustomersManagementComponent},
  { path:'profil', component:ConsultProfilComponent},
  { path:'updateProfil', component:UpdateProfilComponent},
  { path:'seeProfilClient', component:SeeProfilClientComponent},
  { path:'updateProfilClient', component:UpdateProfilClientComponent},
  { path:'pipeline', component:PipelineSalesComponent},
  { path:'contact', component:ContactComponent},
  { path:'about', component:AboutComponent},
  { path:'requests', component:RequestsComponent},
  { path:'addRequest', component:AddRequestComponent},
  { path:'myProjects', component:MyProjectsComponent},
  { path:'Projects', component:ProjectManagementComponent},
  { path:'**', component:Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
