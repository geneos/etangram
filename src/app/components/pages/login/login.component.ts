import { Component, OnInit, ViewChild, Inject, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/i2t/login.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { NavbarComponent } from 'src/app/components/shared/navbar/navbar.component';
import { User } from 'src/app/components/shared/user/user.model';
import { PlatformLocation } from '@angular/common';
import { UserService } from 'src/app/services/i2t/user.service';
import { Router, ActivatedRoute } from "@angular/router";

// key that is used to access the data in local storage
const TOKEN = '';
const userName = '';

@Injectable()

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() nombre = new EventEmitter<any>();
  @ViewChild(NavbarComponent) navBar: NavbarComponent;
  offline: boolean = true;
  loading: boolean = false;
  hide = true;
  dynamicParameter: string = "";
  exp: string ="";
  routerLinkVariable = "/compra";
  loginData: any;
  loginDatos: login;
  token: string = "a";
  forma: FormGroup;
  formaFormulario: FormGroup;
  username: any;
  constructor(private _LoginService:LoginService, @Inject(SESSION_STORAGE) private storage: StorageService,
              private userService: UserService,
              private route:ActivatedRoute,private router: Router,
              private location: PlatformLocation) {

    this.forma = new FormGroup({
      'usuario': new FormControl(''),
      'password': new FormControl('')
    })
    this.formaFormulario = new FormGroup({
      'idCompCpa': new FormControl(''),
      'idCrd': new FormControl(''),
      'idOrdPagos': new FormControl(''),
      'idMCont': new FormControl(''),
      'idRet': new FormControl(''),
      'idPortal': new FormControl(''),
      'idOrdPubli': new FormControl('')
    })

    
   }

  //  public storeOnLocalStorage(auxtoken: string, auxuser: string): void {
  //     localStorage.setItem('TOKEN', auxtoken);
  //     localStorage.setItem('userName', auxuser);
  //     console.log(localStorage.getItem('TOKEN') || 'Local storage is empty');
  //     console.log(localStorage.getItem('userName') || 'Local storage is empty');
  //   }

  ngOnInit() {
  }

  compCpa(){
    {
      this.routerLinkVariable = '/consulta-comprobantes'
      this.dynamicParameter = this.formaFormulario.controls['idCompCpa'].value;
    }
  }
  consCrd(){
    this.routerLinkVariable = '/consulta-crd'
    this.dynamicParameter = this.formaFormulario.controls['idCrd'].value;
  }
  OrdPagos(){
    this.routerLinkVariable = '/consulta-ord-pago'
    this.dynamicParameter = this.formaFormulario.controls['idOrdPagos'].value;
  }
  consRet(){
    this.routerLinkVariable = '/consulta-retenciones'
    this.dynamicParameter = this.formaFormulario.controls['idRet'].value;
  }
  portal(){
    this.routerLinkVariable = '/datos-proveedores'
    this.dynamicParameter = this.formaFormulario.controls['idPortal'].value;
  }
  minCont(){
    //this.routerLinkVariable = '/consulta-retenciones'
    this.dynamicParameter = this.formaFormulario.controls['idMCont'].value;
  }
  ordPubli(){
    this.routerLinkVariable = '/ordenes-publicidad'
    this.dynamicParameter = this.formaFormulario.controls['idOrdPubli'].value;
  }
  /*compras(){
    this.routerLinkVariable = '/compra'
  }
  refContables(){
    this.routerLinkVariable = '/ref-contables'
  }
  planCuentas(){
    this.routerLinkVariable = '/plan-cuentas'
  }
  minContables(){
    this.routerLinkVariable = '/min-contables'
  }*/

  login(){
    this.loading=true;
    let jsbody = {
      "usuario": this.forma.controls['usuario'].value,//"usuario1",
      "pass": this.forma.controls['password'].value //"password1"
    }
    let jsonbody = JSON.stringify(jsbody);
    this._LoginService.login(jsonbody)
      .subscribe( dataL => {
 //    console.log(dataL);
        
    this.loginData = dataL;
   // let u: User = {username: this.loginData.dataset[0].usuarioNombre, token: this.loginData.dataset[0].jwt}
    this.token = this.loginData.dataset[0].jwt;
    this.userService.setUserLoggedIn(this.loginData.dataset[0].usuarioNombre, this.loginData.dataset[0].jwt)
    let saro = new NavbarComponent(this.storage, this.userService, this.router, this.route, this.location);

    saro.user(this.loginData.dataset[0].usuarioNombre)
    this.router.navigate(['/formularios'])
    
    console.log(this.loginData);
  //  this.storeOnLocalStorage(this.token, this.loginData.dataset[0].usuarioNombre);
    this.offline = false;
    this.loading = false;
    this.loginDatos = this.loginData.dataset
    this.username = this.loginData.dataset[0].usuarioNombre
    
    });
  }
}
export interface login{
  usuarioNombre: string;
  jwt: string;
}
