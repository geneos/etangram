import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { Body } from '@angular/http/src/body';

@Injectable({
  providedIn: 'root'
})
export class RemesasService {

  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

// Obtener listado de las remesas

  getRemesas( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    if (id == null){
      let query = `api/tg11_remesas`;
      let url = this.preUrl + query;
      return this.http.get( url , { headers });
    } else {
      let query = `api/tg11_remesas?id=${ id }`;
      let url = this.preUrl + query;
      return this.http.get( url , { headers });
    }

  }

  // Insertar Remesa

  postRemesaIns( body: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/RemesaINS`;
    let url = this.preUrl + query;

    return this.http.post( url , body, { headers });
  }

  // Confirmar Remesa
  postRemesaConf( body: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/RemesaConfirmar`;
    let url = this.preUrl + query;

    return this.http.post( url , body, { headers });
  }

  // Borrar Remesa
  RemesaDel( body: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/RemesaDEL`;
    let url = this.preUrl + query;

    return this.http.post( url , body, { headers });
  }

// Obtener comprobantes de la remesa
getRemesaComprobantes( body: string, token:string ){
  const headers = new HttpHeaders({
    'x-access-token': token,
    'Content-Type': 'application/json'
  });
  console.log(body)
/* {
	"ID_Remesa": "6aa00898-4f01-11e9-88ca-d050990fe081"
    }*/
  let query = `api/proc/RemesaComprobantesGET`;
  let url = this.preUrl + query;

  return this.http.post( url , body, { headers });
}
  
// Insertar un comprobante a la remesa 

  postRemesaComprobantesIns( body: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/RemesaComprobantesINS`;
    let url = this.preUrl + query;

    return this.http.post( url , body, { headers });
  }

// Quitar un comprobante de la remesa 

  postRemesaComprobantesDel( body: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/RemesaComprobantesDEL`;
    let url = this.preUrl + query;

    return this.http.post( url , body, { headers });
  }

}
