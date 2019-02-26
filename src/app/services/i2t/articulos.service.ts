import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreUrl } from './url';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  //compraProveedores:any [] = [];
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

  getArticulos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getArticulo( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/articulo?codigo=eq[${ id }]`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getcArticulos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_articulos`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getcArticulo( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_articulos/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  //#region datos para autocompletar/comboboxes
  getCategorias( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_producto_categoria`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getCategoria( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/c_producto_categoria/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getMarcas( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tglp_tg_marcas`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getMarca( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tglp_tg_marcas/${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getAtributos(token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_atributosarticulos?codigo=0`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getValoresAtributo(id: string, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_atributosarticulos?idatributo=${ id }&codigo=gt[0] `;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getDepositos( token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_depositos`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }

  getDeposito( id:number, token:string ){
    const headers = new HttpHeaders({
      'x-access-token': token
    });

    let query = `api/tg01_depositos?iddeposito=${ id }`;
    let url = this.preUrl + query;

    return this.http.get( url , { headers });
  }
  //#endregion datos para autocompletar/comboboxes

  //#region abm
    //#region gets
    getCabeceraArticulo(idProveedor:string, token:string ){
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
  
    getDepositosArticulo(idProducto: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token
      });
  
      let query = `api/tg08_articulosdepositos?aos_products_id_c=${ idProducto }&deleted=0`;
      let url = this.preUrl + query;
  
      return this.http.get( url , { headers });
    }

    getFotos(idProducto: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token
      });
  
      let query = `api/tg08_articulosfotos?aos_products_id_c=${ idProducto }&deleted=0`;
      let url = this.preUrl + query;
  
      return this.http.get( url , { headers });
    }
    
    getProveedores(idProducto: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token
      });
  
      let query = `api/tg08_articulosproveedores?aos_products_id_c=${ idProducto }&deleted=0`;
      let url = this.preUrl + query;
  
      return this.http.get( url , { headers });
    }

    getProductosSustitutos(idProducto: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token
      });
  
      let query = `api/tg08_articulossustitutos?aos_products_id_c=${ idProducto }&deleted=0`;
      let url = this.preUrl + query;
  
      return this.http.get( url , { headers });
    }
    //#endregion gets

    //#region baja
    deleteCabeceraArticulo(){

    }

    deleteDeposito( id:string, jsonbody: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
      /* 
      let jsbody = { "deleted": 1 };
      let jsonbody = JSON.stringify(jsbody); */

      let query = `api/tg08_articulosdepositos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, jsonbody, { headers } );
    }

    deleteFoto( id:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
      
      let jsbody = { "deleted": 1 };
      let jsonbody = JSON.stringify(jsbody);

      let query = `api/tg08_articulosfotos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, jsonbody, { headers } );
    }

    deleteProveedor( id:string, body: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
      
      // let jsbody = { "deleted": 1 };
      // let jsonbody = JSON.stringify(jsbody);

      let query = `api/tg08_articulosproveedores/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }

    deleteArticuloSustituto( id:string, jsonbody: string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
      
      // let jsbody = { "deleted": 1 };
      // let jsonbody = JSON.stringify(jsbody);

      let query = `api/tg08_articulossustitutos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, jsonbody, { headers } );
    }
    //#endregion baja

    //#region alta
    postCabeceraArticulo( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/proc/SP_ET_ArticuloINS";
      let url = this.preUrl + query;
  
      return this.http.post( url, body, { headers } );
    }

    postDeposito( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/tg08_articulosdepositos";
      let url = this.preUrl + query;
  
      return this.http.post( url, body, { headers } );
    }

    postFoto( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/tg08_articulosfotos";
      let url = this.preUrl + query;
  
      return this.http.post( url, body, { headers } );
    }

    postProveedor( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/tg08_articulosproveedores";
      let url = this.preUrl + query;
  
      return this.http.post( url, body, { headers } );
    }

    postArticuloSustituto( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/tg08_articulossustitutos";
      let url = this.preUrl + query;
  
      return this.http.post( url, body, { headers } );
    }
    //#endregion alta

    //#region mod
    updateCabeceraArticulo( body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = "api/proc/SP_ET_ArticuloUDP";
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }
    
    updateDeposito(id:string, body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = `api/tg08_articulosdepositos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }
    
    updateFoto(id:string, body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = `api/tg08_articulosfotos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }
    
    updateProveedor(id:string, body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = `api/tg08_articulosproveedores/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }
    
    updateArticuloSustituto(id:string, body:string, token:string ){
      const headers = new HttpHeaders({
        'x-access-token': token,
        'Content-Type': 'application/json'
      });
  
      let query = `api/tg08_articulossustitutos/${id}`;
      let url = this.preUrl + query;
  
      return this.http.put( url, body, { headers } );
    }

    //#endregion mod
  //#endregion abm
}
