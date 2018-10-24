import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { GuardsModule } from 'src/app/common/guards/guards.module';
import { AuthRequestService } from 'src/app/auth/services/auth-request.service';
import { ComponentsModule } from '../common/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    GuardsModule,
    ComponentsModule
  ],
  providers:[
    AuthRequestService
  ],
  declarations: [
    LoginComponent, 
    RegisterComponent
  ]
})
export class AuthModule { }
