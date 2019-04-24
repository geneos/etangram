import { Injectable, Injector } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
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
//import { ConsDinService } from 'src/app/classes/din-service-wrapper';
import { RefContablesService } from './ref-contables.service';
import { Http } from '@angular/http';

const operadores = [
  { condicion: 'equal',         texto: 'eq'},  //igual que
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

var parametrosServiceFactory;
@Injectable({
  providedIn: 'root',
  // useFactory: serviceFactory,
  // deps: parametrosServiceFactory,
})
export class ConsultaDinamicaService {

  //compraProveedores:any [] = [];
  preUrl:string = PreUrl;

  //servicio a usar
  // servicio: ConsDinService;
  // servicio: any;

  //datos de filtros
  // private datosFiltros = new BehaviorSubject('default message');
  // private datosFiltros: BehaviorSubject<any>;
  private datosFiltros: BehaviorSubject<Map<string, string>>;
  // datosFiltrosAct = this.datosFiltros.asObservable();
  datosFiltrosAct: Observable<Map<string, string>>;

  constructor(public http:HttpClient,
              private injectorInstance: Injector) {
    let mapa = new Map<string, string>();
    this.datosFiltros = new BehaviorSubject<Map<string, string>>(mapa);
    this.datosFiltrosAct = this.datosFiltros.asObservable();

    //todo borrar
    // this.obtenerServicio('test string');
  }

  resetFiltros(){
    this.datosFiltros.next(new Map<string, string>());
  }

  getFiltros(){
    //futuro: cambiar porque dicen que es mala idea
    return this.datosFiltros.getValue();
  }

  actualizarDatos(datosNuevos: Map<string, string>) {
    console.log('actualizando datos en servicio');
    let mapaTemp = this.datosFiltros.value;
    datosNuevos.forEach(element => {
      console.log(element);
    });

    console.log('prueba de mergeado: ');
    let mergedMap:Map<string, string> = new Map([...Array.from(mapaTemp.entries()), ...Array.from(datosNuevos.entries())]);
    // console.log(mergedMap);
    // console.log('limpiando el mapa, entries totales: ', mergedMap.entries.length);
    let listaFiltros = Array.from(mergedMap.entries());
    console.log(listaFiltros)
    /* // console.log(mergedMap.entries())
    // console.log(mergedMap.values())
    // let entries = mergedMap.entries();
    // let index = mergedMap.entries.length;
    let listToDelete: string[] = [];
    // for (let index = 0; index < mergedMap.entries.length; index++) {
    for (let index = 0; index < listaFiltros.length; index++) {    
      // const element = mergedMap.entries[index];
      const element = listaFiltros[index];
      console.log('elemento: ', element, element[0], element[1])
      
      if ((element[1] == null)||(element[1]=='')){
        console.log('agregado a la lista')
          listToDelete.push(element[0]);
      }
      else{
        console.log('salteado')
      }

      // if ((element. == null)||(element.value === '')){
      //   console.log('agregado a la lista')
      //   listToDelete.push(index);
      // }
      // else{
      //   console.log('salteado')
      // }
      
    }

    listToDelete.forEach(element => {
      console.log('borrando del mapa a: ', element)
      mergedMap.delete(element);
    });
    console.log('lista a eliminar del mapa: ', listToDelete)
    // let mapToDelete:Map<string, string>;
    // Array.from(mergedMap.entries().filter(entry => entry.v)
    // mergedMap.forEach(element => {
    //   console.log(element);
    // }); 
    // mapaTemp.set(datosNuevos.);
    // this.datosFiltros.next(datosNuevos)
    console.log('mapa supuestamente limpio: ', mergedMap); */
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

    let query = `api/tg06_tg_reportes?name=eq[${name}]`;
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

  //todo quitar todo lo de incluyeEliminados
  // getDatos( name:string, listaAtributos: any[], filtros: any, incluyeEliminados: boolean, token:string ){
  getDatos( name:string, filtros: any, incluyeEliminados: boolean, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/${name}`;
    let filtro: string;
    //armado de consulta
    if (filtros != null)
    {
      console.log('armado de consulta aquí =====>>>>');

      // query = query + this.armarConsulta(filtros);
      // if (incluyeEliminados){
        filtro = this.armarConsulta(filtros);
      // }
      // else{
        // if (listaAtributos.find(atributo => atributo == 'deleted')){
          // filtro = this.armarConsulta(filtros)+ '&deleted=0';
        // }
      // }

      query = query + filtro;
      console.log('url final: ' + query);
    }
    //
    else{
      console.log('sin armado de consulta aquí (es nulo) =====>>>>');
      // if (!incluyeEliminados){
        // query = query + '?deleted=0';
      // }
      // else{
      //   query = query;
      // }
      // // else{
      // //   query = query;
      // // }
      // console.log('url final sin filtros: ' + query);

    }
    // this.datosFiltros.value.forEach(element => {
    //   element
    // });
    //

    let url = this.preUrl + query;

    // let resultadoTemp = this.http.get( url , { headers });
    // let resultado: any;
    // if (){
    //   resultado = resultadoTemp.
    // }
    // else{
    //   resultado = resultadoTemp;
    // }
    return this.http.get( url , { headers });
    // return resultado
  }

  armarConsulta(filtros: any){
    let apendiceURL: string;
    apendiceURL = '?';
    if (filtros != null){
      console.log('transformando filtros: ', filtros);
      let filtrosMapa = filtros as Map<string, string>;
      console.log('mapa de filtros: ', filtrosMapa);

      console.log('lista de operadores', operadores);
      console.log(operadores.find(operador => operador.condicion == 'equal'));
      console.log(operadores.find(operador => operador.condicion == 'like'));
      
      Array.from(filtrosMapa.entries()).
      forEach(entry => {
          if (!((entry[1]== null)||(entry[1]==''))){
            // let op = operadores.find(operador => operador.condicion == 'equal');
            let op = operadores.find(operador => operador.condicion == 'like');
            console.log('Key: ' + entry[0] + ' Value: ' + entry[1])
            apendiceURL = apendiceURL +  entry[0] + '=' + op.texto + '[' + entry[1] + ']' + '&';
          }
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

  /* obtenerServicio(nombreReporte: string){
    console.log('nombreReporte: ', nombreReporte);
    parametrosServiceFactory = nombreReporte;
    // parametrosServiceFactory = proveedorDeServicios;
    parametrosServiceFactory = {nombre: nombreReporte, http: this.http};
    console.log('parametrosServiceFactory: ', parametrosServiceFactory);

    // this.servicio = this.injectorInstance.get(parametrosServiceFactory);
    // this.servicio = this.injectorInstance.get(serviceFactory(parametrosServiceFactory));
    console.log(this.servicio);
  } */

}
//factory de servicios
// export function serviceFactory(nombreReporte: string){
  
// export function serviceFactory(parametros: any){
export function ConsDinServiceFactory(http: HttpClient){
  console.log('inyectando servicio');

  return new RefContablesService(http);

  // console.log('Se generará el servicio correspondiente con: ' + parametros);
  // console.log('nombre: ', parametros.nombre);
  // console.log('http: ', parametros.http);
  // return new ConsDinService();
  // return new RefContablesService(this.http);
  // return new RefContablesService(parametros.http);
  // switch (nombreReporte) {
  //   case '':
      
  //     break;
  
  //   default:
  //     break;
  // } 
}

/* export let proveedorDeServicios =
  { provide: ConsDinService,
    useFactory: serviceFactory,
    deps: parametrosServiceFactory
  }; */