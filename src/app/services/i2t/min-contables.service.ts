import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MinContablesService {

  //compraProveedores:any [] = [];
  preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";

  datos =
  {
    "returnset": [
        {
            "RCode": 1,
            "RTxt": "OK",
            "RId": null,
            "RSQLErrNo": 0,
            "RSQLErrtxt": "OK"
        }
    ],
    "dataset": [
        {
            "id": "1",
            "name": "Test 1",
            "estado": "0",
        }, 
        {
          "id": "2",
          "name": "Test 2",
          "estado": "0",
        }, 
        {
          "id": "3",
          "name": "Test 3",
          "estado": "0",
        }
    ]
  }

  datos2 =
  {
    "returnset": [
        {
            "RCode": 1,
            "RTxt": "OK",
            "RId": null,
            "RSQLErrNo": 0,
            "RSQLErrtxt": "OK"
        }
    ],
    "dataset": [
        {
            "id": "1",
            "name": "Test 1",
            "estado": "0",
        }
    ]
  }

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getMinContables( body:string, token:string ){
    
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/InternoCabGet`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
   
  }

  postCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/InternoCabIns";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  /*
  getRefContablesSinCuenta( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/ReferenciasContablesSinAsignar`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
*/
/*
  getRefContablesPorCuenta( token:string , idCuenta:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_referenciascontables/?deleted=eq[0]&tg01_cuentascontables_id_c=lk[${ idCuenta }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
*/
  getMinContable( id:string, token:string ){
    /*
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_minutascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
    */
    return this.datos2;
  }

  postMinContable( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_minutascontables`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  putMinContable( id:string, body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/tg01_minutascontables/${ id }`;
    let url = this.preUrl + query;

    return this.http.put( url, body, { headers });
  }


}
