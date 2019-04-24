import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class EvidenciasService {

  preUrl:string = this.config.getConfig('api_url')

  constructor(private http:HttpClient, private config: AppConfig) { }

  registrarEvidencia( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/SP_ET_EvidenciaOP_INS`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getEvidencias( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/SP_ET_EvidenciaOP_GET`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }
  delEvidencia( body:string, token:string){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = `api/proc/SP_ET_EvidenciaOP_DEL`;
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }
}
