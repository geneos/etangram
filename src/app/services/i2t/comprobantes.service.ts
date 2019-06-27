import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

import { Comprobante } from '../../interfaces/comprobante.interface';
import { ImpuestoComprobante } from '../../interfaces/impuesto-comprobante.interface';
import { Impuesto } from 'src/app/interfaces/impuesto.interface';

import { mockComprobantes, mockImpuestos, mockImpuestosComprobante, mockLineasContables, mockCentrosDeCostos } from '../mocks/comprobante-service-mock';
import { GenericoService } from './generico.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ComprobantesService  extends GenericoService {
  comprobantes : any = mockComprobantes;
  impuestos_comprobate : any = mockImpuestosComprobante;
  impuestos : Impuesto[] = mockImpuestos
  contabilidad_comprobante : any[] = mockLineasContables;
  centros_costo : any[] = mockCentrosDeCostos;

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

  /*********************************************************************/

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
 
  /*********************************************************************/

  getPresupuestoComprobante(id : string) : Observable<any> {
    return new Observable((observer) => {
      /* this.httpClient.post(`${this.getApiUrl()}api/proc/DetalleContableAUT`, JSON.stringify(body), this.getGenericJsonHeader())
        .subscribe(data => {
          observer.next(this.processResponse(data, 'DetalleContableAUT'))
        }); */
      observer.next();
    });
  }

  insertarLineaPresupuestaria(body : Object) : Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }

  actualizarLineaPresupuestaria(body : Object) : Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }

  borrarLineaPresupuestaria(body : Object) : Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }

  autorizarPresupuesto(body : Object) : Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }
}
