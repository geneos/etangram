import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { LoginService } from 'src/app/services/i2t/login.service';


@Injectable()

@Component({
  selector: 'app-acceso-formularios',
  templateUrl: './acceso-formularios.component.html',
  styleUrls: ['./acceso-formularios.component.css']
})

export class AccesoFormulariosComponent implements OnInit {
  offline: boolean = true;
  loading: boolean = true;
  hide = true;
  dynamicParameter: string = "";
  exp: string ="";
  routerLinkVariable = "/compra";
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
      'idPortal': new FormControl(''),
      'idOrdPubli': new FormControl('')
    })

    this.token = localStorage.getItem('TOKEN')
   this.loading = false;
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
  ordPubli(){
    this.routerLinkVariable = '/ordenes-publicidad'
    this.dynamicParameter = this.formaFormulario.controls['idOrdPubli'].value;
  }
}
