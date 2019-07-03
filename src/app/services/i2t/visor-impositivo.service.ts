import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericoService } from './generico.service';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class VisorImpositivoService extends GenericoService {

  constructor(
    private httpClient :HttpClient,
    private appConfig : AppConfig ) {
      super(appConfig);
  }

  getImpuestosComprobante(id : string) : Observable<any> {
    let body = {
      ID_Comprobante: id,
      param_limite: 100,
      param_offset: 0
    };

    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleImpositivoGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleImpositivoGET'))
        });
    });
  }

  getTipoDeImpuestos() : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.get(`${this.getApiUrl()}api/tg01_modeloimpuestos`, this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'tg01_modeloimpuestos'))
        });    
    });    
  }

  getImpuestosPorTipo(id : number) : Observable<any> {
    let body = {
      ID_ModeloImpuesto: id
    } 
    
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/ImpuestosConfigGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'ImpuestosConfigGET'))
        })
    })
  }

  getImporteLineaImpositiva(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/ImporteRetencionGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'ImporteRetencionGET'))
        })
    });
  }

  insertarLineaImpositiva(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleImpositivoINS`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleImpositivoINS'))
        })
    });
  }

  actualizarLineaImpositiva(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleImpositivoUPD`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleImpositivoUPD'))
        })
    });
  }

  borrarLineaImpositiva(body : Object) : Observable<any> {
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleImpositivoDEL`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleImpositivoDEL'))
        })
    });
  }

  autorizarLineaImpositiva(id : string) : Observable<any> {
    let body : Object = { ID_Comprobante: id }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleImpositivoAUT`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleImpositivoAUT'))
        })
    });
  }

}
