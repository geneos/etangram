import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { formatDate } from '@angular/common';
import { TiposDocumentoService } from '../../../../services/i2t/tipos-documento.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { LocalidadesService } from 'src/app/services/i2t/localidades.service';
import { Localidad, Provincia, Pais } from 'src/app/interfaces/localidades.interface';
import { AFIPInternoService } from 'src/app/services/i2t/afip.service';
import { CategoriasReferenteService } from 'src/app/services/i2t/cat-referente.service';
import { MonedasService } from 'src/app/services/i2t/monedas.service';
import { CondicionComercialService } from 'src/app/services/i2t/cond-comercial.service';
import { CondicionComercial } from 'src/app/interfaces/cond-comercial.interface';
import { RefContable } from 'src/app/interfaces/ref-contable.interface';
import { TipoComprobante } from 'src/app/interfaces/tipo-comprobante.interface';
import { RefContablesService } from 'src/app/services/i2t/ref-contables.service';
import { TiposComprobanteService } from 'src/app/services/i2t/tipos-comprobante.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { ArticulosService } from 'src/app/services/i2t/articulos.service';
import { Zona } from 'src/app/interfaces/zona.interface';
import { Vendedor } from 'src/app/interfaces/vendedor.interface';
import { ZonasService } from 'src/app/services/i2t/zonas.service';
import { VendedoresService } from 'src/app/services/i2t/vendedores.service';
import { ListasPreciosService } from 'src/app/services/i2t/listas-precios.service';
import { ListaPrecios } from 'src/app/interfaces/lista-precios.interface';
import { PartidaPresupuestariaService } from 'src/app/services/i2t/part-presupuestaria.service';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { resolveTimingValue } from '@angular/animations/browser/src/util';

const PROVEEDORES:any[] = [
  {'numero':0,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':1,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':2,'razonSocial':'Lunix S.R.L.','cuit':'30-987654321-0','posicionFiscal':'IVA Responsable Inscripto'},
];

var auxLocalidadFac,auxLocalidadEnv,auxArticulo,auxZona,auxVendedor,auxCobrador,
    auxListaPrecios,auxCondComercial,auxPartidaPresupuestaria,auxRefContable,auxTipoComprobante: any;

@Component({
  selector: 'app-alta-proveedor',
  templateUrl: './alta-proveedor.component.html',
  styleUrls: ['./alta-proveedor.component.css']
})
export class AltaProveedorComponent implements OnInit {

  token: string = "a";

  tipoReferente: string;

  impuestosData: any[] = [];
  addingImpuesto:boolean = false;

  stockData: any[] = [];
  addingStock:boolean = false;

  cuentasBanc:any[]=[{'nroCuenta':0},];
  impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  formularios:any[]=[{'nroFormulario':0},];
  articulosStock:any[]=[{'nroArticulosStock':0},];

  constProveedores = PROVEEDORES;

  forma:FormGroup;
  formaCtaBancaria:FormGroup;
  formaImpuesto:FormGroup;
  formaFormulario:FormGroup;
  formaExenciones:FormGroup;
  formaStock:FormGroup;
  formaArticulo:FormGroup;
  id:any;

  existe:boolean;

  suscripcionConsDin: Subscription;
  itemDeConsulta: any;
  
   @ViewChild('tableImpuestos') table: MatTable<any>;
   @ViewChild('tableStock') table2: MatTable<any>;
   //para descripciones
   @ViewChild('artID') elArtID: any;
   @ViewChild('facCodigoPostal') elFacCodigoPostal: any;
   @ViewChild('envCodigoPostal') elEnvCodigoPostal: any;

   @ViewChild('idZona') elIDZona: any;
   @ViewChild('idVendedor') elIDVendedor: any;
   @ViewChild('idCobrador') elIDCobrador: any;

   @ViewChild('condComercial') elCondComercial: any;
   @ViewChild('idListaPrecios') elListaPrecios: any;
   @ViewChild('idPartidaPresupuestaria') elPartidaPresupuestaria: any;
   @ViewChild('refContable') elRefContable: any;
   @ViewChild('idTipoComprobante') elTipoComprobante: any;   

  today: Date;
  tdData: any;
  fcpData: any;//localidades
  fpData: any;//provincias
  pData: any;//paises
  zData:any;//zona
  vData:any;//vendedor
  cData:any;//cobrador
  crefData: any;//categorias referente
  civaData: any;//categorias iva
  mData: any;//monedas
  impData: any;//impuestos
  mimpdata: any;//modelos impuestos
  ccData:any; //condicion comercial
  lpData:any;//lista de precios
  ppData:any;//partida presup
  rcData:any;//referencia contable
  tcData:any;//tipo de comprobante
  aData:any;//articulo
  respData:any; //respuestas de servicio proveedores

  tiposDocumentoAll:any[];
  catsReferenteAll:any[];
  catIVAAll:any[];
  monedasAll:any[];
  impuestosAll:any[];
  modelosImpAll:any[];
  localidadFac: Localidad;
  localidadEnv: Localidad;
  provinciaFac: Provincia;
  provinciaEnv: Provincia;
  paisFac:Pais;
  paisEnv:Pais;
  zona:Zona;
  vendedor:Vendedor;
  cobrador:Vendedor;
  condicionComercial: CondicionComercial;
  listaPrecios: ListaPrecios; //todo revisar hasta espacio
  partidaPresupuestaria: any;
  referenciaContable: RefContable;
  tipoComprobante: TipoComprobante;
  articulo: Articulo;

  loginData: any;

  constructor(private route:ActivatedRoute, 
              private _tiposDocumentoService:TiposDocumentoService,
              private _localidadesService: LocalidadesService,
              private _afipService: AFIPInternoService,
              private _catReferentesService: CategoriasReferenteService,
              private _monedaService: MonedasService,
              private _condicionComercialService: CondicionComercialService,
              private _refContablesService: RefContablesService,
              private _tiposComprobanteService: TiposComprobanteService,
              private _articulosService: ArticulosService,
              private _zonasService: ZonasService,
              private _vendedoresService: VendedoresService,
              private _listasPreciosService: ListasPreciosService,
              private _partidasPresupuestariasService: PartidaPresupuestariaService,
              private _proveedoresService: ProveedoresService,
              public ngxSmartModalService: NgxSmartModalService,
              public snackBar: MatSnackBar,) {
    this.forma = new FormGroup({
      //FILIATORIOS Y GEOGRÁFICOS
      //'tipoReferente': new FormControl('',Validators.required),
      'numero': new FormControl('',Validators.required),
      'razonSocial': new FormControl('',Validators.required),
      'nombreFantasia': new FormControl('',Validators.required),
      'tipoDocumento': new FormControl('',Validators.required),
      'nroDocumento': new FormControl('',Validators.required),
      'facCalle': new FormControl('',Validators.required),
      'facCiudad': new FormControl('',Validators.required),
      'facProvincia': new FormControl('',Validators.required),
      'facCodigoPostal': new FormControl('', Validators.required, this.existeLocalidadFac),
      'facPais': new FormControl('',Validators.required),
      'envCalle': new FormControl(),
      'envCiudad': new FormControl(),
      'envProvincia': new FormControl(),
      'envCodigoPostal': new FormControl(null, this.existeLocalidadEnv),
      'envPais': new FormControl(),
      'telefono1': new FormControl('',Validators.required),
      'telefono2': new FormControl(),
      'telefono3': new FormControl(),
      'email': new FormControl('',Validators.required),
      'observaciones': new FormControl(),
      //RELACION COMERCIAL
        //categorias
        'catRef': new FormControl(),
        'idZona': new FormControl(),
        // 'idZona': new FormControl('', this.existeZona),
        'zonaDesc': new FormControl(),
        'idVendedor': new FormControl(),
        // 'idVendedor': new FormControl('', this.existeVendedor),
        'vendedorDesc': new FormControl(),
        // 'idCobrador': new FormControl('', this.existeCobrador),
        'idCobrador': new FormControl(),
        'cobradorDesc': new FormControl(),
        'limiteCredito': new FormControl(),
        //parametros
        'idlistaPrecios': new FormControl('', this.existeListaPrecios),
        'condComercial': new FormControl('', this.existeCondComercial),
        'idPartidaPresupuestaria': new FormControl(),
        // 'idPartidaPresupuestaria': new FormControl('', this.existePartidaPresupuestaria),
        'refContable': new FormControl('', this.existeRefContable),
        'idTipoComprobante': new FormControl('', this.existeTipoComprobante),
          //descripciones de parametros
          'descListaPrecios': new FormControl(),
          'descCondComercial': new FormControl(),
          'descPartidaPresupuestaria': new FormControl(),
          'descRefContable': new FormControl(),
          'descTipoComprobante': new FormControl(),
        //cuentas: aparte
      //IMPUESTOS
      'sitIVA': new FormControl(),
      'cuit': new FormControl(),
      'cai': new FormControl(),
      'fechaVtoCai': new FormControl(),
        //+ formaImpuesto
        //+ formaFormulario
      //STOCK
    });

    this.formaCtaBancaria = new FormGroup({
      'rcCbu': new FormControl('', Validators.required),
      'rcTipo': new FormControl('', Validators.required),
      'rcCuentaBancaria': new FormControl('', Validators.required),
      'rcCodigoSucursal': new FormControl('', Validators.required),
    });

    this.formaImpuesto = new FormGroup({
      'tipo': new FormControl('', Validators.required),
      'modelo': new FormControl(),
      'situacion': new FormControl('', Validators.required),
      'codInscripcion': new FormControl('', Validators.required),
      'fechaInscripcion': new FormControl('', Validators.required),
      'exenciones': new FormControl()
    });

    this.formaFormulario = new FormGroup({
      'codForm': new FormControl('', Validators.required),
      'fechaPres': new FormControl('', Validators.required),
      'fechaVenc': new FormControl('', Validators.required),
    });

    this.formaExenciones = new FormGroup({
      'nroExcencion': new FormControl('', Validators.required),
      'fechaDesde': new FormControl('', Validators.required),
      'fechaHasta': new FormControl('', Validators.required),
      'excencionObs': new FormControl('', Validators.required),
    });

    this.formaArticulo =  new FormGroup({
      'artID': new FormControl('', Validators.required, this.existeArticulo),
        'artDesc': new FormControl(),
      'ultimaFecha': new FormControl('', Validators.required),
      'ultimoPrecio': new FormControl(),
      'codArtProv': new FormControl(),
      'barrasArtProv': new FormControl('', Validators.required),
      'moneda': new FormControl('', Validators.required)
    });

    this.forma.controls['facCiudad'].disable();
    this.forma.controls['facProvincia'].disable();
    this.forma.controls['facPais'].disable();
    this.forma.controls['envCiudad'].disable();
    this.forma.controls['envProvincia'].disable();
    this.forma.controls['envPais'].disable();

    //deshabilitar campos para descripciones o nombres:
    //datos de relaciones comerciales
      //
      this.forma.controls['zonaDesc'].disable();
      this.forma.controls['vendedorDesc'].disable();
      this.forma.controls['cobradorDesc'].disable();
      //parametros
      this.forma.controls['descListaPrecios'].disable();
      this.forma.controls['descCondComercial'].disable();
      this.forma.controls['descPartidaPresupuestaria'].disable();
      this.forma.controls['descRefContable'].disable();
      this.forma.controls['descTipoComprobante'].disable();

    //articulos
    this.formaArticulo.controls['artDesc'].disable();

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constProveedores ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['numero'].setValue(this.id);
            this.forma.controls['razonSocial'].setValue(this.constProveedores[this.id].razonSocial);
            this.forma.controls['cuit'].setValue(this.constProveedores[this.id].cuit);
            this.forma.controls['posicionFiscal'].setValue(this.constProveedores[this.id].posicionFiscal);
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['numero'].disable();
          this.forma.controls['razonSocial'].disable();
          this.forma.controls['cuit'].disable();
          this.forma.controls['posicionFiscal'].disable();
        }
      }

    });

    //suscripciones para rellenar datos después 
    this.forma.controls['facCodigoPostal'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['facCodigoPostal'])  
        console.log('Objeto recibido: ', this.itemDeConsulta)
        this.elFacCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
        // if (this.itemDeConsulta != null){
        //   this.forma.controls['']
        // }



        // this.forma.controls['facCodigoPostal'].updateValueAndValidity();
        // this.ref.detectChanges();
        // this.forma.updateValueAndValidity();
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();
      })
      // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    });

    this.forma.controls['envCodigoPostal'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['envCodigoPostal'])  
        // console.log('Valor de el otro elemento: ', this.forma.controls['razonSocial'].value)
        this.elEnvCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));

        // this.forma.controls['proveedor'].updateValueAndValidity();
        // this.ref.detectChanges();
        // this.forma.updateValueAndValidity();
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();
      })
      // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    });

    this.formaArticulo.controls['artID'].valueChanges.subscribe(() => {
      // console.clear()
      setTimeout(() => {
        console.log('hubo un cambio')
        // console.log('estado después de timeout ',this['articulo'])  
        // console.log('Valor de el otro elemento: ', this.forma.controls['razonSocial'].value)
        this.elArtID.nativeElement.dispatchEvent(new Event('keyup'));

        // this.forma.controls['proveedor'].updateValueAndValidity();
        // this.ref.detectChanges();
        // this.forma.updateValueAndValidity();
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();
      })
      // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    });

    //descripciones de datos para relaciones comerciales
    this.forma.controls['idZona'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['zona'])  
        this.elIDZona.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idVendedor'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['vendedor'])  
        this.elIDVendedor.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idCobrador'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['cobrador'])  
        this.elIDCobrador.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    //descripciones de parametros
    this.forma.controls['condComercial'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['condComercial'])  
        this.elCondComercial.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idlistaPrecios'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['listaPrecios'])  
        this.elListaPrecios.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idPartidaPresupuestaria'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['partidaPresupuestaria'])  
        this.elPartidaPresupuestaria.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['refContable'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['refContable'])  
        this.elRefContable.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idTipoComprobante'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['tipoComprobante'])  
        this.elTipoComprobante.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });

  }

  ngOnInit() {
    /*for(var i = 0; i < this.impuestos[0].exenciones.length; i++){
      console.log(this.impuestos[0].exenciones[i]);
    }*/
    this.buscarTiposDocumento();
    this.buscarCategoriasIVA();
    this.buscarCategoriasRef();
    this.buscarMonedas();
    this.buscarImpuestos();
    this.buscarModelosImp();

    this.tipoReferente = 'P';
  }

  copiarDireccion(){
    this.forma.controls['envCalle'].setValue(this.forma.controls['facCalle'].value);
    this.forma.controls['envCodigoPostal'].setValue(this.forma.controls['facCodigoPostal'].value);
  }

//impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  addImpuesto(){
    this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    console.log(this.impuestos)
  }
  deleteImpuesto(ind){this.impuestos.splice(ind, 1);}

  addExencion(ind){
    this.impuestos[ind].exenciones.push({'nroExencion':this.impuestos[ind].exenciones.length});
    //for(var i = 0; i < this.impuestos[0].exenciones.length; i++){console.log(this.impuestos[0].exenciones[i]);}
    //console.log(this.impuestos[ind].exenciones)
  }
  deleteExencion(indi,inde){this.impuestos[indi].exenciones.splice(inde, 1);}

  addFormulario(){this.formularios.push({'nroFormulario':(this.formularios.length)});}
  deleteFormulario(ind){this.formularios.splice(ind, 1);}

  addArticulosStock(){this.articulosStock.push({'nroArticulosStock':(this.articulosStock.length)});}
  deleteArticulosStock(ind){this.articulosStock.splice(ind, 1);}

  addCuentaBanc(){this.cuentasBanc.push({'nroCuenta':(this.cuentasBanc.length)});}
  deleteCuentasBanc(ind){this.cuentasBanc.splice(ind, 1);}

  //listas desplegables
  buscarTiposDocumento(){
    this._tiposDocumentoService.getTiposDocumento( this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.tdData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.tdData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tiposDocumentoAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposDocumentoService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTiposDocumento();
              });
            } else {
              if(this.tdData.dataset.length>0){
                this.tiposDocumentoAll = this.tdData.dataset;
                console.log(this.tiposDocumentoAll);
                //this.loading = false;

              } else {
                this.tiposDocumentoAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarCategoriasIVA(){
    this._afipService.getCategoriasIVA( this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.civaData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.civaData.returnset[0].RCode=="-6003"){
            //token invalido
            this.catIVAAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._afipService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasIVA();
              });
            } else {
              if(this.civaData.dataset.length>0){
                this.catIVAAll = this.civaData.dataset;
                console.log(this.catIVAAll);
                //this.loading = false;

              } else {
                this.catIVAAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarCategoriasRef(){
    this._catReferentesService.getCategorias( this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.crefData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.crefData.returnset[0].RCode=="-6003"){
            //token invalido
            this.catsReferenteAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposDocumentoService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasRef();
              });
            } else {
              if(this.crefData.dataset.length>0){
                this.catsReferenteAll = this.crefData.dataset;
                console.log(this.catsReferenteAll);
                //this.loading = false;

              } else {
                this.catsReferenteAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarMonedas(){
    this._monedaService.getMonedas(this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataM => {
        console.log(dataM);
          this.mData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mData.returnset[0].RCode=="-6003"){
            //token invalido
            this.monedasAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMonedas();
              });
            } else {
              if(this.mData.dataset.length>0){
                this.monedasAll = this.mData.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
              }
              else{
                this.monedasAll = null;
              }
            }

      });
  }

  buscarImpuestos(){
    this._afipService.getImpuestos(this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataM => {
        console.log(dataM);
          this.impData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.impData.returnset[0].RCode=="-6003"){
            //token invalido
            this.impuestosAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarImpuestos();
              });
            } else {
              if(this.impData.dataset.length>0){
                this.impuestosAll = this.impData.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
              }
              else{
                this.impuestosAll = null;
              }
            }

      });
  }

  buscarModelosImp(){
    this._afipService.getModelosImpuesto(this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataM => {
        console.log(dataM);
          this.mimpdata = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mimpdata.returnset[0].RCode=="-6003"){
            //token invalido
            this.modelosImpAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarModelosImp();
              });
            } else {
              if(this.mimpdata.dataset.length>0){
                this.modelosImpAll = this.mimpdata.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
              }
              else{
                this.modelosImpAll = null;
              }
            }

      });
  }
  //fin listas desplegables

  //autocompletado
  buscarCPostalFac(){
    console.log('buscando codigo postal: ', this.forma.controls['facCodigoPostal'].value)
    this._localidadesService.getLocalidades(this.forma.controls['facCodigoPostal'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.fcpData = data;
          auxLocalidadFac= this.fcpData.dataset.length;
          if(this.fcpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.localidadFac = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalFac();
              });
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadFac = this.fcpData.dataset[0];
                console.log('Localidad de facturacion: ', this.localidadFac);
                //this.loading = false;
                // this.buscarProvinciaFac(this.localidadFac.tg01_provincias_id_c, this.token)
                this.buscarProvinciaFac();

              } else {
                this.localidadFac = null;
                console.log(this.fcpData)

              }
            }
            //console.log(this.refContablesAll);
      });
  }
  
  buscarCPostalEnv(){
    console.log('buscando codigo postal: ', this.forma.controls['envCodigoPostal'].value)
    this._localidadesService.getLocalidades(this.forma.controls['envCodigoPostal'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.fcpData = data;
          auxLocalidadEnv = this.fcpData.dataset.length;
          if(this.fcpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.localidadEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalEnv();
              });
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadEnv = this.fcpData.dataset[0];
                console.log('Localidad de envio: ', this.localidadEnv);
                //this.loading = false;
                this.buscarProvinciaEnv();

              } else {
                console.log(this.fcpData)
                this.localidadEnv = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarProvinciaFac(){
    this._localidadesService.getProvincias(this.localidadFac.tg01_provincias_id_c, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.fpData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.fpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.provinciaFac = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalFac();
              });
            } else {
              if(this.fpData.dataset.length>0){
                this.provinciaFac = this.fpData.dataset[0];
                // console.log(this.provinciaFac);
                console.log('provincia de fact: ', this.provinciaFac);
                //this.loading = false;
                this.buscarPaisFac();

              } else {
                this.provinciaFac = null;
                // console.log(this.fcpData)

              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarProvinciaEnv(){
    this._localidadesService.getProvincias(this.localidadEnv.tg01_provincias_id_c, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.fpData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.fpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.provinciaEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalFac();
              });
            } else {
              if(this.fpData.dataset.length>0){
                this.provinciaEnv = this.fpData.dataset[0];
                console.log('provincia de env: ', this.provinciaEnv);
                //this.loading = false;
                this.buscarPaisEnv();
              } else {
                this.provinciaEnv = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarPaisFac(){
    //todo cambiar hardcodeado por lo que viene en localidades
    this._localidadesService.getPaises("e5dc7f36-31ba-acbf-8c72-5ba4042eec36", this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.pData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            this.paisEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPaisFac();
              });
            } else {
              if(this.pData.dataset.length>0){
                this.paisFac = this.pData.dataset[0];
                console.log('pais de fac: ', this.paisFac);
                //this.loading = false;

              } else {
                this.paisFac = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarPaisEnv(){
    //todo cambiar hardcodeado por lo que viene en localidades
    this._localidadesService.getPaises("e5dc7f36-31ba-acbf-8c72-5ba4042eec36", this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.pData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            this.paisEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPaisEnv();
              });
            } else {
              if(this.pData.dataset.length>0){
                this.paisEnv = this.pData.dataset[0];
                console.log('pais de env: ', this.paisEnv);
                //this.loading = false;

              } else {
                this.paisEnv = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  /*getdatetime(){
    this.today = new Date();
    return formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'en-US', '-0300');
  }*/
  
  buscarZona(){
    this._zonasService.getZonaPorIDZona(this.forma.controls['idZona'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.zData = data;
          auxZona = this.zData.dataset.length;
          if(this.zData.returnset[0].RCode=="-6003"){
            //token invalido
            this.zona = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarZona();
              });
            } else {
              if(this.zData.dataset.length>0){
                this.zona = this.zData.dataset[0];
                console.log('zona encontrada: ', this.zona);
                //this.loading = false;
              } else {
                this.zona = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarVendedor(){
    this._vendedoresService.getVendedorPorCodigo(this.forma.controls['idVendedor'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.vData = data;
          auxVendedor = this.vData.dataset.length;
          if(this.vData.returnset[0].RCode=="-6003"){
            //token invalido
            this.vendedor = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarVendedor();
              });
            } else {
              if(this.vData.dataset.length>0){
                this.vendedor = this.vData.dataset[0];
                console.log('vendedor encontrada: ', this.vendedor);
                //this.loading = false;
              } else {
                this.vendedor = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarCobrador(){
    this._vendedoresService.getVendedorPorCodigo(this.forma.controls['idCobrador'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.cData = data;
          auxCobrador = this.cData.dataset.length;
          if(this.cData.returnset[0].RCode=="-6003"){
            //token invalido
            this.cobrador = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCobrador();
              });
            } else {
              if(this.cData.dataset.length>0){
                this.cobrador = this.cData.dataset[0];
                console.log('cobrador encontrada: ', this.cobrador);
                //this.loading = false;
              } else {
                this.cobrador = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarCondComercial(){
    this._condicionComercialService.getCondicionPorID(this.forma.controls['condComercial'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.ccData = data;
          auxCondComercial = this.ccData.dataset.length;
          if(this.ccData.returnset[0].RCode=="-6003"){
            //token invalido
            this.condicionComercial = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCondComercial();
              });
            } else {
              if(this.ccData.dataset.length>0){
                this.condicionComercial = this.ccData.dataset[0];
                console.log('cond comercial encontrada: ', this.condicionComercial);
                //this.loading = false;
              } else {
                this.condicionComercial = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarListaPrecios(){
    console.log('valor de lista de precios al buscar: ', this.forma.controls['idlistaPrecios'].value);
    this._listasPreciosService.getLista(this.forma.controls['idlistaPrecios'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.lpData = data;
          auxListaPrecios = this.lpData.dataset.length;
          if(this.lpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.listaPrecios = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarListaPrecios();
              });
            } else {
              if(this.lpData.dataset.length>0){
                this.listaPrecios = this.lpData.dataset[0];
                console.log('listaPrecios encontrada: ', this.listaPrecios);
                //this.loading = false;
              } else {
                this.listaPrecios = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarPartidaPresupuestaria(){
    this._partidasPresupuestariasService.getPartida(this.forma.controls['idPartidaPresupuestaria'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.ppData = data;
          auxPartidaPresupuestaria = this.ppData.dataset.length;
          if(this.ppData.returnset[0].RCode=="-6003"){
            //token invalido
            this.partidaPresupuestaria = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPartidaPresupuestaria();
              });
            } else {
              if(this.ppData.dataset.length>0){
                this.partidaPresupuestaria = this.ppData.dataset[0];
                console.log('partida encontrada: ', this.partidaPresupuestaria);
                //this.loading = false;
              } else {
                this.partidaPresupuestaria = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarRefContable(){
    this._refContablesService.getRefContable(this.forma.controls['refContable'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.rcData = data;
          auxRefContable = this.rcData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.referenciaContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContable();
              });
            } else {
              if(this.rcData.dataset.length>0){
                this.referenciaContable = this.rcData.dataset[0];
                console.log('referencia encontrada: ', this.referenciaContable);
                console.log('nombre de ref: ', this.referenciaContable.name)
                //this.loading = false;
              } else {
                this.referenciaContable = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarTipoComprobante(){
    console.log('valor de tipo de comprobante al buscar: ', this.forma.controls['idTipoComprobante'].value);

    this._tiposComprobanteService.getTipoComprobante(this.forma.controls['idTipoComprobante'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.tcData = data;
          auxTipoComprobante = this.tcData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tipoComprobante = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTipoComprobante();
              });
            } else {
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset[0];
                console.log('tipo de comp encontrado: ', this.tipoComprobante);
                //this.loading = false;
              } else {
                this.tipoComprobante = null;
                console.log('sin resultados de tipo de comp')
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  buscarArticulo(){
    this._articulosService.getArticulo(this.formaArticulo.controls['artID'].value, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.aData = data;
          auxArticulo = this.aData.dataset.length;
          if(this.aData.returnset[0].RCode=="-6003"){
            //token invalido
            this.articulo = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarArticulo();
              });
            } else {
              if(this.aData.dataset.length>0){
                this.articulo = this.aData.dataset[0];
                console.log('articulo encontrada: ', this.articulo);
                console.log('nombre de ref: ', this.articulo.descripcion)
                //this.loading = false;
              } else {
                this.articulo = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  //validadores
  existeLocalidadFac( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxLocalidadFac==0 ){
            resolve( {noExiste:true} )
          // }else{resolve( null )}
          }else {
            console.log('existe localidad fac salio por false: ', auxLocalidadFac)
            resolve (null)
          }
        },2000 )
      }
    )
    return promesa;
  }
  
  existeLocalidadEnv( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxLocalidadEnv==0 ){
            resolve( {noExiste:true} )
          }else{
            console.log('existe localidad fac salio por false: ', auxLocalidadEnv)
            // resolve( null )
            resolve ({noExiste:false})
          }
        },2000 )
      }
    )
    return promesa;
  }

  existeListaPrecios( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxListaPrecios==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeCondComercial( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxCondComercial==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existePartidaPresupuestaria( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxPartidaPresupuestaria==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeRefContable( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxRefContable==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeTipoComprobante( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxTipoComprobante==0 ){
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
          if( auxArticulo==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }
  
  existeZona( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxZona==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }
  
  existeVendedor( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxVendedor==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }
  
  existeCobrador( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxCobrador==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  abrirConsulta(consulta: string, control: string){
    this.itemDeConsulta = null;
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
      case 'tg01_localidades':
        atributoAUsar = 'cpostal';
        break;
      case 'tg01_categoriasiva':
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
        this.forma.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
        this.itemDeConsulta = respuesta.selection[0];
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

  guardarProveedor(){
    if( this.id == "nuevo" ){
      // insertando
      let auxRid; //viene en la response del primer post

      let jsbody = {
        "p_tipo_referente":	"P", 
        "prov_codigo": this.forma.controls['numero'].value, //Código del campo “Número”
        "p_name": this.forma.controls['razonSocial'].value, //Razón social
        "p_nombre_fantasia_c": this.forma.controls['nombreFantasia'].value, //Nombre de fantasía
        "p_tipo_doc": this.forma.controls['tipoDocumento'].value, //Id de la consulta a la tabla tg01_tipodocumento
        "p_nro_doc": this.forma.controls['nroDocumento'].value,
        "p_fac_calle": this.forma.controls['facCalle'].value,
        "p_fac_ciudad": this.localidadFac.id, //"Lopez", //Id de la consulta dinámica a la tabla tg01_localidades
        "p_fac_prov": this.provinciaFac.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
        "p_fac_cp": this.forma.controls['facCodigoPostal'].value,
        "p_fac_pais": this.paisFac.id, //Id de la consulta dinámica a la tabla tg01_paises
        "p_env_calle": this.forma.controls['envCalle'].value,
        "p_env_ciudad": this.localidadEnv.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_localidades
        "p_env_prov": this.provinciaEnv.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
        "p_env_cp": this.forma.controls['envCodigoPostal'].value,
        "p_env_pais":  this.paisEnv.id, //Id de la consulta dinámica a la tabla tg01_paises
        "p_tel_1": this.forma.controls['telefono1'].value,
        "p_tel_2": this.forma.controls['telefono2'].value,
        "p_tel_3": this.forma.controls['telefono3'].value,
        "p_email": this.forma.controls['email'].value,
        "p_obs": this.forma.controls['observaciones'].value,
        //relaciones comerciales
        "p_categoria": this.forma.controls['catRef'].value, //"1", //id de consulta dinámica a tabla tg01_categoriareferente
        "p_zona": this.forma.controls['idZona'].value, //id de consulta dinámica a tabla tg01_zonas: vacío
        "p_vendedor": this.forma.controls['idVendedor'].value, //id de consulta dinámica a tabla tg01_vendedor
        "p_cobrador": this.forma.controls['idCobrador'].value, //id de consulta dinámica a tabla tg01_vendedor
        "p_lim_cred": this.forma.controls['limiteCredito'].value,
        "p_lista_precio": this.forma.controls['idlistaPrecios'].value, //id de consulta dinámica a tabla tglp_tg_listasprecios
        "p_cond_comercializacion": this.forma.controls['condComercial'].value,  //id de consulta dinámica a tabla tg01_condicioncomercial
        "p_partida_pres_default": this.forma.controls['idPartidaPresupuestaria'].value, //id de consulta dinámica a tabla tg05_partidas_presupuestaria
        "p_ref_contable_default": this.forma.controls['refContable'].value, //id de consulta dinámica a tabla tg01_referenciascontables
        "p_situacion_iva": this.forma.controls['sitIVA'], //"1", //id de consulta dinámica a tabla tg01_categoriasiva
        "p_cuit_c": this.forma.controls['cuit'].value,
        "p_cai"	: this.forma.controls['cai'].value, //CAI
        "p_fecha_vto_cai" : this.forma.controls['fechaVtoCai'].value,
        "p_cuit_exterior" :"",//todo ver qué es, abajo también
        "p_id_impositivo" :"" //id de consulta dinámica a tabla tg01_impuestos
      }
      let jsonbody= JSON.stringify(jsbody);
      console.log('json principal', jsonbody);



      //RELACION COMERCIAL
      let jsbodyRC = {
        "prov_codigo": auxRid, //Rid devuelto en el alta de proveedor
        "p_cbu": this.forma.controls['rcCbu'].value,
        "p_cuentabancaria": this.forma.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": this.forma.controls['rcCodigoSucursal'].value
      }
      let jsonbodyRC= JSON.stringify(jsbodyRC);
      console.log('json relacion', jsonbodyRC);

      //IMPUESTOS
      let jsbodyImp = {
        "Id_Proveedor": auxRid, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_imp_tipo" : this.formaImpuesto.controls['tipo'].value, // id de tabla tg01_impuestos
        "p_imp_modelo" : this.formaImpuesto.controls['modelo'].value, // id de tabla  tg01_modeloimpuestos
        "p_imp_situacion" : this.formaImpuesto.controls['situacion'].value,
        "p_imp_codigo" : this.formaImpuesto.controls['codInscripcion'].value,//"1",
        "p_imp_fecha_insc" : this.formaImpuesto.controls['fechaInscripcion'].value,//"1997-05-05",
        "p_imp_excenciones" : this.formaImpuesto.controls['exenciones'].value,//"false",
        "p_imp_fecha_comienzo_excencion" : this.formaImpuesto.controls['fechaDesde'].value, // → si es true
        "p_imp_fecha_caducidad_excencion" : this.formaImpuesto.controls['fechaHasta'].value,//  → si es true
        "p_imp_obs" :this.formaImpuesto.controls['excencionObs'].value
      }
      let jsonbodyImp = JSON.stringify(jsbodyImp);
      console.log('json impuesto', jsonbodyImp);

      //FORMULARIOS
      let jsbodyForm = {
        "Id_Proveedor": auxRid, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_form_codigo" : this.formaFormulario.controls['codForm'].value,
        "p_form_fecha_pres" : this.formaFormulario.controls['fechaPres'].value,//"1997-05-05",
        "p_form_fecha_vto" : this.formaFormulario.controls['fechaVenc'].value,//"1997-05-05"
      }
      let jsonbodyForm = JSON.stringify(jsbodyForm);
console.log('json form', jsonbodyForm);
      //ARTICULOS
      let jsbodyArticulo = {
        "prov_codigo": auxRid, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_stock_id_art": this.formaArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulos
        "p_stock_fecha_ult_compra": this.formaArticulo.controls['ultimaFecha'].value, //"1997-05-05",
        "p_stock_moneda": this.formaArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
        "p_stock_codigo_barra_prov": this.formaArticulo.controls['barrasArtProv'].value, //Código de barra
        //ultimoPrecio
        //codArtProv
      }
      let jsonbodyArticulo = JSON.stringify(jsbodyArticulo);
      console.log('json form', jsonbodyArticulo);

      //AFIP
      //todo terminar
      let jsbodyAFIP = {
        "prov_codigo": auxRid, //"10029227-fd3e-11e8-9532-d050990fe081", Rid devuelto en el alta de proveedor
        "p_afip_estado":"1", //Campo “Estado según AFIP”
        "p_afip_dom":"1", //Domicilio
        "p_afip_cp":"1", //CP
        "p_afip_loc":"1", //id Localidad 
        "p_afip_id_provincia":"1", //Provincia
        "p_afip_apellido":"", //Apellido
        "p_afip_nombre":"", //Nombre
        "p_afip_razon_social"	:"1", //Razón Social
        "p_afip_tipo_persona":"", //Tipo Persona
        "p_afip_tipo_doc":"", //Tipo documento
        "p_afip_nro_doc":65198 //Documento
        }
      let jsonbodyAFIP = JSON.stringify(jsbodyAFIP);
      console.log('json afip', jsonbodyAFIP);
    }else{
      //actualizando
    }
  }



  /*addImpuesto(){
    this.addingImpuesto = true;
  }*/

  /*addStock(){
    this.addingStock = true;
  }*/

  /*cancelarImpItem(){
    this.addingImpuesto = false;
  }*/

  /*cancelarStockItem(){
    this.addingStock = false;
  }*/

  modificarProveedor(){
    let jsbody = {
      "p_tipo_referente":	"P", 
      "prov_codigo": this.forma.controls['numero'].value, //Código del campo “Número”
      "p_name": this.forma.controls['razonSocial'].value, //Razón social
      "p_nombre_fantasia_c": this.forma.controls['nombreFantasia'].value, //Nombre de fantasía
      "p_tipo_doc": this.forma.controls['tipoDocumento'].value, //Id de la consulta a la tabla tg01_tipodocumento
      "p_nro_doc": this.forma.controls['nroDocumento'].value,
      "p_fac_calle": this.forma.controls['facCalle'].value,
      "p_fac_ciudad": this.localidadFac.id, //"Lopez", //Id de la consulta dinámica a la tabla tg01_localidades
      "p_fac_prov": this.provinciaFac.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
      "p_fac_cp": this.forma.controls['facCodigoPostal'].value,
      "p_fac_pais": this.paisFac.id, //Id de la consulta dinámica a la tabla tg01_paises
      "p_env_calle": this.forma.controls['envCalle'].value,
      "p_env_ciudad": this.localidadEnv.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_localidades
      "p_env_prov": this.provinciaEnv.id, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
      "p_env_cp": this.forma.controls['envCodigoPostal'].value,
      "p_env_pais":  this.paisEnv.id, //Id de la consulta dinámica a la tabla tg01_paises
      "p_tel_1": this.forma.controls['telefono1'].value,
      "p_tel_2": this.forma.controls['telefono2'].value,
      "p_tel_3": this.forma.controls['telefono3'].value,
      "p_email": this.forma.controls['email'].value,
      "p_obs": this.forma.controls['observaciones'].value,
      //relaciones comerciales
      "p_categoria": this.forma.controls['catRef'].value, //"1", //id de consulta dinámica a tabla tg01_categoriareferente
      "p_zona": this.forma.controls['idZona'].value, //id de consulta dinámica a tabla tg01_zonas: vacío
      "p_vendedor": this.forma.controls['idVendedor'].value, //id de consulta dinámica a tabla tg01_vendedor
      "p_cobrador": this.forma.controls['idCobrador'].value, //id de consulta dinámica a tabla tg01_vendedor
      "p_lim_cred": this.forma.controls['limiteCredito'].value,
      "p_lista_precio": this.forma.controls['idlistaPrecios'].value, //id de consulta dinámica a tabla tglp_tg_listasprecios
      "p_cond_comercializacion": this.forma.controls['condComercial'].value,  //id de consulta dinámica a tabla tg01_condicioncomercial
      "p_partida_pres_default": this.forma.controls['idPartidaPresupuestaria'].value, //id de consulta dinámica a tabla tg05_partidas_presupuestaria
      "p_ref_contable_default": this.forma.controls['refContable'].value, //id de consulta dinámica a tabla tg01_referenciascontables
      "p_situacion_iva": this.forma.controls['sitIVA'], //"1", //id de consulta dinámica a tabla tg01_categoriasiva
      "p_cuit_c": this.forma.controls['cuit'].value,
      "p_cai"	: this.forma.controls['cai'].value, //CAI
      "p_fecha_vto_cai" : this.forma.controls['fechaVtoCai'].value,
      "p_cuit_exterior" :"",//todo ver qué es, abajo también
      "p_id_impositivo" :"" //id de consulta dinámica a tabla tg01_impuestos
    }
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
  }

  modificarRelacion(){
    //RELACION COMERCIAL
    let jsbodyRC = {
      "prov_codigo": this.id, //Rid devuelto en el alta de proveedor
      "p_cbu": this.forma.controls['rcCbu'].value,
      "p_cuentabancaria": this.forma.controls['rcCuentaBancaria'].value,
      "p_codigo_sucursal": this.forma.controls['rcCodigoSucursal'].value
    }
    let jsonbodyRC= JSON.stringify(jsbodyRC);
    console.log(jsonbodyRC);
  }

  modificarImpuesto(){
    //IMPUESTOS
    let jsbodyImp = {
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_imp_tipo" : this.formaImpuesto.controls['tipo'].value, // id de tabla tg01_impuestos
      "p_imp_modelo" : this.formaImpuesto.controls['modelo'].value, // id de tabla  tg01_modeloimpuestos
      "p_imp_situacion" : this.formaImpuesto.controls['situacion'].value,
      "p_imp_codigo" : this.formaImpuesto.controls['codInscripcion'].value,//"1",
      "p_imp_fecha_insc" : this.formaImpuesto.controls['fechaInscripcion'].value,//"1997-05-05",
      "p_imp_excenciones" : this.formaImpuesto.controls['exenciones'].value,//"false",
      "p_imp_fecha_comienzo_excencion" : this.formaImpuesto.controls['fechaDesde'].value, // → si es true
      "p_imp_fecha_caducidad_excencion" : this.formaImpuesto.controls['fechaHasta'].value,//  → si es true
      "p_imp_obs" :this.formaImpuesto.controls['excencionObs'].value
    }
    let jsonbodyImp = JSON.stringify(jsbodyImp);
    console.log(jsonbodyImp);
  }

  modificarFormulario(){
    //todo ver si va o no, no está en la docu
    //FORMULARIOS
    let jsbodyForm = {
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_form_codigo" : this.formaFormulario.controls['codForm'].value,
      "p_form_fecha_pres" : this.formaFormulario.controls['fechaPres'].value,//"1997-05-05",
      "p_form_fecha_vto" : this.formaFormulario.controls['fechaVenc'].value,//"1997-05-05"
    }
    let jsonbodyForm = JSON.stringify(jsbodyForm);
    console.log(jsonbodyForm);
  }

  modificarArticulo(){
    //ARTICULOS
    let jsbodyArticulo = {
      "prov_codigo": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_stock_id_art": this.formaArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulos
      "p_stock_fecha_ult_compra": this.formaArticulo.controls['ultimaFecha'].value, //"1997-05-05",
      "p_stock_moneda": this.formaArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
      "p_stock_codigo_barra_prov": this.formaArticulo.controls['barrasArtProv'].value, //Código de barra
      //ultimoPrecio
      //codArtProv
    }
    let jsonbodyArticulo = JSON.stringify(jsbodyArticulo);
    console.log(jsonbodyArticulo);
  }

  modificarAFIP(){
    //AFIP
    //todo terminar
    let jsbodyAFIP = {
      "prov_codigo": this.id, //"10029227-fd3e-11e8-9532-d050990fe081", Rid devuelto en el alta de proveedor
      "p_afip_estado":"1", //Campo “Estado según AFIP”
      "p_afip_dom":"1", //Domicilio
      "p_afip_cp":"1", //CP
      "p_afip_loc":"1", //id Localidad 
      "p_afip_id_provincia":"1", //Provincia
      "p_afip_apellido":"", //Apellido
      "p_afip_nombre":"", //Nombre
      "p_afip_razon_social"	:"1", //Razón Social
      "p_afip_tipo_persona":"", //Tipo Persona
      "p_afip_tipo_doc":"", //Tipo documento
      "p_afip_nro_doc":65198 //Documento
      }
    let jsonbodyAFIP = JSON.stringify(jsbodyAFIP);
    console.log(jsonbodyAFIP);
  }

  //
  eliminarProveedor(){
    let jsbody = {
      "prov_codigo": this.id, 
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteCabecera(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarProveedor();
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Proveedor: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                //todo agregar redirección
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  eliminarRelacion(){
    let jsbody = {
      "prov_codigo": this.id, 
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteRelComercial(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarRelacion();
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Relación Comercial: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Relación Comercial eliminada con exito');
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  eliminarImpuesto(codigo: string){
    let jsbody = {
      "prov_codigo": this.id, 
      "p_imp_codigo": codigo, //id de consulta dinámica a tabla tg01_impuestos
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteImpuesto(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarImpuesto(codigo);
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Impuesto: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Impuesto eliminado con exito');
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  eliminarArticulo(codigo: string){
    let jsbody = {
      "prov_codigo": this.id, 
      "p_stock_id_art": codigo //"078ty2MejUSVC1h2..." id de consulta dinámica a tabla aos_products
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteArticulo(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarArticulo(codigo);
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Articulo: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Articulo eliminado con exito');
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  eliminarAFIP(codigo: string){
    let jsbody = {
      "p_codigo_c": this.id, 
      "p_afip_id" : codigo, //"a714a4d7-ee6d-11e8-ab85-d050990fe081"
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteAFIP(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarAFIP(codigo);
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Articulo: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Articulo eliminado con exito');
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  /*guardarImpuesto(){
    console.log(this.formaImpuesto.controls);
  this.impuestosData.push(this.formaImpuesto.controls);
  this.table.renderRows();
}*/

  /*guardarStock(){
    console.log(this.formaStock.controls);
  this.stockData.push(this.formaStock.controls);
  this.table2.renderRows();
}*/

  /*eliminarStock(ind:number){
    this.stockData.splice(ind, 1);
    this.table2.renderRows();
  };*/

  /*eliminarImpuesto(ind:number){
    this.impuestosData.splice(ind, 1);
    this.table.renderRows();
  };*/

}
