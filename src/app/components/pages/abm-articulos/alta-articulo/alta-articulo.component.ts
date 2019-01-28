import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { getMatFormFieldMissingControlError, MatSnackBar } from '@angular/material';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { Proveedor } from 'src/app/interfaces/proveedor.interface';
import { Subscription } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

const ARTICULOS:any[] = [
  {'nroArticulo':0,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40},
  {'nroArticulo':1,'articulo':'Gomitas Mogul','unidadMedida':'Bolsa(s)','precioUnitario':35},
  {'nroArticulo':2,'articulo':'Chupetines Mr. Pops','unidadMedida':'Bolsa(s)','precioUnitario':50},
  {'nroArticulo':3,'articulo':'Alfajores Terrabusi','unidadMedida':'Caja(s)','precioUnitario':72},
  {'nroArticulo':4,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40}
];

var auxProvData,auxArtiData:any;

@Component({
  selector: 'app-alta-articulo',
  templateUrl: './alta-articulo.component.html',
  styleUrls: ['./alta-articulo.component.css']
})
export class AltaArticuloComponent implements OnInit {

  constArticulos = ARTICULOS;

  user:string='usuario1';
  pass:string='password1'
  token: string = "a";

  forma:FormGroup;
  id:any;

  existe:boolean;

  fotos:any[]=[{'nroFoto':0},];
  proveedores:any[]=[{'nroProveedor':0},];
  depositos:any[]=[{'nroDeposito':0},];
  sustitutos:any[]=[{'nroSustituto':0},];
  artRelaciones:any[]=[{'nroArtRelacion':0},];
  umAlt:any[]=[{'nroUMAlt':0},];
  auxRid:any;
  loginData: any;
  
  proveedorData: any;
  proveedor: Proveedor;
  @ViewChild('codProv', { read: ElementRef}) elCodProv: any;
  @ViewChild('codArtProv', { read: ElementRef}) elcodArtProv: any;
  @ViewChild('codArtSust', { read: ElementRef}) elcodArtSust: any;
  @ViewChild('codArtHijo', { read: ElementRef}) elcodArtHijo: any;

  suscripcionConsDin: Subscription;
  
  constructor(private route:ActivatedRoute,
              public snackBar: MatSnackBar,
              public ngxSmartModalService: NgxSmartModalService,
              private _proveedorService: ProveedoresService,
              private ref: ChangeDetectorRef 
              ) {
    this.forma = new FormGroup({
      'tipo': new FormControl(1,Validators.required),
      'nroArticulo': new FormControl('',Validators.required),
      'descripcion': new FormControl('',Validators.required),
      'codigoAlternativo': new FormControl(),
      'codigoBarra': new FormControl(),
      'idGrupo': new FormControl('',Validators.required),
      'idTipoArticulo': new FormControl('',Validators.required),
      'procedencia': new FormControl('',Validators.required),
      'propio': new FormControl(),
      'idMarca': new FormControl(),
      'idCampo1': new FormControl(),
      'idCampo2': new FormControl(),
      'idCampo3': new FormControl(),
      'estado': new FormControl('',Validators.required),
      'categoria_bloqueo': new FormControl(),
      'obsRegistroAutoVta': new FormControl(),
      'obsRegistroAutoCpa': new FormControl(),
      'obsIngresoVta': new FormControl(),
      'obsIngresoCpa': new FormControl(),
      'obsAuditoriaVta': new FormControl(),
      'obsAuditoriaCpa': new FormControl(),
      'obsImprimeVta': new FormControl(),
      'categoriaVenta': new FormControl(),
      'categoriaCompra': new FormControl(),
      'categoriaInventario': new FormControl(),
      //comprasyventas
      'precioUltCompra': new FormControl(),
      'fechaUltCompra': new FormControl(),
      'idMonedaUltCompra': new FormControl(),
      'cantidadOptimaDeCompra': new FormControl(),
      'precioUltVenta': new FormControl(),
      'fechaUltVenta': new FormControl(),
      'idMonedaUltVenta': new FormControl(),
        //proveedor
        'proveedor': new FormControl('',Validators.required,this.existeProveedor),
        'razonSocial': new FormControl(),
        'artDeProveedor': new FormControl('',Validators.required,this.existeArticulo),
        'artCodBarra': new FormControl(),
      //Impositivo
      'idGrupoRefContArticulo': new FormControl(),
      'idAlicuotaIva': new FormControl(),
      'idAlicuotaImpInt': new FormControl(),
      'IIAreaAplicacionAlicuota': new FormControl(),
      'IIAreaAplicacionImporteFijo': new FormControl(),
      'IncorporarIIalCosto': new FormControl(),
      'impuestoInternoFijo': new FormControl(),
      //Lotes y Series
      'gestionDespacho': new FormControl(),
      'gestionLote': new FormControl(),
      'gestionSerie': new FormControl(),
      //Stock
      'administraStock': new FormControl(),
      'stockIdeal': new FormControl(),
      'stockMaximo': new FormControl(),
      'stockReposicion': new FormControl(),
        //Productos sustitutos
        'artSust': new FormControl(),
        //Productos Relacionados
        'artHijo': new FormControl(),
      //Datos Dimensiones
      'Dimensiones': new FormControl(),
      'Pesable': new FormControl(),
      'Pesable_Estandar': new FormControl(),
      'unidadMedidaBase': new FormControl(),
      'aplicaConversionUnidadPrecio': new FormControl(),
      'unidadMedidaLP': new FormControl(),
      'largo': new FormControl(),
      'ancho': new FormControl(),
      'profundidad': new FormControl(),
      'm3': new FormControl(),


      /*'articulo': new FormControl('',Validators.required),
      'unidadMedida': new FormControl('',Validators.required),
      'precioUnitario': new FormControl('',Validators.required)*/
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constArticulos ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['nroArticulo'].setValue(this.id);
            /*this.forma.controls['articulo'].setValue(this.constArticulos[this.id].articulo);
            this.forma.controls['unidadMedida'].setValue(this.constArticulos[this.id].unidadMedida);
            this.forma.controls['precioUnitario'].setValue(this.constArticulos[this.id].precioUnitario);*/
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['nroArticulo'].disable();
          /*this.forma.controls['articulo'].disable();
          this.forma.controls['unidadMedida'].disable();
          this.forma.controls['precioUnitario'].disable();*/
        }
      }

    });

    //suscripciones para rellenar datos después 
    this.forma.controls['proveedor'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['proveedor'], this.proveedor)  
        console.log('Valor de el otro elemento: ', this.forma.controls['razonSocial'].value)
        this.elCodProv.nativeElement.dispatchEvent(new Event('keyup'));

        // this.forma.controls['proveedor'].updateValueAndValidity();
        // this.ref.detectChanges();
        // this.forma.updateValueAndValidity();
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();
      })
      // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    });

    this.forma.controls['artDeProveedor'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['artDeProveedor'], this.proveedor)  
        console.log('Valor de el otro elemento: ', this.forma.controls['artCodBarra'].value)
        this.elcodArtProv.nativeElement.dispatchEvent(new Event('keyup'));

        // this.forma.controls['proveedor'].updateValueAndValidity();
        // this.ref.detectChanges();
        // this.forma.updateValueAndValidity();
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();
      })
      // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    });

    this.forma.controls['artSust'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['artSust'])   //this.articulo?
        // console.log('Valor de el otro elemento: ', this.forma.controls['artCodBarra'].value)
        this.elcodArtSust.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });

    this.forma.controls['artHijo'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['artHijo'])   //this.articulo?
        // console.log('Valor de el otro elemento: ', this.forma.controls['artCodBarra'].value)
        this.elcodArtHijo.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
  }

  ngOnInit() {
  }

  addFoto(){this.fotos.push('nroFoto:'+(this.fotos.length).toString);}
  deleteFoto(ind){this.fotos.splice(ind, 1);}

  addProveedor(){this.proveedores.push('nroProveedor:'+(this.proveedores.length).toString);}
  deleteProveedor(ind){this.proveedores.splice(ind, 1);}

  addDeposito(){this.depositos.push('nroDeposito:'+(this.depositos.length).toString);}
  deleteDeposito(ind){this.depositos.splice(ind, 1);}

  addSustituto(){this.sustitutos.push('nroSustituto:'+(this.sustitutos.length).toString);}
  deleteSustituto(ind){this.sustitutos.splice(ind, 1);}

  addArtRelacion(){this.artRelaciones.push('nroArtRelacion:'+(this.artRelaciones.length).toString);}
  deleteArtRelacion(ind){this.artRelaciones.splice(ind, 1);}

  addUMAlt(){this.umAlt.push('nroUMAlt:'+(this.umAlt.length).toString);}
  deleteUMAlt(ind){this.umAlt.splice(ind, 1);}

  guardarArticulo(){
    if( this.id == "nuevo" ){
      // insertando
      let jsbody = {
        "ArticuloItem" : this.forma.controls['tipo'].value,
        "IPart_number" : this.forma.controls['nroArticulo'].value,
        "IName" : this.forma.controls['descripcion'].value,
        "C_alternativo": this.forma.controls['codigoAlternativo'].value,
        "C_barra": this.forma.controls['codigoBarra'].value,
        "Grupo": "",//id de tabla grupos-consulta dinamica
 
        "Tipo":"",// id de la tabla tipo de articulos consulta dinamica
        "procedencia": this.forma.controls['procedencia'].value,// combo ->0 nacional,1-importado
        "marca":"",// id de marcas ->consulta dinamica
        "campo1": this.forma.controls['campo1'].value,
        "campo2": this.forma.controls['campo2'].value,
        "campo3": this.forma.controls['campo3'].value,
        "estado": this.forma.controls['estado'].value,// "Activo", 
        "cat_b": this.forma.controls['categoria_bloqueo'].value,
        "Obs_auto_vta":this.forma.controls['obsRegistroAutoVta'].value, // , 0 false , 1 true
        "Obs_auto_cpa":this.forma.controls['obsRegistroAutoCpa'].value, //,0 false , 1 true
        "Obs_ingr_cpa":this.forma.controls['obsIngresoCpa'].value, //,0 false , 1 true
        "Obs_ingr_vta": this.forma.controls['obsIngresoVta'].value,//,0 false , 1 true
        "Obs_imprime_vta": this.forma.controls['obsImprimeVta'].value,//,0 false , 1 true
        "Obs_auditoria_cpa": this.forma.controls['obsAuditoriaCpa'].value,//,0 false , 1 true
        "Obs_auditoria_vta": this.forma.controls['obsAuditoriaVta'].value,//,0 false , 1 true
        "Categoria_vta": this.forma.controls['categoriaVenta'].value,//,0 false , 1 true
        "Categoria_inventario": this.forma.controls['categoriaInventario'].value,//,0 false , 1 true
        "Categoria_cpa": this.forma.controls['categoriaCompra'].value,//,0 false , 1 true

        "precio_UCpa":this.forma.controls['precioUltCompra'].value,// 200,
        "fecha_UCpa": this.forma.controls['fechaUltCompra'].value,
        "moneda":"",// codigo de monedas → lista desplegable con tg01_monedas
        "Cant_Op_cpa": this.forma.controls['cantidadOptimaDeCompra'].value,
        "PrecioU_vta": this.forma.controls['precioUltVenta'].value,
        "FechaU_vta": this.forma.controls['fechaUltVenta'].value,
        "moneda1":"",//, codigo de monedas-> lista desplegable con tg01_monedas

        "ref_contable": "",//id de referencia contable ->consulta dinamica
        "alicuota": "",//,id de alicuota-> lista deplegable con metodo tg01_alicuotas  (tipo iva)
        "alicuota1":"",//,id de alicuota->consulta dinamica (tipo impuestos internos)
        "Area_AAII":this.forma.controls['IIAreaAplicacionAlicuota'].value,// ,  0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "Area_AIFII":this.forma.controls['IIAreaAplicacionImporteFijo'].value,//, 0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "incorporaCosto":this.forma.controls['IncorporarIIalCosto'].value,// 0, 0 false , 1 true
        "impuesto_intFijo": this.forma.controls['impuestoInternoFijo'].value,
        "gestion_despacho":this.forma.controls['gestionDespacho'].value,//0, 0 false , 1 true
        "gestion_lote":this.forma.controls['gestionLote'].value,// 0,0 false , 1 true
        "gestion_serie":this.forma.controls['gestionSerie'].value,//0,0 false , 1 true

        "admStock": this.forma.controls['administraStock'].value,//0, 0 false , 1 true
        "stockIdeal": this.forma.controls['stockIdeal'].value,
        "stockMax": this.forma.controls['stockMaximo'].value,
        "stockRepo":this.forma.controls['stockReposicion'].value,
        "dimensiones": this.forma.controls['Dimensiones'].value,
        "pesable":this.forma.controls['Pesable'].value,
        "pesableE":this.forma.controls['Pesable_Estandar'].value, 
        "unidad_medida":"",//char(36),id de UM,consulta dinamica,
        "unidad_medida1":"",// char(36) id de UM,consulta dinamica,
        "largo":this.forma.controls['largo'].value,
        "ancho":this.forma.controls['ancho'].value,
        "profundidad":this.forma.controls['profundidad'].value,
        "m3": this.forma.controls['m3'].value
      };
      // ARTÍCULO - DEPÓSITO: INSERT
     let jsbodyDepo = {
      "id": 12,
      "name": "jcabrera",
      "date_entered": "2018-02-26",
      "date_modified": "2018-02-26",
      "modified_user_id": 1,
      "created_by": 1,
      "description": null,
      "deleted": 0,
      "assigned_user_id": 1,
      "aos_products_id_c": this.auxRid,
      "tg01_depositos_id_c": 1,// Id consulta dinámica de tabla: tg01_depositos
      "stockideal": 150,
      "stockmaximo": 1500,
      "stockreposicion": 15
      
   }
      
    }else{
      //actualizando

      let jsbody = {
        "ArticuloItem" : this.forma.controls['tipo'].value,
        "IPart_number" : this.forma.controls['nroArticulo'].value,
        "IName" : this.forma.controls['descripcion'].value,
        "C_alternativo": this.forma.controls['codigoAlternativo'].value,
        "C_barra": this.forma.controls['codigoBarra'].value,
        "Grupo": "",//id de tabla grupos-consulta dinamica

        "Tipo":"",// id de la tabla tipo de articulos consulta dinamica
        "procedencia": this.forma.controls['procedencia'].value,// combo ->0 nacional,1-importado
        "marca":"",// id de marcas ->consulta dinamica
        "campo1": this.forma.controls['campo1'].value,
        "campo2": this.forma.controls['campo2'].value,
        "campo3": this.forma.controls['campo3'].value,
        "estado": this.forma.controls['estado'].value,// "Activo", 
        "cat_b": this.forma.controls['categoria_bloqueo'].value,
        "Obs_auto_vta":this.forma.controls['obsRegistroAutoVta'].value, // , 0 false , 1 true
        "Obs_auto_cpa":this.forma.controls['obsRegistroAutoCpa'].value, //,0 false , 1 true
        "Obs_ingr_cpa":this.forma.controls['obsIngresoCpa'].value, //,0 false , 1 true
        "Obs_ingr_vta": this.forma.controls['obsIngresoVta'].value,//,0 false , 1 true
        "Obs_imprime_vta": this.forma.controls['obsImprimeVta'].value,//,0 false , 1 true
        "Obs_auditoria_cpa": this.forma.controls['obsAuditoriaCpa'].value,//,0 false , 1 true
        "Obs_auditoria_vta": this.forma.controls['obsAuditoriaVta'].value,//,0 false , 1 true
        "Categoria_vta": this.forma.controls['categoriaVenta'].value,//,0 false , 1 true
        "Categoria_inventario": this.forma.controls['categoriaInventario'].value,//,0 false , 1 true
        "Categoria_cpa": this.forma.controls['categoriaCompra'].value,//,0 false , 1 true

        "precio_UCpa":this.forma.controls['precioUltCompra'].value,// 200,
        "fecha_UCpa": this.forma.controls['fechaUltCompra'].value,
        "moneda":"",// codigo de monedas → lista desplegable con tg01_monedas
        "Cant_Op_cpa": this.forma.controls['cantidadOptimaDeCompra'].value,
        "PrecioU_vta": this.forma.controls['precioUltVenta'].value,
        "FechaU_vta": this.forma.controls['fechaUltVenta'].value,
        "moneda1":"",//, codigo de monedas-> lista desplegable con tg01_monedas

        "ref_contable": "",//id de referencia contable ->consulta dinamica
        "alicuota": "",//,id de alicuota-> lista deplegable con metodo tg01_alicuotas  (tipo iva)
        "alicuota1":"",//,id de alicuota->consulta dinamica (tipo impuestos internos)
        "Area_AAII":this.forma.controls['IIAreaAplicacionAlicuota'].value,// ,  0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "Area_AIFII":this.forma.controls['IIAreaAplicacionImporteFijo'].value,//, 0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "incorporaCosto":this.forma.controls['IncorporarIIalCosto'].value,// 0, 0 false , 1 true
        "impuesto_intFijo": this.forma.controls['impuestoInternoFijo'].value,
        "gestion_despacho":this.forma.controls['gestionDespacho'].value,//0, 0 false , 1 true
        "gestion_lote":this.forma.controls['gestionLote'].value,// 0,0 false , 1 true
        "gestion_serie":this.forma.controls['gestionSerie'].value,//0,0 false , 1 true

        "admStock": this.forma.controls['administraStock'].value,//0, 0 false , 1 true
        "stockIdeal": this.forma.controls['stockIdeal'].value,
        "stockMax": this.forma.controls['stockMaximo'].value,
        "stockRepo":this.forma.controls['stockReposicion'].value,
        "dimensiones": this.forma.controls['Dimensiones'].value,
        "pesable":this.forma.controls['Pesable'].value,
        "pesableE":this.forma.controls['Pesable_Estandar'].value, 
        "unidad_medida":"",//char(36),id de UM,consulta dinamica,
        "unidad_medida1":"",// char(36) id de UM,consulta dinamica,
        "largo":this.forma.controls['largo'].value,
        "ancho":this.forma.controls['ancho'].value,
        "profundidad":this.forma.controls['profundidad'].value,
        "m3": this.forma.controls['m3'].value
      }
    }
  }

  /* +++++++++++
    ARTÍCULO - FOTOS:

    POST → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosfotos

    {
    "id": 12,
    "name": "jcabrera",
    "date_entered": now()
    "date_modified":now(),
    "modified_user_id": 1 ,usuario logueado por ahora 1
    "created_by": 1,usuario logueado por ahora 1
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1, usuario logueado por ahora 1
    "aos_products_id_c": this.auxRid,
    "foto": "www.i2t-sa.com/fotoJcabrera", URL de la foto
    }



    ARTICULO - PROVEEDORES:

    POST → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosproveedores

    {
    "id": 12,
    "name": "jcabrera",
    "date_entered": "",now()
    "date_modified": now()
    "modified_user_id": 1,usuario logueado por ahora 1
    "created_by": 1,usuario logueado por ahora 1
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1,usuario logueado por ahora 1
    "codigobarra": "",alfanumerico hasta 20 caracteres
    "precioultimacompra": 100,
    "currency_id": 1,
    "ultimacompra": "2018-02-26",
    "tg01_monedas_id_c": 1, ID de consulta dinámica a la tabla tg01_monedas
    "pordefecto": 1,
    "aos_products_id_c": this.auxRid,
    "account_id_c": 1 ID de consulta dinámica a la tabla tg01_accounts_cstm, tiporeferente_c = P
    }


    ARTÍCULO - SUSTITUTO:

    POST → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulossustitutos

    {
    "id": 12,
    "name": "jcabrera",
    "date_entered": "2018-02-26",
    "date_modified": "2018-02-26",
    "modified_user_id": 1,usuario logueado por ahora 1
    "created_by": 1,usuario logueado por ahora 1
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1,usuario logueado por ahora 1
    "aos_products_id_c": this.auxRid,
    "aos_products_id1_c": 1, Id del producto sustituto (Consulta dinámica a aos_products)
    "cantidad": 100, Cantidad
    "tg01_unidadmedida_id_c": 1, Id consulta dinámica a tg01_unidadmedida
    "tg01_unidadmedida_id1_c": 1, Id consulta dinámica a tg01_unidadmedida
    "idsustituto": , codigo de articulo
    "tiposustituto": S simple, C compuesto, P sustituto
    }



    BAJA:

    ARTÍCULOS:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/proc/SP_ET_ArticuloDEL

    Body ejemplo:

    {
    "ID": char(36)->id de la consulta  de articulos,
    }


    ARTÍCULO - DEPÓSITO:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosdepositos/{id}

    {
    "deleted": 1,

    }


    ARTÍCULO - FOTOS:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosfotos/{id}

    {
    "deleted": 1
    }



    ARTICULO - PROVEEDORES:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosproveedores/{id}

    {
    "deleted": 1,

    }

    ARTÍCULO - SUSTITUTO:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulossustitutos/{id}

    {
    "deleted": 1,

    }



    MODIFICACIÓN:


    ARTÍCULOS:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/proc/SP_ET_ArticuloUDP

    Body ejemplo:

    {
    "ArticuloItem" : "" ,A – articulo I- item
    "IPart_number" : "960003" ,
    "IName" : "Torta bombom",
    "C_alternativo": "15065",
    "C_barra": "1234567890987",
    "Grupo":id de tabla grupos-consulta dinamica

    "Tipo": id de la tabla tipo de articulos consulta dinamica
    "procedencia": combo ->0 nacional,1-importado
    "marca": id de marcas ->consulta dinamica
    "campo1": 1,
    "campo2": 1,
    "campo3": 1,
    "estado": "Activo", 
    "cat_b":"Reposteria",
    "Obs_auto_vta": , 0 false , 1 true
    "Obs_auto_cpa": ,0 false , 1 true
    "Obs_ingr_cpa": ,0 false , 1 true
    "Obs_ingr_vta": ,0 false , 1 true
    "Obs_imprime_vta": ,0 false , 1 true
    "Obs_auditoria_cpa": ,0 false , 1 true
    "Obs_auditoria_vta": ,0 false , 1 true
    "Categoria_vta": ,0 false , 1 true
    "Categoria_inventario": ,0 false , 1 true
    "Categoria_cpa": ,0 false , 1 true

    "precio_UCpa": 200,
    "fecha_UCpa": "2018-10-01",
    "moneda": codigo de monedas ->consulta dinamica
    "Cant_Op_cpa": 5,
    "PrecioU_vta": 250,
    "FechaU_vta": "2018-10-01",
    "moneda1":, codigo de monedas->consulta dinamica

    "ref_contable": id de referencia contable ->consulta dinamica
    "alicuota": ,id de alicuota->consulta dinamica
    "alicuota1":,id de alicuota->consulta dinamica
    "Area_AAII": ,  0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
    "Area_AIFII":, 0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
    "incorporaCosto": 0, 0 false , 1 true
    "impuesto_intFijo": 12,
    "gestion_despacho":0, 0 false , 1 true
    "gestion_lote": 0,0 false , 1 true
    "gestion_serie":0,0 false , 1 true

    "admStock": 0, 0 false , 1 true
    "stockIdeal": 10,
    "stockMax": 15,
    "stockRepo":5,
    "dimensiones": "3 dimensiones",
    "pesable":1,
    "pesableE":"GS1", 
    "unidad_medida":char(36),id de UM,consulta dinamica
    "unidad_medida1": char(36) id de UM,consulta dinamica
    "largo":10,
    "ancho":10,
    "profundo":8,
    "m3": 800
    }


    ARTÍCULO - DEPÓSITO:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosdepositos/{id}

    {
    "name": "jcabreraEDIT",
    "date_entered": "2018-02-26",
    "date_modified": "2018-02-26",
    "modified_user_id": 1,
    "created_by": 1,
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1,
    "aos_products_id_c": RId,
    "tg01_depositos_id_c": 1,
    "stockideal": 150,
    "stockmaximo": 1500,
    "stockreposicion": 15
    }

    ARTÍCULO - FOTOS:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosfotos/{id}

    {
    "name": "jcabrera",
    "aos_products_id_c": RId,
    "foto": "www.i2t-sa.com/fotoJcabreraEDIT"
    }



    ARTICULO - PROVEEDORES:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulosproveedores/{id}

    {
    "name": "jcabreraEDIT",
    "date_entered": "2018-02-26",
    "date_modified": "2018-02-26",
    "modified_user_id": 1,
    "created_by": 1,
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1,
    "codigobarra": "1234567891011123456",
    "precioultimacompra": 1000,
    "currency_id": 1,
    "ultimacompra": "2018-02-26",
    "tg01_monedas_id_c": 1,
    "pordefecto": 1,
    "aos_products_id_c": RId,
    "account_id_c": 1
    }


    ARTÍCULO - SUSTITUTO:

    PUT → http://tstvar.i2tsa.com.ar:3000/api/tg08_articulossustitutos/{id}
    {
    "id": 12,
    "name": "jcabreraEDIT",
    "date_entered": "2018-02-26",
    "date_modified": "2018-02-26",
    "modified_user_id": 1,
    "created_by": 1,
    "description": null,
    "deleted": 0,
    "assigned_user_id": 1,
    "aos_products_id_c": 1,
    "aos_products_id1_c": RId,
    "cantidad": 100,
    "tg01_unidadmedida_id_c": 1,
    "tg01_unidadmedida_id1_c": 1,
    "idsustituto": 1,
    "tiposustituto": 1
    }

  */

  //validaciones
  existeProveedor( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxProvData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeArticulo( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxArtiData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  //autocompletado
  buscarProveedor(){
    // console.clear()
    console.log('llamado a la busqueda del proveedor', this.forma.controls['proveedor'].value)
    this._proveedorService.getProveedor( this.forma.controls['proveedor'].value, this.token )
    //this._proveedorService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            this.proveedor = null;
            //let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsbody = {"usuario":this.user,"pass":this.pass}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedorService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProveedor();
              });
            } else {
              if(this.proveedorData.dataset.length>0){
                // this.proveedor = this.proveedorData.dataset[0];
                this['proveedor'] = this.proveedorData.dataset[0];
                console.log('encontrado: ',this.proveedor, this['proveedor']);
        

              } else {
                this.proveedor = null;
              }
            }
      });
  }

  buscarArtProveedor(){
    console.log('todo');
  }

  buscarArtSust(){
    console.log('todo');
  }

  buscarArtHijo(){
    console.log('todo');
  }

  //modal
  abrirConsulta(consulta: string, control: string){
    console.clear();
    let datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      modal: string;
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null,
      modal: 'consDinModal'
    }
    
    let atributoAUsar: string;
    switch (consulta) {
      case 'c_proveedores':
        atributoAUsar = 'codigo';
        break;
      case 'c_articulos':
        atributoAUsar = 'idcategoria';
      default:
        break;
    }

    console.log('enviando datosModal: ');
    console.log(datosModal);
    
    // datosModal.columnSelection = this.columnSelection;
    console.log('Lista de modales declarados: ', this.ngxSmartModalService.modalStack);
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionConsDin = this.ngxSmartModalService.getModal(datosModal.modal).onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de consulta dinamica: ', modal.getData());

      let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);
      console.log('Respuesta del modal: ', respuesta);

      if (respuesta.estado === 'cancelado'){
        this.openSnackBar('Se canceló la selección');
      }
      else{
        setTimeout(() => {
          this.forma.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
          // this['proveedor'] = null;
          this[control] = respuesta.selection[0];
          
          //todo 
          //disparar detección de cambios, cada parte es un intento distinto
          // this.proveedor = respuesta.selection[0];
          
          // setTimeout(() => this.ref.detectChanges(), 1000);
          // this.ref.markForCheck();
        
          // this.forma.controls['artDeProveedor'].updateValueAndValidity();

          console.log('seleccionado: ',this.proveedor, this['proveedor']);
        });

        // this.forma.controls[control].setValue(respuesta.selection[0].cpostal);
        // this.buscarProveedor();
        
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionConsDin.unsubscribe();
      console.log('se desuscribió al modal de consulta dinamica');
    });
    this.ngxSmartModalService.open(datosModal.modal);
  }

  //otros
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }
  
}
