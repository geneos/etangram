import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
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
import { Articulo, cArticulo } from 'src/app/interfaces/articulo.interface';
import { ArticulosService } from 'src/app/services/i2t/articulos.service';
import { Zona } from 'src/app/interfaces/zona.interface';
import { Vendedor } from 'src/app/interfaces/vendedor.interface';
import { ZonasService } from 'src/app/services/i2t/zonas.service';
import { VendedoresService } from 'src/app/services/i2t/vendedores.service';
import { ListasPreciosService } from 'src/app/services/i2t/listas-precios.service';
import { ListaPrecios } from 'src/app/interfaces/lista-precios.interface';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { resolveTimingValue } from '@angular/animations/browser/src/util';
import { identifierName } from '@angular/compiler';
import { ProveedorCabecera, RelacionComercial, Impuesto, Formulario, ArticuloProv } from 'src/app/interfaces/proveedor.interface';
import { CategoriasBloqueoService } from 'src/app/services/i2t/cat-bloqueo.service';
import { FormulariosService } from 'src/app/services/i2t/formularios.service';
import { PartidasPresupuestariasService } from 'src/app/services/i2t/part-presupuestaria.service';
import { isUndefined, isNullOrUndefined } from 'util';

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
  loading: boolean;

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
  idCabecera : string;

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
  provData:any; //respuesta cabecera de proveedor
  cbData:any; //categorias bloqueo
  fData:any; //formularios/documentos

  tiposDocumentoAll:any[];
  catsReferenteAll:any[];
  catIVAAll:any[];
  monedasAll:any[];
  impuestosAll:any[];
  modelosImpAll:any[];
  catsBloqueoAll:any[];
  formulariosAll:any[];

  //datos de FormArray
  cuentasProvAll:RelacionComercial[];
  // estadosCuentas:Map<string,any>;
  estadosCuentas:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  impuestosProvAll:Impuesto[];
  formulariosProvAll:Formulario[];
  articulosProvAll:ArticuloProv[];
  datosAFIP:any;

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
  listaPrecios: ListaPrecios; 
  partidaPresupuestaria: any;
  referenciaContable: RefContable;
  tipoComprobante: TipoComprobante;
  articulo: Articulo;
  carticulo: cArticulo;
  provCabecera: ProveedorCabecera;

  loginData: any;

  constructor(private route:ActivatedRoute, 
              private FormBuilder: FormBuilder,
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
              private _proveedoresService: ProveedoresService,
              private _categoriasBloqueoService: CategoriasBloqueoService,
              private _formulariosService: FormulariosService,
              private _partidasPresupuestariasService: PartidasPresupuestariasService,
              public ngxSmartModalService: NgxSmartModalService,
              public snackBar: MatSnackBar,) 
  {
    this.loading = true;
    this.forma = this.FormBuilder.group({ 
      tipoReferente: new FormControl('',Validators.required),
      numero: new FormControl('',Validators.required),
      razonSocial: new FormControl('',Validators.required),
      nombreFantasia: new FormControl('',Validators.required),
      tipoDocumento: new FormControl('',Validators.required),
      nroDocumento: new FormControl('',Validators.required),
      facCalle: new FormControl('',Validators.required),
      facCiudad: new FormControl('',Validators.required),
      facProvincia: new FormControl('',Validators.required),
      facCodigoPostal: new FormControl('', Validators.required, this.existeLocalidadFac),
      facPais: new FormControl('',Validators.required),
      envCalle: new FormControl(),
      envCiudad: new FormControl(),
      envProvincia: new FormControl(),
      envCodigoPostal: new FormControl(null, [], this.existeLocalidadEnv),
      envPais: new FormControl(),
      telefono1: new FormControl('',Validators.required),
      telefono2: new FormControl(),
      telefono3: new FormControl(),
      email: new FormControl('',Validators.required),
      observaciones: new FormControl(),
      //RELACION COMERCIAL
        //categorias
        catRef: new FormControl('', Validators.required),//requerido al menos en proveedor
        idZona: new FormControl('', [], this.existeZona), 
        zonaDesc: new FormControl(),
        // idVendedor: new FormControl('', [], this.existeVendedor), 
        idVendedor: new FormControl('', [Validators.required], this.existeVendedor), 
        vendedorDesc: new FormControl(),
        idCobrador: new FormControl('', [], this.existeCobrador),
        cobradorDesc: new FormControl(),
        limiteCredito: new FormControl(),
        //parametros
        idlistaPrecios: new FormControl('', [], this.existeListaPrecios),
        condComercial: new FormControl('', [], this.existeCondComercial),
        idPartidaPresupuestaria: new FormControl('', [], this.existePartidaPresupuestaria),
        refContable: new FormControl('', [], this.existeRefContable),
        idTipoComprobante: new FormControl('', [], this.existeTipoComprobante),
          //descripciones de parametros
          descListaPrecios: new FormControl(),
          descCondComercial: new FormControl(),
          descPartidaPresupuestaria: new FormControl(),
          descRefContable: new FormControl(),
          descTipoComprobante: new FormControl(),
        cuentas: this.FormBuilder.array([]),
      catBloq: new FormControl(),
      //IMPUESTOS
      sitIVA: new FormControl(),
      cuit: new FormControl(),
      cai: new FormControl(),
      fechaVtoCai: new FormControl(),
      cuitExterior: new FormControl(),
      idImpositivo: new FormControl(),
        impuestos: this.FormBuilder.array([]),
          //excenciones dentro
        formularios: this.FormBuilder.array([]),
      //STOCK
      articulos: this.FormBuilder.array([]),
      }
    );
    
    /*
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
      'envCodigoPostal': new FormControl(null, [], this.existeLocalidadEnv),
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
        // 'idZona': new FormControl('', this.existeZona), //19/01/02 10:40=> no hay zonas
        'zonaDesc': new FormControl(),
        'idVendedor': new FormControl(),
        // 'idVendedor': new FormControl('', this.existeVendedor), //no hay vendedores
        'vendedorDesc': new FormControl(),
        // 'idCobrador': new FormControl('', this.existeCobrador),
        'idCobrador': new FormControl(),
        'cobradorDesc': new FormControl(),
        'limiteCredito': new FormControl(),
        //parametros
        'idlistaPrecios': new FormControl('', [], this.existeListaPrecios),
        'condComercial': new FormControl('', [], this.existeCondComercial),
        'idPartidaPresupuestaria': new FormControl(),
        // 'idPartidaPresupuestaria': new FormControl('', this.existePartidaPresupuestaria),
        'refContable': new FormControl('', [], this.existeRefContable),
        'idTipoComprobante': new FormControl('', [], this.existeTipoComprobante),
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
 */

    /*
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
      'observaciones': new FormControl('', Validators.required),
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
    */
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
    // this.formaArticulo.controls['artDesc'].disable();

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        /* for( let aux in this.constProveedores ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['numero'].setValue(this.id);
            this.forma.controls['razonSocial'].setValue(this.constProveedores[this.id].razonSocial);
            this.forma.controls['cuit'].setValue(this.constProveedores[this.id].cuit);
            this.forma.controls['posicionFiscal'].setValue(this.constProveedores[this.id].posicionFiscal);
          }
        } */
        this.obtenerProveedor();
      }
    });

    //suscripciones para rellenar datos después 
    //#region suscripciones
    this.forma.controls['facCodigoPostal'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['facCodigoPostal'])  
        console.log('Objeto recibido: ', this.itemDeConsulta) */
        this.elFacCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });

    this.forma.controls['envCodigoPostal'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['envCodigoPostal'])   */
        this.elEnvCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });


    //movido adentro del agregado de items al array ==> movido adentro del buscarArticulo
    // this.formaArticulo.controls['artID'].valueChanges.subscribe(() => {
    //   // console.clear()
    //   setTimeout(() => {
    //     console.log('hubo un cambio')
    //     // console.log('estado después de timeout ',this['articulo'])  
    //     // console.log('Valor de el otro elemento: ', this.forma.controls['razonSocial'].value)
    //     this.elArtID.nativeElement.dispatchEvent(new Event('keyup'));

    //     // this.forma.controls['proveedor'].updateValueAndValidity();
    //     // this.ref.detectChanges();
    //     // this.forma.updateValueAndValidity();
    //     // this.forma.controls['artDeProveedor'].updateValueAndValidity();
    //   })
    //   // console.log('estado fuera de timeout ',this['proveedor'], this.proveedor)
    // });

    //descripciones de datos para relaciones comerciales
    if (this.tipoReferente == 'C'){
      this.forma.controls['idZona'].valueChanges.subscribe(() => {
        setTimeout(() => {
          /* console.log('hubo un cambio')
          console.log('estado después de timeout ',this['zona'])   */
          this.elIDZona.nativeElement.dispatchEvent(new Event('keyup'));
        })
      });
      this.forma.controls['idVendedor'].valueChanges.subscribe(() => {
        setTimeout(() => {
          /* console.log('hubo un cambio')
          console.log('estado después de timeout ',this['vendedor'])   */
          this.elIDVendedor.nativeElement.dispatchEvent(new Event('keyup'));
        })
      });
      this.forma.controls['idCobrador'].valueChanges.subscribe(() => {
        setTimeout(() => {
        /*   console.log('hubo un cambio')
          console.log('estado después de timeout ',this['cobrador'])   */
          this.elIDCobrador.nativeElement.dispatchEvent(new Event('keyup'));
        })
      });
    }
    //descripciones de parametros
    this.forma.controls['condComercial'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['condComercial']) */  
        this.elCondComercial.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idlistaPrecios'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['listaPrecios'])   */
        this.elListaPrecios.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idPartidaPresupuestaria'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['partidaPresupuestaria']) */  
        this.elPartidaPresupuestaria.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['refContable'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['refContable'])  */ 
        this.elRefContable.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['idTipoComprobante'].valueChanges.subscribe(() => {
      setTimeout(() => {
        /* console.log('hubo un cambio')
        console.log('estado después de timeout ',this['tipoComprobante'])  */ 
        this.elTipoComprobante.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    //#endregion suscripciones
  }

  //#region constructoresFormGroups
  construirCuentaBancaria(){
    return new FormGroup({ 
      'rcCbu': new FormControl('', Validators.required),
      'rcTipo': new FormControl('', Validators.required),
      'rcCuentaBancaria': new FormControl('', Validators.required),
      'rcCodigoSucursal': new FormControl('', Validators.required),
      'ID_Relacion_Comercial': new FormControl()
    });
  }
  construirImpuesto(){
    return new FormGroup({
      'impuesto': new FormControl(),
      'tipo': new FormControl('', Validators.required),
      'modelo': new FormControl(),
      'situacion': new FormControl('', Validators.required),
      'codInscripcion': new FormControl('', Validators.required),
      'fechaInscripcion': new FormControl('', Validators.required),
      'observaciones': new FormControl(''),
      'poseeExenciones': new FormControl(false),
      // 'exenciones': new FormArray([])
      'fechaDesde': new FormControl('', Validators.required),
      'fechaHasta': new FormControl('', Validators.required),
    });
  }
  construirFormulario(){
    return new FormGroup({
      'ID_Form_Proveedor': new FormControl(),
      'codForm': new FormControl('', Validators.required),
      'fechaPres': new FormControl('', Validators.required),
      'fechaVenc': new FormControl('', Validators.required),
    });
  }
  /* construirExcencion(){
    return new FormGroup({
      'nroExcencion': new FormControl('', Validators.required),
      'fechaDesde': new FormControl('', Validators.required),
      'fechaHasta': new FormControl('', Validators.required),
      'observaciones': new FormControl('', Validators.required),
    });
  } */
  construirArticulo(){
    let articulo = new FormGroup({
      'artID': new FormControl('', Validators.required, this.existeArticulo),
        'artDesc': new FormControl(),
      'ultimaFecha': new FormControl('', Validators.required),
      'ultimoPrecio': new FormControl(),
      'codArtProv': new FormControl(),
      'barrasArtProv': new FormControl('', Validators.required),
      'moneda': new FormControl('', Validators.required)
    });
    articulo.controls['artDesc'].disable();
    return articulo;
  }
  //#endregion constructoresFormGroups

  ngOnInit() {
    this.buscarTiposDocumento();
    this.buscarCategoriasIVA();
    this.buscarCategoriasRef();
    this.buscarMonedas();
    this.buscarImpuestos();
    this.buscarModelosImp();
    this.buscarCategoriasBloqueo();
    this.buscarFormularios();

    this.tipoReferente = 'P';
    this.forma.controls['tipoReferente'].setValue(this.tipoReferente);
    this.configurarFormulario();
    this.loading = false;
  }

  copiarDireccion(){
    this.forma.controls['envCalle'].setValue(this.forma.controls['facCalle'].value);
    this.forma.controls['envCodigoPostal'].setValue(this.forma.controls['facCodigoPostal'].value);
  }

  //#region botonesEnArrays
  //impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  /* addImpuesto(){
    this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    console.log(this.impuestos)
  }
  deleteImpuesto(ind){this.impuestos.splice(ind, 1);} */

  addImpuesto(){
    // this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    // console.log(this.impuestos)

    const imps = this.forma.controls.impuestos as FormArray;
    imps.push(this.construirImpuesto());
  }
  deleteImpuesto(indice: number){
    const imps = this.forma.controls.impuestos as FormArray;
    imps.removeAt(indice);
  }

  /* addExencion(ind: number){
    // this.impuestos[ind].exenciones.push({'nroExencion':this.impuestos[ind].exenciones.length});
    //for(var i = 0; i < this.impuestos[0].exenciones.length; i++){console.log(this.impuestos[0].exenciones[i]);}
    //console.log(this.impuestos[ind].exenciones)
    console.log(ind, this.forma.controls)
    const impuestos = this.forma.controls.impuestos as FormArray;
    console.log('impuestos: ', impuestos)
    console.log('impuesto ind: ', impuestos.controls[ind])
    console.log('sintaxis rara: ', this.forma.get(['impuestos',ind,'exenciones']));
    console.log('impuesto ind: ', impuestos.controls[ind]['exenciones'])

    console.log('intento de listar exenciones nro 1',
      this.forma.controls.impuestos[ind])
    /* console.log('intento de listar exenciones nro 2',
      this.forma.controls.impuestos[ind].excenciones)
    console.log('intento de listar exenciones nro 3',
      this.forma.controls.impuestos[ind].excenciones.controls)
    console.log('intento de listar exenciones nro 4',
      this.forma.controls.impuestos[ind].excenciones[0].controls) *
    // const exes = this.forma.controls.impuestos[ind].controls.exenciones as FormArray;
    const exes= <FormArray>this.forma.get(['impuestos',ind,'exenciones']);
    console.log('Lista de exenciones para impuesto ', ind, exes.length, exes);
    exes.push(this.construirExcencion());
    console.log('Nueva lista de exenciones para impuesto ', ind, exes.length, exes);
  } */
  // deleteExencion(indi,inde){this.impuestos[indi].exenciones.splice(inde, 1);}
  /* deleteExencion(i: number,j: number){
    console.log('Borrando de la lista de exenciones para impuesto ', i, j);
    // const exes = this.forma.controls.impuestos[i].controls.exenciones as FormArray;
    const exes= <FormArray>this.forma.get(['impuestos',i,'exenciones']);
    console.log('Lista de exenciones para impuesto ', i, exes);
    exes.removeAt(j);
    console.log('Nueva lista de exenciones para impuesto ', i, exes);
  } */

  /* addFormulario(){this.formularios.push({'nroFormulario':(this.formularios.length)});}
  deleteFormulario(ind){this.formularios.splice(ind, 1);} */
  
  addFormulario(){
    const forms= <FormArray>this.forma.get(['formularios']);
    // console.log('Lista de formularios ', forms.length, forms);
    forms.push(this.construirFormulario());
    // console.log('Lista de formularios ', forms.length, forms);
  }
  deleteFormulario(ind: number){
    const forms= <FormArray>this.forma.get(['formularios']);
    // console.log('Lista de formularios ', forms.length, forms);
    forms.removeAt(ind);
    // console.log('Lista de formularios ', forms.length, forms);
  }

/*   addArticulosStock(){this.articulosStock.push({'nroArticulosStock':(this.articulosStock.length)});}
  deleteArticulosStock(ind){this.articulosStock.splice(ind, 1);} */

  addArticulosStock(){
    const arts = this.forma.controls.articulos as FormArray;
    // console.log('arts: ', arts)
    arts.push(this.construirArticulo());


  }
  deleteArticulosStock(indice: number){
    const arts = this.forma.controls.articulos as FormArray;
    arts.removeAt(indice);
  }

  deleteCuentasBanc(indice: number){
    // this.cuentasBanc.splice(ind, 1);
    const ctas = this.forma.controls.cuentas as FormArray;
    // console.log(ctas.controls);
    // console.log(ctas.controls[indice])
    let cta= <FormGroup>ctas.controls[indice];
    // console.log('cuenta: ', cta, <FormGroup>ctas.controls[indice]);
    // console.log(cta.controls['rcCbu'].value)
    // console.log(<FormGroup>ctas.controls[indice])

    // console.log(ctas.controls[indice].controls)
    // this.estadosCuentas.eliminados.push((<FormGroup>ctas[indice]).controls['rcCbu'].value);
    if (cta.controls['ID_Relacion_Comercial'].value != null){
      this.estadosCuentas.eliminados.push(cta.controls['ID_Relacion_Comercial'].value);
    }
    ctas.removeAt(indice);
  }
  addCuentaBanc(){
    // console.log('clickeado agregar cuenta');
    const ctas = this.forma.controls.cuentas as FormArray;
    ctas.push(this.construirCuentaBancaria());      
  }
  //#endregion botonesEnArrays

  //#region datosCombos
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTiposDocumento();
              });
            } else {
              if(this.tdData.dataset.length>0){
                this.tiposDocumentoAll = this.tdData.dataset;
                // console.log('Tipos de documento para lista desp: ', this.tiposDocumentoAll);
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasIVA();
              });
            } else {
              if(this.civaData.dataset.length>0){
                this.catIVAAll = this.civaData.dataset;
                // console.log('Categorias para lista desp: ',this.catIVAAll);
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasRef();
              });
            } else {
              if(this.crefData.dataset.length>0){
                this.catsReferenteAll = this.crefData.dataset;
                // console.log('Cat. de referente para lista desp: ',this.catsReferenteAll);
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
        // console.log(dataM);
          this.mData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mData.returnset[0].RCode=="-6003"){
            //token invalido
            this.monedasAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
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
        // console.log(dataM);
          this.impData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.impData.returnset[0].RCode=="-6003"){
            //token invalido
            this.impuestosAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
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
        // console.log(dataM);
          this.mimpdata = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mimpdata.returnset[0].RCode=="-6003"){
            //token invalido
            this.modelosImpAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._monedaService.login(jsonbody)
              .subscribe( dataL => {
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

  buscarCategoriasBloqueo(){
    // this._categoriasBloqueoService.getCategorias( this.token )
    this._categoriasBloqueoService.getCategoriasDeUnTipo(this.tipoReferente, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.cbData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.cbData.returnset[0].RCode=="-6003"){
            //token invalido
            this.catsBloqueoAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposDocumentoService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasBloqueo();
              });
            } else {
              if(this.cbData.dataset.length>0){
                this.catsBloqueoAll = this.cbData.dataset;
                // console.log('obtenidos bloqueos', this.catsBloqueoAll);
                //this.loading = false;

              } else {
                this.catsBloqueoAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarFormularios(){
    this._formulariosService.getFormularios( this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.fData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.fData.returnset[0].RCode=="-6003"){
            //token invalido
            this.formulariosAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposDocumentoService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarFormularios();
              });
            } else {
              if(this.fData.dataset.length>0){
                this.formulariosAll = this.fData.dataset;
                // console.log('obtenidos formularios', this.formulariosAll);
                //this.loading = false;

              } else {
                this.formulariosAll = null;
              }
            }
      });
  }
  //fin listas desplegables
  //#endregion datosCombos

  //#region autocompletado
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalFac();
              });
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadFac = this.fcpData.dataset[0];
                //this.loading = false;
                // this.buscarProvinciaFac(this.localidadFac.tg01_provincias_id_c, this.token)
                this.buscarProvinciaFac();

              } else {
                this.localidadFac = null;
              }
            }
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCPostalEnv();
              });
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadEnv = this.fcpData.dataset[0];
                //this.loading = false;
                this.buscarProvinciaEnv();

              } else {
                this.localidadEnv = null;
              }
            }
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
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProvinciaFac();
              });
            } else {
              if(this.fpData.dataset.length>0){
                this.provinciaFac = this.fpData.dataset[0];
                //this.loading = false;
                this.buscarPaisFac();

              } else {
                this.provinciaFac = null;
              }
            }
      });
  }

  buscarProvinciaEnv(){
    this._localidadesService.getProvincias(this.localidadEnv.tg01_provincias_id_c, this.token )
      .subscribe( data => {
          this.fpData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.fpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.provinciaEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProvinciaEnv();
              });
            } else {
              if(this.fpData.dataset.length>0){
                this.provinciaEnv = this.fpData.dataset[0];
                //this.loading = false;
                this.buscarPaisEnv();
              } else {
                this.provinciaEnv = null;
              }
            }
      });
  }

  buscarPaisFac(){
    //"e5dc7f36-31ba-acbf-8c72-5ba4042eec36"
    this._localidadesService.getPaises(this.provinciaFac.tg01_paises_id_c, this.token )
      .subscribe( data => {
          this.pData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            this.paisEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPaisFac();
              });
            } else {
              if(this.pData.dataset.length>0){
                this.paisFac = this.pData.dataset[0];
                //this.loading = false;
              } else {
                this.paisFac = null;
              }
            }
      });
  }

  buscarPaisEnv(){
    this._localidadesService.getPaises(this.provinciaEnv.tg01_paises_id_c, this.token )
      .subscribe( data => {
          this.pData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            this.paisEnv = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPaisEnv();
              });
            } else {
              if(this.pData.dataset.length>0){
                this.paisEnv = this.pData.dataset[0];
                //this.loading = false;
              } else {
                this.paisEnv = null;
              }
            }
      });
  }
  
  buscarZona(){
    this._zonasService.getZonaPorIDZona(this.forma.controls['idZona'].value, this.token )
      .subscribe( data => {
          this.zData = data;
          auxZona = this.zData.dataset.length;
          if(this.zData.returnset[0].RCode=="-6003"){
            //token invalido
            this.zona = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarZona();
              });
            } else {
              if(this.zData.dataset.length>0){
                this.zona = this.zData.dataset[0];
                //this.loading = false;
              } else {
                this.zona = null;
              }
            }
      });
  }
  buscarVendedor(){
    this._vendedoresService.getVendedorPorCodigo(this.forma.controls['idVendedor'].value, this.token )
      .subscribe( data => {
          this.vData = data;
          auxVendedor = this.vData.dataset.length;
          if(this.vData.returnset[0].RCode=="-6003"){
            //token invalido
            this.vendedor = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarVendedor();
              });
            } else {
              if(this.vData.dataset.length>0){
                this.vendedor = this.vData.dataset[0];
                //this.loading = false;
              } else {
                this.vendedor = null;
              }
            }
      });
  }
  buscarCobrador(){
    this._vendedoresService.getVendedorPorCodigo(this.forma.controls['idCobrador'].value, this.token )
      .subscribe( data => {
          this.cData = data;
          auxCobrador = this.cData.dataset.length;
          if(this.cData.returnset[0].RCode=="-6003"){
            //token invalido
            this.cobrador = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCobrador();
              });
            } else {
              if(this.cData.dataset.length>0){
                this.cobrador = this.cData.dataset[0];
                //this.loading = false;
              } else {
                this.cobrador = null;
              }
            }
      });
  }

  buscarCondComercial(){
    this._condicionComercialService.getCondicionPorID(this.forma.controls['condComercial'].value, this.token )
      .subscribe( data => {
          this.ccData = data;
          auxCondComercial = this.ccData.dataset.length;
          if(this.ccData.returnset[0].RCode=="-6003"){
            //token invalido
            this.condicionComercial = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCondComercial();
              });
            } else {
              if(this.ccData.dataset.length>0){
                this.condicionComercial = this.ccData.dataset[0];
                //this.loading = false;
              } else {
                this.condicionComercial = null;
              }
            }
      });
  }

  buscarListaPrecios(){
    this._listasPreciosService.getLista(this.forma.controls['idlistaPrecios'].value, this.token )
      .subscribe( data => {
          this.lpData = data;
          auxListaPrecios = this.lpData.dataset.length;
          if(this.lpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.listaPrecios = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarListaPrecios();
              });
            } else {
              if(this.lpData.dataset.length==1){
                this.listaPrecios = this.lpData.dataset[0];
                //this.loading = false;
              } else {
                this.listaPrecios = null;
              }
            }
      });
  }
  buscarPartidaPresupuestaria(){
    this._partidasPresupuestariasService.getPartida(this.forma.controls['idPartidaPresupuestaria'].value, this.token )
      .subscribe( data => {
          this.ppData = data;
          auxPartidaPresupuestaria = this.ppData.dataset.length;
          if(this.ppData.returnset[0].RCode=="-6003"){
            //token invalido
            this.partidaPresupuestaria = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPartidaPresupuestaria();
              });
            } else {
              if(this.ppData.dataset.length>0){
                this.partidaPresupuestaria = this.ppData.dataset[0];
                //this.loading = false;
              } else {
                this.partidaPresupuestaria = null;
              }
            }
      });
  }
  buscarRefContable(){
    this._refContablesService.getRefContable(this.forma.controls['refContable'].value, this.token )
      .subscribe( data => {
          this.rcData = data;
          auxRefContable = this.rcData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.referenciaContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContable();
              });
            } else {
              if(this.rcData.dataset.length==1){
                this.referenciaContable = this.rcData.dataset[0];
                //this.loading = false;
              } else {
                this.referenciaContable = null;
              }
            }
      });
  }
  buscarTipoComprobante(){
    this._tiposComprobanteService.getTipoOperacionPorIdTipoComprobante(this.forma.controls['idTipoComprobante'].value, this.token )
      .subscribe( data => {
          this.tcData = data;
          auxTipoComprobante = this.tcData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tipoComprobante = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTipoComprobante();
              });
            } else {
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset[0];
                //this.loading = false;
              } else {
                this.tipoComprobante = null;
              }
            }
      });
  }
  buscarArticulo(indice: number){
    console.log('llamado buscar articulo para articulo nro ', indice)
    const arts = this.forma.controls.articulos as FormArray;
    let id = arts.controls[indice].value['artID'];
    console.log('buscando item ', id, arts.controls[indice])
    // this._articulosService.getArticulo(this.formaArticulo.controls['artID'].value, this.token )
    // this._articulosService.getArticulo(id , this.token )
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
          this.aData = data;
          auxArticulo = this.aData.dataset.length;
          if(this.aData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.articulo = null;
            this.carticulo = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarArticulo(indice);
              });
            } else {
    console.log('resultado buscar articulo para articulo nro ', this.aData)

              if(this.aData.dataset.length>0){
                // this.articulo = this.aData.dataset[0];
                this.carticulo = this.aData.dataset[0];
                
                //rellenar descripcion
                ((this.forma.controls.articulos as FormArray).
                  controls[indice] as FormGroup).
                    controls['artDesc'].setValue(this.carticulo.name);
                //this.loading = false;
              } else {
                // this.articulo = null;
                this.carticulo = null;
                
                //vaciar descripcion
                ((this.forma.controls.articulos as FormArray).
                  controls[indice] as FormGroup).
                    controls['artDesc'].setValue('');
              }
            }
      });
  }
  //#endregion autocompletado

  //cargar datos en modificacion
  obtenerProveedor(){
    console.log('buscando proveedor con: ', this.id);
    this._proveedoresService.getCabeceraProveedor(this.id , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.provData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.provData.returnset[0].RCode=="-6003"){
            //token invalido
            this.provCabecera = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerProveedor();
              });
            } else {
              if(this.provData.dataset.length>0){
                this.provCabecera = this.provData.dataset[0];
                this.existe = true;
                this.idCabecera = this.id;
                console.log('proveedor encontrado: ', this.provCabecera);

                //mostrar datos
                this.forma.controls['tipoReferente'].setValue(this.provCabecera.tiporeferente);
                this.forma.controls['numero'].setValue(this.provCabecera.codigo_prov);
                  //deshabilitado por [readonly]... en html
                this.forma.controls['razonSocial'].setValue(this.provCabecera.nombre);
                this.forma.controls['nombreFantasia'].setValue(this.provCabecera.nombre_fantasia);
                this.forma.controls['tipoDocumento'].setValue(this.provCabecera.tipo_documento);
                this.forma.controls['nroDocumento'].setValue(this.provCabecera.nro_documento);
                this.forma.controls['facCalle'].setValue(this.provCabecera.direccion_compra);
                this.forma.controls['facCiudad'].setValue(this.provCabecera.ciudad_compra);
                this.forma.controls['facProvincia'].setValue(this.provCabecera.provincia_compra);
                this.forma.controls['facCodigoPostal'].setValue(this.provCabecera.codigopostal_compra);
                this.forma.controls['facPais'].setValue(this.provCabecera.pais_compra);
                this.forma.controls['envCalle'].setValue(this.provCabecera.direccion_envio);
                this.forma.controls['envCiudad'].setValue(this.provCabecera.ciudad_envio);
                this.forma.controls['envProvincia'].setValue(this.provCabecera.provincia_envio);
                this.forma.controls['envCodigoPostal'].setValue(this.provCabecera.codigopostal_envio);
                this.forma.controls['envPais'].setValue(this.provCabecera.pais_envio);
                this.forma.controls['telefono1'].setValue(this.provCabecera.telefono);
                this.forma.controls['telefono2'].setValue(this.provCabecera.telefono_alternativo);
                this.forma.controls['telefono3'].setValue(this.provCabecera.fax);
                this.forma.controls['email'].setValue(this.provCabecera.email);
                this.forma.controls['observaciones'].setValue(this.provCabecera.descripcion);

                this.forma.controls['catRef'].setValue(this.provCabecera.categoriareferente);
                console.log('zona ', this.provCabecera.id_zona);
                if (this.provCabecera.id_zona != null){ 
                  this.forma.controls['idZona'].setValue(this.provCabecera.id_zona);
                }
                this.forma.controls['idVendedor'].setValue(this.provCabecera.id_vendedor);
                this.forma.controls['idCobrador'].setValue(this.provCabecera.id_cobrador);
                this.forma.controls['limiteCredito'].setValue(this.provCabecera.limitecredito);
                //las busquedas no hacen falta porque están las suscripciones
                if (this.provCabecera.listaprecios != null){
                  this.forma.controls['idlistaPrecios'].setValue(this.provCabecera.listaprecios);
                  // this.buscarListaPrecios();
                }
                if (this.provCabecera.condicion_comercial != null){
                  this.forma.controls['condComercial'].setValue(this.provCabecera.condicion_comercial);
                  // this.buscarCondComercial();
                }
                if (this.provCabecera.partidas_presupuestarias != null){
                  this.forma.controls['idPartidaPresupuestaria'].setValue(this.provCabecera.partidas_presupuestarias);
                  // this.buscarPartidaPresupuestaria();
                }
                if (this.provCabecera.referencias_contables != null){
                  this.forma.controls['refContable'].setValue(this.provCabecera.referencias_contables);
                  // this.buscarRefContable();
                }
                //todo ver cómo se guarda
                /* if (this.provCabecera != null){
                  this.forma.controls['idTipoComprobante'].setValue(this.provCabecera.ti);
                  this.busca
                } */
                // todo ver como se  guarda
                // this.forma.controls['catBloq'].setValue(this.provCabecera.);
                
                this.forma.controls['sitIVA'].setValue(this.provCabecera.categoria_iva);
                this.forma.controls['cuit'].setValue(this.provCabecera.cuit);
                this.forma.controls['cai'].setValue(this.provCabecera.cai);
                this.forma.controls['fechaVtoCai'].setValue(this.nuevaFecha(this.provCabecera.fecha_vto_cai));
                console.log('fecha real cai: ', this.provCabecera.fecha_vto_cai);
                this.forma.controls['cuitExterior'].setValue(this.provCabecera.cuit_exterior);
                this.forma.controls['idImpositivo'].setValue(this.provCabecera.idimpositivo);

                this.obtenerDatosArrays();

                //this.loading = false;
              } else {
                this.provCabecera = null;
                this.existe = false;
                console.log('no se encontro el proveedor ' + this.id);
              }

              if (this.existe == false){
                this.forma.disable();
                this.openSnackBar('Proveedor no encontrado');
                /* this.forma.controls['numero'].disable();
                this.forma.controls['razonSocial'].disable();
                this.forma.controls['cuit'].disable();
                this.forma.controls['posicionFiscal'].disable(); */
              }
            }
      });
  }

  obtenerDatosArrays(){
    let jsbodyID = {"Id_Proveedor": this.idCabecera}
    let jsonbodyID = JSON.stringify(jsbodyID);
    this.forma.controls.cuentas.reset();
    this.forma.controls.impuestos.reset();
    this.forma.controls.formularios.reset();
    this.forma.controls.articulos.reset();

    this._proveedoresService.getRelComerciales(jsonbodyID , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.cuentasProvAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerDatosArrays();
              });
          } else {
            console.log('respuesta consulta de cuentas asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.cuentasProvAll = this.respData.dataset;
              let index = 0;
              console.log('cuentas recuperadas: ', this.cuentasProvAll)
              this.cuentasProvAll.forEach(cuenta => {
                console.log('se va a armar el formgroup para: ', cuenta)
                this.addCuentaBanc();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('cuenta: ' ,this.forma.get(['cuentas', index]));
                console.log('cbu: ',(this.forma.get(['cuentas', index])).value['rcCbu']);
                console.log('cbu como formgroup: ', <FormGroup>this.forma.get(['cuentas', index]))
                let cCuenta: FormGroup = <FormGroup>this.forma.get(['cuentas', index]);
                cCuenta.controls['rcCbu'].setValue(cuenta.CBU) ;
                cCuenta.controls['rcCuentaBancaria'].setValue(cuenta.Numero_Cuenta) ;
                cCuenta.controls['rcCodigoSucursal'].setValue(cuenta.Sucursal) ;
                cCuenta.controls['ID_Relacion_Comercial'].setValue(cuenta.ID_Relacion_Comercial) ;
                cCuenta.controls['rcTipo'].setValue(cuenta.Tipo_Cuenta) ;
                index = index +1;
              });
            }

          }
    });

    this._proveedoresService.getImpuestos(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.impuestosProvAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerDatosArrays();
              });
          } else {
            console.log('respuesta consulta de impuestos asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.impuestosProvAll = this.respData.dataset;
              let index = 0;
              console.log('impuestos recuperadas: ', this.impuestosProvAll)
              this.impuestosProvAll.forEach(impuesto => {
                console.log('se va a armar el formgroup para: ', impuesto)
                this.addImpuesto();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('impuesto: ' ,this.forma.get(['impuestos', index]));
                let cImpuesto: FormGroup = <FormGroup>this.forma.get(['impuestos', index]);
                //todo agregar lo que falta cuando esté en la api
                cImpuesto.controls['impuesto'].setValue(impuesto.Impuesto) ;
                cImpuesto.controls['modelo'].setValue(impuesto.ID_Modelo_impuestos) ;
                cImpuesto.controls['situacion'].setValue(impuesto.Situacion) ;
                cImpuesto.controls['codInscripcion'].setValue(impuesto.ID_Impuestos) ;
                cImpuesto.controls['fechaInscripcion'].setValue(this.nuevaFecha(impuesto.Fecha_inscripcion));
                // cImpuesto.controls['observaciones'].setValue(impuesto) ;
                cImpuesto.controls['poseeExenciones'].setValue((impuesto.Exenciones == 1 ? true : false)) ;
                if (impuesto.Exenciones == 1) {
                  cImpuesto.controls['fechaDesde'].setValue(this.nuevaFecha(impuesto.Fecha_Desde_Exenciones));
                  console.log('fecha desde impuesto nro ' + index, impuesto.Fecha_Desde_Exenciones)
                  cImpuesto.controls['fechaHasta'].setValue(this.nuevaFecha(impuesto.Fecha_Hasta_Exenciones));
                  console.log('fecha hasta impuesto nro ' + index, impuesto.Fecha_Hasta_Exenciones)
                }
                
                index = index +1;
              });
            }

          }
    });

    this._proveedoresService.getFormularios(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.formulariosProvAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerDatosArrays();
              });
          } else {
            console.log('respuesta consulta de formulario asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.formulariosProvAll = this.respData.dataset;
              let index = 0;
              console.log('formulario recuperadas: ', this.formulariosProvAll)
              this.formulariosProvAll.forEach(formulario => {
                console.log('se va a armar el formgroup para: ', formulario)
                this.addFormulario();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('impuesto: ' ,this.forma.get(['formularios', index]));
                let cFormulario: FormGroup = <FormGroup>this.forma.get(['formularios', index]);
                //todo agregar lo que falta cuando esté en la api
                cFormulario.controls['ID_Form_Proveedor'].setValue(formulario.ID_Form_Proveedor) ;
                cFormulario.controls['codForm'].setValue(formulario.ID_Formulario) ;
                cFormulario.controls['fechaPres'].setValue(this.nuevaFecha(formulario.Fecha_presentacion));
                console.log('fecha real de impuesto ' + index + '(pres): ', formulario.Fecha_presentacion);
                cFormulario.controls['fechaVenc'].setValue(this.nuevaFecha(formulario.Fecha_vencimiento));
                console.log('fecha real de impuesto ' + index + '(venc): ', formulario.Fecha_vencimiento);
                /* cFormulario.controls[''].setValue(formulario.ID_Form_Proveedor) ;//id proveedor
                cFormulario.controls[''].setValue(formulario.Url) ;
                cFormulario.controls[''].setValue(formulario.Descripcion) ; */
                index = index +1;
              });
            }

          }
    });

    //todo probar cuando lo permita la api
    this._proveedoresService.getArticulos(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.articulosProvAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerDatosArrays();
              });
          } else {
            console.log('respuesta consulta de articulo asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.articulosProvAll = this.respData.dataset;
              let index = 0;
              console.log('articulo recuperadas: ', this.articulosProvAll)
              this.articulosProvAll.forEach(articulo => {
                console.log('se va a armar el formgroup para articulo: ', articulo)
                this.addArticulosStock();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('lista controles articulo: ' ,this.forma.get(['articulos', index]));
                let cArticulo: FormGroup = <FormGroup>this.forma.get(['articulos', index]);
                //todo agregar lo que falta cuando esté en la api
                // cImpuesto.controls['tipo'].setValue(impuesto.) ;
                // cArticulo.controls['artID'].setValue(articulo.id_art);
                //todo verificar funcionamiento de busqueda, cuando funcione la api
                this.buscarArticulo(index);
                // cArticulo.controls['artDesc'].setValue(articulo);
                cArticulo.controls['ultimaFecha'].setValue(this.nuevaFecha(articulo.fecha_ultima_compra));
                // cArticulo.controls['ultimoPrecio'].setValue(articulo.);
                // cArticulo.controls['codArtProv'].setValue(articulo.id_prov);//id de proveedor
                cArticulo.controls['barrasArtProv'].setValue(articulo.codigobarra);
                cArticulo.controls['moneda'].setValue(articulo.id_moneda);
                /* cArticulo.controls[''].setValue(articulo.fecha_creacion);
                cArticulo.controls[''].setValue(articulo.fecha_ult_modificacion);
                cArticulo.controls[''].setValue(articulo.id_usuario_creador);
                cArticulo.controls[''].setValue(articulo.id_usuario_modificador); */

                index = index +1;
              });
            }

          }
    });

    this._proveedoresService.getAFIP(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.datosAFIP = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerDatosArrays();
              });
          } else {
            console.log('respuesta consulta de afip asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.datosAFIP = this.respData.dataset[0];
              let index = 0;
              console.log('afip recuperadas: ', this.datosAFIP);
              // todo completar
              /*
              this.articulosProvAll.forEach(articulo => {
                console.log('se va a armar el formgroup para: ', articulo)
                this.addArticulosStock();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('articulo: ' ,this.forma.get(['impuestos', index]));
                let cArticulo: FormGroup = <FormGroup>this.forma.get(['impuestos', index]);
                //todo agregar lo que falta cuando esté en la api
                // cImpuesto.controls['tipo'].setValue(impuesto.) ;
                cArticulo.controls['artID'].setValue(articulo.id_art);
                //todo verificar funcionamiento de busqueda
                this.buscarArticulo(index);
                // cArticulo.controls['artDesc'].setValue(articulo);
                cArticulo.controls['ultimaFecha'].setValue(articulo.fecha_ultima_compra);
                // cArticulo.controls['ultimoPrecio'].setValue(articulo.);
                // cArticulo.controls['codArtProv'].setValue(articulo.id_prov);//id de proveedor
                cArticulo.controls['barrasArtProv'].setValue(articulo.codigobarra);
                cArticulo.controls['moneda'].setValue(articulo.id_moneda);
                /* cArticulo.controls[''].setValue(articulo.fecha_creacion);
                cArticulo.controls[''].setValue(articulo.fecha_ult_modificacion);
                cArticulo.controls[''].setValue(articulo.id_usuario_creador);
                cArticulo.controls[''].setValue(articulo.id_usuario_modificador); */

                index = index +1;
              // });
            }

          }
    });
  }
  //fin carga de datos
  


  //#region validadores
  existeLocalidadFac( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxLocalidadFac==0 ){
            resolve( {noExiste:true} )
          // }else{resolve( null )}
          }else {
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
            resolve( null )
            // resolve ({noExiste:false})
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

  //#endregion validadores

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
        // "p_lim_cred": this.forma.controls['limiteCredito'].value,
        //debe ser tipo int
        "p_lim_cred": Math.trunc(this.forma.controls['limiteCredito'].value),
        "p_lista_precio": this.forma.controls['idlistaPrecios'].value, //id de consulta dinámica a tabla tglp_tg_listasprecios
        "p_cond_comercializacion": this.forma.controls['condComercial'].value,  //id de consulta dinámica a tabla tg01_condicioncomercial
        "p_partida_pres_default": this.forma.controls['idPartidaPresupuestaria'].value, //id de consulta dinámica a tabla tg05_partidas_presupuestaria
        "p_ref_contable_default": this.forma.controls['refContable'].value, //id de consulta dinámica a tabla tg01_referenciascontables
        "p_situacion_iva": this.forma.controls['sitIVA'].value, //"1", //id de consulta dinámica a tabla tg01_categoriasiva
        "p_cuit_c": this.forma.controls['cuit'].value,
        "p_cai"	: this.forma.controls['cai'].value, //CAI
        "p_fecha_vto_cai" : this.extraerFecha(<FormControl>this.forma.controls['fechaVtoCai']),//this.forma.controls['fechaVtoCai'].value,
        "p_cuit_exterior" : this.forma.controls['cuitExterior'].value,
        "p_id_impositivo" : this.forma.controls['idImpositivo'].value //id de consulta dinámica a tabla tg01_impuestos
      }
      console.log(jsbody);
      let jsonbody= JSON.stringify(jsbody);

      console.log('json principal', jsonbody);
      this._proveedoresService.postCabecera(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarProveedor();
              });
            } else {
              console.log(this.respData)
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Proveedor: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Cabecera de proveedor guardada con exito, continuando.');
                this.idCabecera = this.respData.returnset[0].RId;
                console.log('ID de proveedor recibido: ' + this.idCabecera);
                this.guardarDatosProveedor(this.respData.returnset[0].RId);
                // this.openSnackBar('Proveedor guardado con exito, redireccionando.');

                //todo agregar redirección
              }
            }
            //console.log(this.refContablesAll);
      });
    }
    else{
      this.actualizarDatos();
    }
  }

  guardarDatosProveedor(idProveedor: string){
    //RELACION COMERCIAL
    (<FormArray>this.forma.controls.cuentas).controls.forEach( cuenta => {
       
      console.log(cuenta);
      let cuentaActual: FormGroup = <FormGroup>cuenta;
      /* console.log(cuentaActual.controls['rcCbu'].value, 
                  cuentaActual.controls['rcCuentaBancaria'].value, 
                  cuentaActual.controls['rcCodigoSucursal'].value); */

      /* let jsbodyRC = {
        "Id_Proveedor": idProveedor, //Rid devuelto en el alta de proveedor
        "p_cbu": cuentaActual.controls['rcCbu'].value, //this.forma.controls['rcCbu'].value,
        "p_cuentabancaria": cuentaActual.controls['rcCuentaBancaria'].value, //this.forma.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": cuentaActual.controls['rcCodigoSucursal'].value //this.forma.controls['rcCodigoSucursal'].value
      }
      let jsonbodyRC= JSON.stringify(jsbodyRC); */
      let jsonbodyRC= this.armarJSONRelacionComercial(cuentaActual); 

      console.log('json relacion', jsonbodyRC);

      this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta postrelcomercial: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido posteando relacion comercial')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Relación Comercial: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Relacion Comercial ID: ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
    });// fin foreach relación comercial

    
    //IMPUESTOS
    (<FormArray>this.forma.controls.impuestos).controls.forEach( impuesto => {
      let impuestoActual: FormGroup = <FormGroup>impuesto;

      let auxDesde, auxHasta, auxInsc;
      /* if (impuestoActual.controls['fechaDesde'].value != null){
        let ano = impuestoActual.controls['fechaDesde'].value.getFullYear().toString();
        let mes = (impuestoActual.controls['fechaDesde'].value.getMonth()+1).toString();
        if(mes.length==1){mes="0"+mes};
        let dia = impuestoActual.controls['fechaDesde'].value.getDate().toString();
        if(dia.length==1){dia="0"+dia};
        auxDesde = ano+"-"+mes+"-"+dia;
      }
      if (impuestoActual.controls['fechaHasta'].value != null){
        let ano = impuestoActual.controls['fechaHasta'].value.getFullYear().toString();
        let mes = (impuestoActual.controls['fechaHasta'].value.getMonth()+1).toString();
        if(mes.length==1){mes="0"+mes};
        let dia = impuestoActual.controls['fechaHasta'].value.getDate().toString();
        if(dia.length==1){dia="0"+dia};
        auxHasta = ano+"-"+mes+"-"+dia;
      } */
      auxDesde = this.extraerFecha(<FormControl>impuestoActual.controls['fechaDesde']);
      auxHasta = this.extraerFecha(<FormControl>impuestoActual.controls['fechaHasta']);
      auxInsc  = this.extraerFecha(<FormControl>impuestoActual.controls['fechaInscripcion']);

      let jsbodyImp = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        // "p_imp_tipo" : impuestoActual.controls['tipo'].value, // id de tabla tg01_impuestos
        // "p_imp_tipo" : impuestoActual.controls['tipo'].value, // id de tabla tg01_impuestos //todo ver porque lo quitaron
        "p_imp_modelo" : impuestoActual.controls['modelo'].value, // id de tabla  tg01_modeloimpuestos
        "p_imp_situacion" : impuestoActual.controls['situacion'].value,
        "p_imp_codigo" : impuestoActual.controls['codInscripcion'].value,//"1",
        "p_imp_fecha_insc" : auxInsc, //impuestoActual.controls['fechaInscripcion'].value,//"1997-05-05",
        "p_imp_excenciones" : impuestoActual.controls['poseeExenciones'].value.toString(),//"false",
        // "p_imp_fecha_comienzo_excencion" : "",//impuestoActual.controls['fechaDesde'].value, // → si es true
        "p_imp_fecha_comienzo_excencion": (impuestoActual.controls['poseeExenciones'].value == true ? auxDesde : ""),
        // "p_imp_fecha_caducidad_excencion" : "",//impuestoActual.controls['fechaHasta'].value,//  → si es true
        "p_imp_fecha_caducidad_excencion": (impuestoActual.controls['poseeExenciones'].value == true ? auxHasta : ""),
        "p_imp_obs" :impuestoActual.controls['observaciones'].value
      }
      let jsonbodyImp = JSON.stringify(jsbodyImp);
      console.log('json impuesto', jsonbodyImp);

      this._proveedoresService.postImpuesto(jsonbodyImp, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta postimpuesto: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido posteando impuesto')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Impuesto: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Impuesto ID: ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
    });// fin foreach impuestos
    
    //FORMULARIOS
    (<FormArray>this.forma.controls.formularios).controls.forEach( formulario => {
      let formularioActual: FormGroup = <FormGroup>formulario;

      let jsbodyForm = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_form_codigo" : formularioActual.controls['codForm'].value,
        "p_form_fecha_pres" : this.extraerFecha(<FormControl>formularioActual.controls['fechaPres']),//"1997-05-05",
        "p_form_fecha_vto" : this.extraerFecha(<FormControl>formularioActual.controls['fechaVenc']),//"1997-05-05"
        /* "p_form_fecha_pres" : formularioActual.controls['fechaPres'].value,//"1997-05-05",
        "p_form_fecha_vto" : formularioActual.controls['fechaVenc'].value,//"1997-05-05" */
      }
      let jsonbodyForm = JSON.stringify(jsbodyForm);
      console.log('json form', jsonbodyForm);

      this._proveedoresService.postFormulario(jsonbodyForm, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta postformulario: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido posteando formulario')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Formulario: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Formulario ID: ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
    });// fin foreach formularios

    //ARTICULOS
    (<FormArray>this.forma.controls.articulos).controls.forEach( articulo => {
      let articuloActual: FormGroup = <FormGroup>articulo;

      let jsbodyArticulo = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_stock_id_art": articuloActual.controls['artID'].value, //id de consulta dinámica a tabla articulos
        "p_stock_fecha_ult_compra": this.extraerFecha(<FormControl>articuloActual.controls['ultimaFecha']), //"1997-05-05",
        "p_stock_moneda": articuloActual.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
        "p_stock_codigo_barra_prov": articuloActual.controls['barrasArtProv'].value, //Código de barra
        //ultimoPrecio
        //codArtProv
      }
      let jsonbodyArticulo = JSON.stringify(jsbodyArticulo);
      console.log('json articulo', jsonbodyArticulo);

      this._proveedoresService.postArticulo(jsonbodyArticulo, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta postarticulo: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido posteando articulo')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Articulo: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Articulo ID: ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
    });// fin foreach articulos

    //AFIP
    //todo terminar
    let jsbodyAFIP = {
      "Id_Proveedor": idProveedor, //"10029227-fd3e-11e8-9532-d050990fe081", Rid devuelto en el alta de proveedor
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

    this._proveedoresService.postImpuesto(jsonbodyAFIP, this.token )
      .subscribe( data => {
        //console.log(dataRC);
        this.respData = data;
        console.log('respuesta postafip: ', this.respData);
        // auxProvData = this.proveedorData.dataset.length;
        if(this.respData.returnset[0].RCode=="-6003"){
          //token invalido
          /* let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._localidadesService.login(jsonbody)
            .subscribe( dataL => {
              
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              // this.eliminarProveedor();
              this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
            }); */
            this.openSnackBar('Token invalido posteando afip')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al guardar Datos de AFIP: ' + this.respData.returnset[0].RTxt);
            }
            else{
              // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
              console.log('AFIP ID: ' + this.respData.returnset[0].RId);
            }
          }
          //console.log(this.refContablesAll);
    });
    
    
    /* else{
      //actualizando
    } */
    
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

  actualizarDatos(){
    // this.modificarProveedor();
    this.guardarRelComerciales();
  }

  modificarProveedor(){
    console.log('preparando json para update proveedor')
    let jsbody = {
      "Id_Proveedor": this.id,
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
      "p_lim_cred": Math.trunc(this.forma.controls['limiteCredito'].value),
      "p_lista_precio": this.forma.controls['idlistaPrecios'].value, //id de consulta dinámica a tabla tglp_tg_listasprecios
      "p_cond_comercializacion": this.forma.controls['condComercial'].value,  //id de consulta dinámica a tabla tg01_condicioncomercial
      "p_partida_pres_default": this.forma.controls['idPartidaPresupuestaria'].value, //id de consulta dinámica a tabla tg05_partidas_presupuestaria
      "p_ref_contable_default": this.forma.controls['refContable'].value, //id de consulta dinámica a tabla tg01_referenciascontables
      "p_situacion_iva": this.forma.controls['sitIVA'].value, //"1", //id de consulta dinámica a tabla tg01_categoriasiva
      "p_cuit_c": this.forma.controls['cuit'].value,
      "p_cai"	: this.forma.controls['cai'].value, //CAI
      "p_fecha_vto_cai" : this.extraerFecha(<FormControl>this.forma.controls['fechaVtoCai']),
      "p_cuit_exterior" :this.forma.controls['cuitExterior'].value,
      "p_id_impositivo" :this.forma.controls['idImpositivo'].value //id de consulta dinámica a tabla tg01_impuestos
    }
    console.log('cabecera antes de stringify: ', jsbody)
    let jsonbody= JSON.stringify(jsbody);
    console.log('json para update de cabecera: ', jsonbody);

    this._proveedoresService.updateCabecera(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._proveedoresService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.modificarProveedor();
              });
            } else {
              console.log('Respuesta de update cabecera: ', this.respData)
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Proveedor: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Cabecera de proveedor actualizada con exito, continuando.');
                // this.idCabecera = this.respData.returnset[0].RId;
                // console.log('ID de proveedor recibido: ' + this.idCabecera);
                // this.guardarDatosProveedor(this.respData.returnset[0].RId);
                // this.openSnackBar('Proveedor guardado con exito, redireccionando.');

                //todo agregar redirección
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  guardarRelComerciales(){
    //separar en nuevos y modificados 
    /* this.estadosCuentas = {nuevos: [],
      modificados: [],
      eliminados: []}; */

    this.estadosCuentas.nuevos = [];
    this.estadosCuentas.modificados = [];

    let listaCuentas = <FormArray>this.forma.get(['cuentas']);
    // console.log('estado de la lista de cuentas: ', listaCuentas.dirty);
    (listaCuentas.controls).forEach(element => {
      let cuenta = <FormGroup>element;
      // console.log('cuenta ', cuenta);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (cuenta.dirty){
        //si tiene id es modificación
        if (cuenta.controls['ID_Relacion_Comercial'].value != null){
          this.estadosCuentas.modificados.push(cuenta);
        }
        else{
          this.estadosCuentas.nuevos.push(cuenta);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    this.estadosCuentas.nuevos.forEach(formCuenta => {
      // this.modificarRelacion(formCuenta);
      console.log('se agregará cuenta: ', formCuenta);
      this.guardarRelacion(formCuenta);
    });

    this.estadosCuentas.modificados.forEach(formCuenta => {
      this.modificarRelacion(formCuenta);
    });

    //cuentas a eliminar
    // console.log('lista de cuentas a eliminar: ');
    this.estadosCuentas.eliminados.forEach(cuentaEliminada => {
      // console.log(
      //   this.cuentasProvAll.find(cuentaBuscada => cuentaBuscada.CBU == cuentaEliminada).ID_Relacion_Comercial
      // );
      this.eliminarRelacion(cuentaEliminada);
    });

    //reiniciar listas
    this.estadosCuentas ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  armarJSONRelacionComercial(cuenta: any){
    let formGroupCuenta = <FormGroup>cuenta;
    let jsonbodyRC, jsbodyRC;
    console.log('control de cuenta a usar: ', formGroupCuenta)
    if (formGroupCuenta.controls['ID_Relacion_Comercial'].value == null){
      jsbodyRC = {
        "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor
        // "Id_RelComercial": formGroupCuenta.controls['ID_Relacion_Comercial'].value,
        "p_cbu": formGroupCuenta.controls['rcCbu'].value,
        "p_cuentabancaria": formGroupCuenta.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": formGroupCuenta.controls['rcCodigoSucursal'].value,
        "p_tipo_cuenta": formGroupCuenta.controls['rcTipo'].value,
      }
    }
    else{
      jsbodyRC = {
        "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor
        "Id_RelComercial": formGroupCuenta.controls['ID_Relacion_Comercial'].value,
        "p_cbu": formGroupCuenta.controls['rcCbu'].value,
        "p_cuentabancaria": formGroupCuenta.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": formGroupCuenta.controls['rcCodigoSucursal'].value,
        "p_tipo_cuenta": formGroupCuenta.controls['rcTipo'].value,
      }
    }
    
    jsonbodyRC= JSON.stringify(jsbodyRC);
    return jsonbodyRC;
  }

  armarJSONArticulo(articulo: any){
    let jsbodyArticulo = {
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_stock_id_art": this.formaArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulos
      "p_stock_fecha_ult_compra": this.formaArticulo.controls['ultimaFecha'].value, //"1997-05-05",
      "p_stock_moneda": this.formaArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
      "p_stock_codigo_barra_prov": this.formaArticulo.controls['barrasArtProv'].value, //Código de barra
      //ultimoPrecio
      //codArtProv
    }
    let jsonbodyArticulo = JSON.stringify(jsbodyArticulo);
  }

  guardarRelacion(cuenta: any){
    //RELACION COMERCIAL

    /* let jsbodyRC = {
      "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor
      "p_cbu": this.forma.controls['rcCbu'].value,
      "p_cuentabancaria": this.forma.controls['rcCuentaBancaria'].value,
      "p_codigo_sucursal": this.forma.controls['rcCodigoSucursal'].value
    }
    let jsonbodyRC= JSON.stringify(jsbodyRC); */
    let jsonbodyRC = this.armarJSONRelacionComercial(cuenta);
    console.log('body modificacion de relacion: ', jsonbodyRC);

    this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta insert relacion: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido insertando relacion comercial')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al agregar Relación Comercial: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Relacion Comercial ID (insert): ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  modificarRelacion(cuenta: any){
    //RELACION COMERCIAL

    /* let jsbodyRC = {
      "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor
      "p_cbu": this.forma.controls['rcCbu'].value,
      "p_cuentabancaria": this.forma.controls['rcCuentaBancaria'].value,
      "p_codigo_sucursal": this.forma.controls['rcCodigoSucursal'].value
    }
    let jsonbodyRC= JSON.stringify(jsbodyRC); */
    let jsonbodyRC = this.armarJSONRelacionComercial(cuenta);
    console.log('body modificacion de relacion: ', jsonbodyRC);

    this._proveedoresService.updateRelComercial(jsonbodyRC, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta update relacion: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            /* let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                // this.eliminarProveedor();
                this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
              }); */
              this.openSnackBar('Token invalido updateando relacion comercial')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al actualizar Relación Comercial: ' + this.respData.returnset[0].RTxt);
              }
              else{
                // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
                console.log('Relacion Comercial ID (update): ' + this.respData.returnset[0].RId);
              }
            }
            //console.log(this.refContablesAll);
      });
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
      "p_imp_excenciones" : this.formaImpuesto.controls['exenciones'].value.toString(),//"false",
      "p_imp_fecha_comienzo_excencion" : this.formaImpuesto.controls['fechaDesde'].value, // → si es true
      "p_imp_fecha_caducidad_excencion" : this.formaImpuesto.controls['fechaHasta'].value,//  → si es true
      "p_imp_obs" :this.formaImpuesto.controls['observaciones'].value
    }
    let jsonbodyImp = JSON.stringify(jsbodyImp);
    console.log(jsonbodyImp);
  }

  modificarFormulario(){
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
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
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
      "Id_Proveedor": this.id, //"10029227-fd3e-11e8-9532-d050990fe081", Rid devuelto en el alta de proveedor
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

  eliminarRelacion(idRelacion: string){
    let jsbody = {
      // "prov_codigo": this.id, 
      "Id_Proveedor": this.id, 
      "Id_RelComercial": idRelacion
      }
    let jsonbody = JSON.stringify(jsbody);
    console.log('json para eliminar relacion: ', jsonbody);
    this._proveedoresService.deleteRelComercial(jsonbody, this.token )
      .subscribe( data => {
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.eliminarRelacion(idRelacion);
              });
            } else {
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al eliminar Relación Comercial: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Relación Comercial eliminada con exito');
              }
            }
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
  extraerFecha(control: FormControl){
    let auxFecha: string;
    if (control.value != null){
      let ano = control.value.getFullYear().toString();
      let mes = (control.value.getMonth()+1).toString();
      if(mes.length==1){mes="0"+mes};
      let dia = control.value.getDate().toString();
      if(dia.length==1){dia="0"+dia};
      auxFecha = ano+"-"+mes+"-"+dia;
      return auxFecha;
    }
    else{
      return null;
    }
  }

  testValidez(){
    this.estadosCuentas = {nuevos: [],
      modificados: [],
      eliminados: []};
    //ver validez de todos los controles
    /* for (const field in this.forma.controls) { // 'field' is a string

      const control = this.forma.get(field); // 'control' is a FormControl
      console.log('Control: ' + field, control.status, control.valid, control.enabled, control.value)
    } */

    let listaCuentas = <FormArray>this.forma.get(['cuentas']);
    console.log('estado de la lista de cuentas: ', listaCuentas.dirty);
    (listaCuentas.controls).forEach(element => {
      let cuenta = <FormGroup>element;
      console.log('cuenta ', cuenta);
      console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (cuenta.dirty){
        //si tiene id es modificación
        if (cuenta.controls['ID_Relacion_Comercial'].value != null){
          this.estadosCuentas.modificados.push(cuenta);
        }
        else{
          this.estadosCuentas.nuevos.push(cuenta);
        }
      }
      else{
        //nada porque no fue tocado
        
      }
    });
    console.log('lista de cuentas desde api: ', this.cuentasProvAll);
    console.log('Estado de las cuentas: ', this.estadosCuentas);

    //cuentas a eliminar
    console.log('lista de cuentas a eliminar: ');
    this.estadosCuentas.eliminados.forEach(cuentaEliminada => {
      console.log(
        this.cuentasProvAll.find(cuentaBuscada => cuentaBuscada.CBU == cuentaEliminada).ID_Relacion_Comercial
      );
    });
    


    //todo ver si es necesario revisar que no haya eliminados en la lista de modificados
  }

  nuevaFecha(dateString: string){
    //agregado 1 día a la fecha para que se muestre correctamente en el datepicker
    let fecha = new Date(dateString);
    fecha.setDate(fecha.getDate() +1);
    return fecha;
  }

  configurarFormulario(){
    //deshabilitado de controles para que no quede como invalid el FormGroup
    switch (this.tipoReferente) {
      case 'C':
        this.forma.controls['cai'].disable();
        this.forma.controls['fechaVtoCai'].disable();
        //todo ver que pasa con excenciones
        //formularios, articulos: innecesario, vacío es válido
        break;
      case 'P':
        this.forma.controls['cuitExterior'].disable();
        this.forma.controls['idImpositivo'].disable();
        this.forma.controls['idZona'].disable();
        this.forma.controls['zonaDesc'].disable();
        this.forma.controls['idVendedor'].disable();
        this.forma.controls['vendedorDesc'].disable();
        this.forma.controls['idCobrador'].disable();
        this.forma.controls['cobradorDesc'].disable();
        this.forma.controls['limiteCredito'].disable();
        break;
      default:
        break;
    }
  }
}
