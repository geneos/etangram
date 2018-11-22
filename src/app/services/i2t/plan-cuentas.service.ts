import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefContablesService {

  //compraProveedores:any [] = [];
  preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getPlanesDeCuentas( token:string ){
    /*
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_referenciascontables`;
    let url = this.preUrl + query;
    */
    
    let PlanHardcodeado = {
      nombre: 'Activo Corriente',
      cuenta_contable: '1.11.0.0.0000',
      nomenclador:'1.11',
      nomenclador_padre:'1',
      orden:'0',
      estado:1,
      imputable:1,
      patrimonial:0
    }

    //return this.http.get( url , { headers });

    return PlanHardcodeado;
  }


}
