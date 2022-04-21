import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/private/shared/dashboard/dashboard.component';
import { SidebarComponent } from './components/private/shared/sidebar/sidebar.component';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';
import { FooterComponent } from './components/public/shared/footer/footer.component';
import { NavbarComponent } from './components/public/shared/navbar/navbar.component';
import { Page404Component } from './components/public/page404/page404.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInput, MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopbarComponent } from './components/private/shared/topbar/topbar.component';
import { FlexEmployeeManagementComponent } from './components/private/admin/flex-employee-management/flex-employee-management.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { CustomersManagementComponent } from './components/private/admin/customers-management/customers-management.component';
import { ClientEmployeeManagementComponent } from './components/private/admin/client-employee-management/client-employee-management.component';
import { SeeProfilClientComponent } from './components/private/client/see-profil-client/see-profil-client.component';
import { UpdateProfilClientComponent } from './components/private/client/update-profil-client/update-profil-client.component';
import { ToastrModule } from 'ngx-toastr';
import { PipelineSalesComponent } from './components/private/employee/pipeline-sales/pipeline-sales.component';
import { ContactComponent } from './components/public/contact/contact.component';
import { AboutComponent } from './components/public/about/about.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ConsultProfilComponent } from './components/private/employee/profilManagement/consult-profil/consult-profil.component';
import { UpdateProfilComponent } from './components/private/employee/profilManagement/update-profil/update-profil.component';
import { RequestsComponent } from './components/private/employee/requestManagement/requests/requests.component';
import { AddRequestComponent } from './components/private/client/add-request/add-request.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyProjectsComponent } from './components/private/client/my-projects/my-projects.component';
import { ProjectManagementComponent } from './components/private/employee/project-management/project-management.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    TopbarComponent,
    NavbarComponent,
    Page404Component,
    FlexEmployeeManagementComponent,
    ClientEmployeeManagementComponent,
    CustomersManagementComponent,
    ConsultProfilComponent,
    UpdateProfilComponent,
    SeeProfilClientComponent,
    UpdateProfilClientComponent,
    PipelineSalesComponent,
    ContactComponent,
    AboutComponent,
    RequestsComponent,
    AddRequestComponent,
    MyProjectsComponent,
    ProjectManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule ,
    FormsModule ,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    CKEditorModule,
    NgxPaginationModule,
    ToastrModule.forRoot({ positionClass:'toast-bottom-right' }), // ToastrModule added
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
