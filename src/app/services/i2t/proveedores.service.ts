import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';
import { ConsDinService } from 'src/app/classes/cons-din-service';

//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQwNDQyMDY0LCJleHAiOjE1NDA0NjAwNjR9.OZ0MRo_fNuVpXx-9SJCUBRud_bR3wNSfNAJUfn9O1i8';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService implements ConsDinService {

  compraProveedores:any [] = [];

  //preUrl:string = "http://tstvar.i2tsa.com.ar:3000/";
  preUrl:string = PreUrl;

  constructor( private http:HttpClient ) { }

  login( body:string ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let query = "login/";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers } );
  }

  getProveedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/proveedor?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCProveedor( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_proveedores?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCProveedores( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_proveedores`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCabeceraProveedor(idProveedor:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let jsbody = {"Id_Proveedor": idProveedor}; //"ff413af6-ee5c-11e8-ab85-d050990fe081"
    let body = JSON.stringify(jsbody);

    let query = "api/proc/proveedores_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getRelComerciales( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_relacioncomercial_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getFormularios( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_formulario_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getImpuestos( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_impuesto_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getArticulos( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_articulo_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  getAFIP( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_afip_GET_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
  /*
  postCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/CabeceraIns";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
  */
  postCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  postRelComercial( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_relacioncomercial_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  postImpuesto( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_impuesto_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  postFormulario( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_formulario_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  postArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_articulo_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  postAFIP( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_afip_INS_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  //
  deleteCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  deleteRelComercial( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_relacioncomercial_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  deleteImpuesto( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_impuesto_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  deleteFormulario( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_formulario_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
  
  deleteArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_articulo_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  deleteAFIP( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_afip_DEL_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  //
  updateCabecera( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_UDP_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  updateRelComercial( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_relacioncomercial_UDP_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  updateImpuesto( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_impuesto_UDP_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
  
  updateFormulario( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_formulario_UPD_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
  updateArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_articulo_UDP_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  updateAFIP( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/proveedores_afip_UDP_SP";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }

  //
/*   getArticulo( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  } */

  getItem( id:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/item?codigo=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  /* postArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/DetalleIns";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  } */

  editArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/detalleUpd";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  }
/* 
  deleteArticulo( body:string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });

    let query = "api/proc/DetalleDel";
    let url = this.preUrl + query;

    return this.http.post( url, body, { headers });
  } */
  
  //devuelve string
  public eliminar(parametros: any){
    console.log('Eliminando proveedor, parametros: ', parametros);
    // return 'No implementado, parametros: ' + parametros;
    console.log('id para eliminar: ', parametros.parametros.id)
    let jsbody = {
      "Id_Proveedor": parametros.parametros.id, 
      }
    let jsonbody = JSON.stringify(jsbody);
    let respuesta = this.deleteCabecera(jsonbody, parametros.token);
    console.log('respuesta a devolver: ', respuesta);
    return respuesta;
  }

  // exportar(parametros: any): any;
  public exportar(parametros: any){
    return this.getCProveedores( parametros.token )
  }

}
