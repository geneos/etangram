import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/i2t/login.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  offline: boolean = true;
  hide = true;
  dynamicParameter: string = "";
  routerLinkVariable = "/compra";
  loginData: any;
  token: string = "a";
  forma: FormGroup;
  formaFormulario: FormGroup;
  constructor(private _LoginService:LoginService) {
    this.forma = new FormGroup({
      'usuario': new FormControl(''),
      'password': new FormControl('')
    })
    this.formaFormulario = new FormGroup({
      'idCompCpa': new FormControl(''),
      'idCrd': new FormControl(''),
      'idOrdPagos': new FormControl(''),
      'idRet': new FormControl('')
    })
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
  compras(){
    this.routerLinkVariable = '/compra'
  }

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
    console.log(this.token)
    this.offline = false;
    });
  }
}
