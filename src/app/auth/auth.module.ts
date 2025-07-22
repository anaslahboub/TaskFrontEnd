import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './/signup/signup.component';

@NgModule({
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ])
  ]
})
export class AuthModule { }