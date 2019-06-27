import { Injectable } from '@angular/core';
import { User } from 'src/app/components/shared/user/user.model'

@Injectable()
export class UserService {

  private isUserLoggedIn;
  public usserLogged:string;

  constructor() { 
  	this.isUserLoggedIn = false;
  }

  setUserLoggedIn(user:string, token:string ) {
    this.isUserLoggedIn = true;
    this.usserLogged = user;
    localStorage.setItem('currentUser', user);
    localStorage.setItem('TOKEN', token)

   
  }

  getUserLoggedIn() {
  	return localStorage.getItem('currentUser').toString()
  }

}