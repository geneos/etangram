import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  preUrl:string = this.config.getConfig('api_url')

  constructor(private http:HttpClient, private config: AppConfig) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getPermiso( nombreUsuario:string, codigoFuncion:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let json = 
    {
      "Pnombreusuario": nombreUsuario,
      "Pcodigofuncion": codigoFuncion 
    }; 
            /* {
              "Pnombreusuario": "usuario1",
              "Pcodigofuncion": "648" 
              } */


    console.log(json)
    let body = JSON.stringify(json);
    console.log(body)

    let query = `api/proc/SP_ET_verificafuncion`;
    let url = this.preUrl + query;

    console.log('----------post a permisos--------------')
    console.log(url, body, headers)
    console.log('-----------------------')
    return this.http.post( url, body , { headers });
  }
  //estructura no:
  /* {
    "returnset": [
        {
            "RCode": 501,
            "RTxt": "Usuario o funcion no existe",
            "RId": null,
            "RSQLErrNo": null,
            "RSQLErrtxt": null
        }
    ],
    "dataset": []
   }*/
   
   //estructura si:
   /* {
    "returnset": [
        {
            "RCode": 200,
            "RTxt": "OK",
            "RId": null,
            "RSQLErrNo": null,
            "RSQLErrtxt": null
        }
    ],
    "dataset": []
   }*/

}
