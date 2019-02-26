import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { LoginService } from 'src/app/services/i2t/login.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()
//export class LocalStorageService {
//    anotherTodolist = [];
//    constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

//}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  offline: boolean = true;
  hide = true;
  dynamicParameter: string = "";
  exp: string ="";
  routerLinkVariable = "/compra";
  loginData: any;
  token: string = "a";
  forma: FormGroup;
  formaFormulario: FormGroup;
  constructor(private _LoginService:LoginService, @Inject(SESSION_STORAGE) private storage: StorageService) {

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
      'idPortal': new FormControl('')
    })
   }

   public storeOnLocalStorage(auxtoken: string): void {
      this.storage.set(TOKEN, auxtoken);
      console.log(this.storage.get(TOKEN) || 'Local storage is empty');
    }

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
    let jsbody = {
      "usuario": this.forma.controls['usuario'].value,//"usuario1",
      "pass": this.forma.controls['password'].value //"password1"
    }
    let jsonbody = JSON.stringify(jsbody);
    this._LoginService.login(jsonbody)
      .subscribe( dataL => {
 //    console.log(dataL);
    this.loginData = dataL;
    this.token = this.loginData.dataset[0].jwt;
    console.log(this.loginData);
    this.storeOnLocalStorage(this.token);
    this.offline = false;
    });
  }
}
