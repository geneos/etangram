import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { GenericoService } from './generico.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ComprobantesService  extends GenericoService {

  constructor(
    private httpClient :HttpClient,
    private appConfig : AppConfig) {
      super(appConfig);
    }

  getComprobantes(filtro : Object) : Observable<any> {
    if(!filtro) {
      filtro = {
        Tipo_Operacion: "FAC",
        Fecha_Desde: "2018-01-01",
        Fecha_Hasta: moment(new Date()).format("YYYY-MM-DD"),
        Id_Referente: "",
        Estado_CAI: -1,
        Estado_Documentacion: -1,
        Estado_Impositivo: -1,
        Estado_Contable: -1,
        Estado_Presupuestario: -1,
        param_limite: 100,
        param_offset: 0
      }
    }
    // console.log("REQUEST: \nHeader",this.getGenericJsonHeader(), "\nBody", filtro)
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/AuditoriaComprobantesGET`, JSON.stringify(filtro), this.getGenericJsonHeader())
        .subscribe(data => {
          // console.log("RESPONSE",data)
          observer.next(this.processResponse(data, 'AuditoriaComprobantesGET'))
        });
    });
  }

  getComprobante(id : string) : Observable<any> {
    return new Observable((observer) => {
      let comps = this.getComprobantes(null).subscribe(comprobantes => {
        let comp = comprobantes.find(c => {
          return c.ID_Comprobante == id;
        });
        observer.next(comp)
      });  
    });
  }

  getDetalle(id: string) : Observable<any> {
    let body = {
      ID_Comprobante: id,
      param_limite: 10,
      param_offset: 0
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleComprobanteGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          // console.log("RESPONSE",data)
          observer.next(this.processResponse(data, 'DetalleComprobanteGET'))
        });
    });
  }
}
