import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericoService } from './generico.service';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class VisorContableService extends GenericoService {

  constructor(
    private httpClient :HttpClient,
    private appConfig : AppConfig ) {
      super(appConfig);
  }

  getContabilidadComprobante(id:string) : Observable<any> {
    let body = {
      ID_Comprobante: id,
      param_limite: 10,
      param_offset: 0
    };
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableGET`, JSON.stringify(body), this.getGenericJsonHeader())
      .subscribe(data => {
        observer.next(this.processResponse(data, 'DetalleContableGET'))
      });
    });
  }

  getCentrosDeCosto() : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.get(`${this.getApiUrl()}api/tg01_centrocosto`, this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'tg01_centrocosto'))
        });
    });
  }

  getCuentasContables() : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.get(`${this.getApiUrl()}api/tg01_referenciascontables`, this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'tg01_referenciascontables'))
        });
    });
  }

  insertarLineaContable(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableINS`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleContableINS'))
        });
    });
  }

  actualizarLineaContable(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableUPD`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleContableUPD'))
        });
    });
  }

  borrarLineaContable(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableDEL`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleContableDEL'))
        });
    });
  }

  autorizarContabilidad(id : string) : Observable<any> {
    let body : Object = { ID_Comprobante: id }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableAUT`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleContableAUT'))
        });
    });
  }
}
