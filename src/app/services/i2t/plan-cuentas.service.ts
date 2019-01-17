import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class PlanCuentasService {

  //compraProveedores:any [] = [];
  preUrl:string = PreUrl;

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

    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_cuentascontables`;
    let url = this.preUrl + query;

/*
    todo borrar
    let PlanHardcodeado = [{
      id: '1',
      nombre: 'Activo Corriente',
      cuenta_contable: '1.11.0.0.0000',
      nomenclador:'1.11',
      nomenclador_padre:'1',
      orden:'0',
      estado:1,
      imputable:1,
      patrimonial:0
    } ];*/

    return this.http.get( url , { headers });

    // return PlanHardcodeado;
  }

  getPlanesDeCuentasPadre( token:string, padre:string ){

    const headers = new HttpHeaders({
      'x-access-token': token
    });

    var query;

    if(padre==""){
      query = `api/tg01_cuentascontables/?deleted=eq[0]&_orderby=nomencladorpadre&_limit=9`;
    } else {
      query = `api/tg01_cuentascontables/?deleted=eq[0]&nomencladorpadre=lk[${ padre }]`;
    }

    let url = this.preUrl + query;

    return this.http.get( url , { headers });

    // return PlanHardcodeado;
  }

  getPlanDeCuentas( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_cuentascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  postPlanDeCuentas( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_cuentascontables`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  putPlanDeCuentas( id:string, body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_cuentascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.put( url, body, { headers });
  }




}
