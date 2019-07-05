import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { GenericoService } from './generico.service';

@Injectable({
  providedIn: 'root'
})
export class VisorPresupuestarioService extends GenericoService {

  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfig) {
      super(appConfig);
  }

  getPresupuestoComprobante(id: string) : Observable<any> {
    let body = {
      ID_Comprobante: id,
      param_limite: 10,
      param_offset: 0
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetallePresupuestarioGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetallePresupuestarioGET'))
        });
    });
  }

  insertarLineaPresupuestaria(presupuesto: any) : Observable<any> {
    let body = {
      ID_Comprobante: presupuesto.ID_Comprobante,
      ID_Reserva: presupuesto.ID_Reserva,
      ID_Partida: presupuesto.ID_Partida,
      Fecha: presupuesto.Fecha,
      Importe: presupuesto.Imputado
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetallePresupuestarioINS`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetallePresupuestarioINS'))
        });
    });
  }

  actualizarLineaPresupuestaria(presupuesto: any) : Observable<any> {
    let body = {
      ID_AppReserva: presupuesto.ID_AppReserva,
      ID_Partida: presupuesto.ID_Partida,
      Fecha: presupuesto.Fecha,
      Importe: Number(presupuesto.Imputado)
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetallePresupuestarioUPD`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetallePresupuestarioUPD'))
        });
    });
  }

  borrarLineaPresupuestaria(presupuesto: any) : Observable<any> {
    let body = {
      ID_AppReserva: presupuesto.ID_AppReserva
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetallePresupuestarioDEL`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetallePresupuestarioDEL'))
        });
    });
  }

  autorizarPresupuesto(presupuesto: any) : Observable<any> {
    let body = {
      ID_Comprobante: presupuesto.ID_Comprobante
    }
    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/DetallePresupuestarioAUT`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetallePresupuestarioAUT'))
        });
    });
  }
  
  getPartidas(idPartida: string) : Observable<any> {
    let body = {
      ID_Partida_Afecta: idPartida,
      param_limite: 10,
      param_offset: 0
    }

    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/PartidaPresupuestariaGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'PartidaPresupuestariaGET'))
        });
    });
  }

  getReservaPresupuestaria(id: string) : Observable<any> {
    let body = {
      ID_Reserva: id,
      param_limite: 10,
      param_offset: 0
    }

    return new Observable((observer) => {
      this.httpClient.post(`${this.getApiUrl()}api/proc/ReservaPresupuestariaGET`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'ReservaPresupuestariaGET'))
        });
    });
  }
}
