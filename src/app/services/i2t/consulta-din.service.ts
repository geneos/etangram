import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

// const operadores: Map<string, string> = [
// const operadores = [
//   { equal : 'eq'},  //igual que
//   { not: 'not' },   //distinto de
//   { less_than: 'lt' },  //menor que
//   { less_equal: 'le' }, //menor o igual que
//   { greater_than: 'gt' },//mayor que.
//   { greater_equal: 'ge' },//mayor o igual que.
//   { like: 'lk' },//like, ídem SQL.
//   { in: 'in' }//in a set, ídem SQL
// ]
import { PreUrl } from './url';

const operadores = [
  { condicion: 'equal',         texto : 'eq'},  //igual que
  { condicion: 'not',           texto: 'not' },   //distinto de
  { condicion: 'less_than',     texto: 'lt' },  //menor que
  { condicion: 'less_equal',    texto: 'le' }, //menor o igual que
  { condicion: 'greater_than',  texto: 'gt' },//mayor que.
  { condicion: 'greater_equal', texto: 'ge' },//mayor o igual que.
  { condicion: 'like',          texto: 'lk' },//like, ídem SQL.
  { condicion: 'in',            texto: 'in' },//in a set, ídem SQL
  { condicion: 'null',          texto: 'isnull'},
  { condicion: 'notnull',       texto: 'isnotnull'}
]

const otros = [
  { misc: 'orderby' , texto: '_orderby'},
  { misc: 'include' , texto: '_include'},
  { misc: 'exclude' , texto: '_exclude'},
  { misc: 'limit'   , texto: '_limit'},
  { misc: 'offset'  , texto: '_offset'}
]


@Injectable({
  providedIn: 'root'
})
export class ConsultaDinamicaService {

  //compraProveedores:any [] = [];
  preUrl:string = PreUrl;

  //datos de filtros
  // private datosFiltros = new BehaviorSubject('default message');
  // private datosFiltros: BehaviorSubject<any>;
  private datosFiltros: BehaviorSubject<Map<string, string>>;
  // datosFiltrosAct = this.datosFiltros.asObservable();
  datosFiltrosAct: Observable<Map<string, string>>;

  constructor( private http:HttpClient ) {
    let mapa = new Map<string, string>();
    this.datosFiltros = new BehaviorSubject<Map<string, string>>(mapa);
    this.datosFiltrosAct = this.datosFiltros.asObservable();
  }

  actualizarDatos(datosNuevos: Map<string, string>) {
    console.log('actualizando datos en servicio');
    let mapaTemp = this.datosFiltros.value;
    datosNuevos.forEach(element => {
      console.log(element);
    });

    console.log('prueba de mergeado: ');
    let mergedMap:Map<string, string> = new Map([...Array.from(mapaTemp.entries()), ...Array.from(datosNuevos.entries())]);
    console.log(mergedMap);
    // mapaTemp.set(datosNuevos.);
    // this.datosFiltros.next(datosNuevos)
    this.datosFiltros.next(mergedMap);
  }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getReportes( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_reportes`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getReporte( name:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_reportes?name=eq${name}`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAtributos( name:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg06_tg_atributos?tabla=eq[${name}]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getDatos( name:string, filtros: any, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/${name}`;
    //armado de consulta
    if (filtros != null)
    {
      console.log('armado de consulta aquí =====>>>>');
      query = query + this.armarConsulta(filtros);
      console.log('url final: ' + query);
    }
    //
    else{
      console.log('sin armado de consulta aquí (es nulo) =====>>>>');
    }
    // this.datosFiltros.value.forEach(element => {
    //   element
    // });
    //

    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  armarConsulta(filtros: any){
    let apendiceURL: string;
    apendiceURL = '?';
    if (filtros != null){
      console.log('transformando filtros: ', filtros)
      let filtrosMapa = filtros as Map<string, string>;

      console.log('lista de operadores', operadores);
      console.log(operadores.find(operador => operador.condicion == 'equal'));
      //todo 10/01/19 ver si se arma correctamente
      Array.from(filtrosMapa.entries()).
      forEach(entry => {
          let op = operadores.find(operador => operador.condicion == 'equal');
          console.log('Key: ' + entry[0] + ' Value: ' + entry[1])
          apendiceURL = apendiceURL +  entry[0] + '=' + op.texto + '[' + entry[1] + ']' + '&';
        }
      );

      // filtrosMapa.forEach(filtro => {
      //   apendiceURL = apendiceURL + filtro
      // });
    }
    // else{
    //   apendiceURL = null;
    // }
    return apendiceURL;
  }
}

