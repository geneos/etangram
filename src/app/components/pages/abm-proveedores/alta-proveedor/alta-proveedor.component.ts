import { Component, OnInit, ViewChild, ViewChildren, Inject, Injectable} from '@angular/core';
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
import { TipoComprobante, TipoComprobanteCompras } from 'src/app/interfaces/tipo-comprobante.interface';
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
import { ImageService } from "src/app/services/i2t/image.service";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

const PROVEEDORES:any[] = [
  {'numero':0,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':1,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':2,'razonSocial':'Lunix S.R.L.','cuit':'30-987654321-0','posicionFiscal':'IVA Responsable Inscripto'},
];

var auxLocalidadFac,auxLocalidadEnv,auxArticulo,auxZona,auxVendedor,auxCobrador,auxFormCod,
    auxListaPrecios,auxCondComercial,auxPartidaPresupuestaria,auxRefContable,auxTipoComprobante: any;

  @Injectable()

@Component({
  selector: 'app-alta-proveedor',
  templateUrl: './alta-proveedor.component.html',
  styleUrls: ['./alta-proveedor.component.css']
})
export class AltaProveedorComponent implements OnInit {

  fechaActual: Date = new Date();
  fechaVenci: Date = new Date();

  urlImagen:string = '';
  adjunto: any;
  token: string;
  loading: boolean;
  partesACargar: number = 8; //listas desplegables: 8
  partesCargadas: number;

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
  formTipo: any;
  formData: formDatos[] = [];

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
  
  respCuit: any;
  
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
    // filtrosObligatoriosCondCom: {obligatorios: [{atributo: string, valor: any}], porDefecto: [{atributo: string, valor: any}]};
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

  //#region Formarray
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
  estadosImpuestos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};

  formulariosProvAll:Formulario[];
  estadosFormularios:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  
  articulosProvAll:ArticuloProv[];
  estadosArticulos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  
  datosAFIP:any;
  //#endregion FormArray

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
  // tipoComprobante: TipoComprobante;
  tipoComprobante: TipoComprobanteCompras;
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
              private _imageService: ImageService,
              private _partidasPresupuestariasService: PartidasPresupuestariasService,
              public ngxSmartModalService: NgxSmartModalService,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              private router: Router,
              public snackBar: MatSnackBar,) 
  {
    console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem(TOKEN);

    this.loading = true;
    this.partesCargadas = 0;

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
        idVendedor: new FormControl('', [], this.existeVendedor), 
        // idVendedor: new FormControl('', [Validators.required], this.existeVendedor), 
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
      estado:  new FormControl(),       
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
    this.forma.controls['envCodigoPostal'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['provinciaEnv'])  
        this.elEnvCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
    this.forma.controls['facCodigoPostal'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['provinciaFac'])  
        this.elFacCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });
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
      'url': new FormControl(),
      'descripcion': new FormControl(),
      // 'Id_FormularioCte': new FormControl(),
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
      'moneda': new FormControl('', Validators.required),
      'fecha_creacion': new FormControl(),
      'fecha_ult_modificacion': new FormControl(),
      'id_usuario_creador': new FormControl(),
      'id_usuario_modificador': new FormControl(),
    });
    articulo.controls['artDesc'].disable();
    return articulo;
  }
  //#endregion constructoresFormGroups

  ngOnInit() {
    this.tipoReferente = 'P';
    /* this.buscarTiposDocumento();
    this.buscarCategoriasIVA();
    this.buscarCategoriasRef();
    this.buscarMonedas();
    this.buscarImpuestos();
    this.buscarModelosImp();
    this.buscarCategoriasBloqueo();
    this.buscarFormularios(); */

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
    let imp = <FormGroup>imps.controls[indice];
    if (imp.controls['impuesto'].value != null){
      // this.estadosImpuestos.eliminados.push(imp.controls['impuesto'].value);
      this.estadosImpuestos.eliminados.push({tipo: imp.controls['tipo'].value, modelo: imp.controls['modelo'].value });
      this.forma.markAsDirty();
    }
    imps.removeAt(indice);
    console.log('lista de impuestos eliminados: ', this.estadosImpuestos.eliminados)
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
    let formABorrar = (<FormGroup>forms.controls[ind]);
    if (formABorrar.controls['ID_Form_Proveedor'].value != null){
      this.estadosFormularios.eliminados.push(formABorrar.controls['ID_Form_Proveedor'].value);
      this.forma.markAsDirty();
    }
    forms.removeAt(ind);
    // console.log('Lista de formularios ', forms.length, forms);
    console.log('lista de forms eliminados: ', this.estadosFormularios.eliminados)
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
    let art = <FormGroup>arts.controls[indice];
    if (art.controls['fecha_creacion'].value != null){
      this.estadosArticulos.eliminados.push(art.controls['artID'].value);
      this.forma.markAsDirty();
    }
    arts.removeAt(indice);
    console.log('lista de articulos eliminados: ', this.estadosArticulos.eliminados);
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
      this.forma.markAsDirty();
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
        console.log('Datos recibidos de buscar tipo documento: ', data);
          this.tdData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.tdData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tiposDocumentoAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.tdData.dataset.length>0){
                this.tiposDocumentoAll = this.tdData.dataset;
                // console.log('Tipos de documento para lista desp: ', this.tiposDocumentoAll);
                //this.loading = false;
                this.partesCargadas = this.partesCargadas +1;

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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.civaData.dataset.length>0){
                this.catIVAAll = this.civaData.dataset;
                // console.log('Categorias para lista desp: ',this.catIVAAll);
                //this.loading = false;
                this.partesCargadas = this.partesCargadas +1;

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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.crefData.dataset.length>0){
                this.catsReferenteAll = this.crefData.dataset;
                // console.log('Cat. de referente para lista desp: ',this.catsReferenteAll);
                //this.loading = false;
                this.partesCargadas = this.partesCargadas +1;

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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.mData.dataset.length>0){
                this.monedasAll = this.mData.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
                this.partesCargadas = this.partesCargadas +1;
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.impData.dataset.length>0){
                this.impuestosAll = this.impData.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
                this.partesCargadas = this.partesCargadas +1;
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.mimpdata.dataset.length>0){
                this.modelosImpAll = this.mimpdata.dataset;
                // this.forma.controls['moneda'].setValue(this.moneda.name);
                this.partesCargadas = this.partesCargadas +1;
              }
              else{
                this.modelosImpAll = null;
              }
            }

      });
  }

  buscarCategoriasBloqueo(){
    // this._categoriasBloqueoService.getCategorias( this.token )
    console.log('buscando categorias con ', this.tipoReferente);
    this._categoriasBloqueoService.getCategoriasDeUnTipo(this.tipoReferente, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.cbData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.cbData.returnset[0].RCode=="-6003"){
            //token invalido
            this.catsBloqueoAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.cbData.dataset.length>0){
                this.catsBloqueoAll = this.cbData.dataset;
                // console.log('obtenidos bloqueos', this.catsBloqueoAll);
                //this.loading = false;
                this.partesCargadas = this.partesCargadas +1;

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
        console.log('NOMBRES FORMULARIOS: ',data);
          this.fData = data;
          
          //auxProvData = this.proveedorData.dataset.length;
          if(this.fData.returnset[0].RCode=="-6003"){
            //token invalido
            this.formulariosAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.fData.dataset.length>0){
                this.formulariosAll = this.fData.dataset;
                // console.log('obtenidos formularios', this.formulariosAll);
                //this.loading = false;
                this.partesCargadas = this.partesCargadas +1;
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadFac = this.fcpData.dataset[0];
                this.forma.controls['facCiudad'].setValue(this.localidadFac.name)
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.fcpData.dataset.length>0){
                this.localidadEnv = this.fcpData.dataset[0];
                //this.loading = false;
                this.forma.controls['envCiudad'].setValue(this.localidadEnv.name) 
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
    // this._condicionComercialService.getCondicionPorID(this.forma.controls['condComercial'].value, this.token )
    // cambiado por sólo los válidos, con origen COM
    this._condicionComercialService.getCondicionPorIDCompra(this.forma.controls['condComercial'].value, this.token )
      .subscribe( data => {
          this.ccData = data;
          auxCondComercial = this.ccData.dataset.length;
          if(this.ccData.returnset[0].RCode=="-6003"){
            //token invalido
            this.condicionComercial = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
    console.log('buscando lista de precios con ', this.forma.controls['idlistaPrecios'].value)
    this._listasPreciosService.getLista(this.forma.controls['idlistaPrecios'].value, this.token )
      .subscribe( data => {
          this.lpData = data;
          auxListaPrecios = this.lpData.dataset.length;
          if(this.lpData.returnset[0].RCode=="-6003"){
            //token invalido
            this.listaPrecios = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              console.log('encontrada lista de precios, ', this.lpData)
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
    console.log('buscando partida con ', this.forma.controls['idPartidaPresupuestaria'].value)
    this._partidasPresupuestariasService.getPartida(this.forma.controls['idPartidaPresupuestaria'].value, this.token )
      .subscribe( data => {
          this.ppData = data;
          auxPartidaPresupuestaria = this.ppData.dataset.length;
          if(this.ppData.returnset[0].RCode=="-6003"){
            //token invalido
            this.partidaPresupuestaria = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              console.log('encontrada partida, ', this.ppData)
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
  /* buscarTipoComprobante(){
    this._tiposComprobanteService.getTipoOperacionPorIdTipoComprobante(this.forma.controls['idTipoComprobante'].value, this.token )
      .subscribe( data => {
          this.tcData = data;
          auxTipoComprobante = this.tcData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tipoComprobante = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset[0];
                //this.loading = false;
              } else {
                this.tipoComprobante = null;
              }
            }
      });
  } */
  buscarTipoComprobante(){
    this._tiposComprobanteService.geTipoComprobanteCompras(this.forma.controls['idTipoComprobante'].value, this.token )
      .subscribe( data => {
          this.tcData = data;
          auxTipoComprobante = this.tcData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tipoComprobante = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
    // this._articulosService.getcArticulo(id , this.token )
    // this._articulosService.getcArticuloPorPartNumber(id , this.token )
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
          this.aData = data;
          auxArticulo = this.aData.dataset.length;
          if(this.aData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.articulo = null;
            this.carticulo = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } 
            else {
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
  //#region carga
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              if(this.provData.dataset.length>0){
                this.provCabecera = this.provData.dataset[0];
                this.existe = true;
                this.idCabecera = this.id;
                console.log('proveedor encontrado: ', this.provCabecera);

                this.partesACargar = this.partesACargar + 6; //principal + afip + 4 arrays
                this.partesCargadas = this.partesCargadas +1;

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
                
                if (this.provCabecera.listaprecios != null){
                  this.forma.controls['idlistaPrecios'].setValue(this.provCabecera.listaprecios);
                  this.buscarListaPrecios();
                }
                if (this.provCabecera.condicion_comercial != null){
                  this.forma.controls['condComercial'].setValue(this.provCabecera.condicion_comercial);
                  this.buscarCondComercial();
                }
                if (this.provCabecera.partidas_presupuestarias != null){
                  this.forma.controls['idPartidaPresupuestaria'].setValue(this.provCabecera.partidas_presupuestarias);
                  this.buscarPartidaPresupuestaria();
                }
                if (this.provCabecera.referencias_contables != null){
                  this.forma.controls['refContable'].setValue(this.provCabecera.referencias_contables);
                  this.buscarRefContable();
                }
                if (this.provCabecera.tipo_comprobante != null){
                  this.forma.controls['idTipoComprobante'].setValue(this.provCabecera.tipo_comprobante);
                  this.buscarTipoComprobante();
                }
                this.forma.controls['estado'].setValue(this.provCabecera.estado);
                this.forma.controls['catBloq'].setValue(this.provCabecera.categoria_bloqueo);
                
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

    //cargar datos de cuentas
    //cargar datos de relaciones comerciales
    this._proveedoresService.getRelComerciales(jsonbodyID , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.cuentasProvAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de cuentas asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.cuentasProvAll = this.respData.dataset;
              let index = 0;
              console.log('cuentas recuperadas: ', this.cuentasProvAll)
              this.cuentasProvAll.forEach(cuenta => {
                console.log('se va a armar el formgroup para cbu: ', cuenta)
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
              this.partesCargadas = this.partesCargadas + 1;
            }
            else{ this.partesCargadas = this.partesCargadas + 1; }
          }
    });

    //cargar datos de impuestos
    this._proveedoresService.getImpuestos(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.impuestosProvAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de impuestos asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.impuestosProvAll = this.respData.dataset;
              let index = 0;
              console.log('impuestos recuperadas: ', this.impuestosProvAll)
              this.impuestosProvAll.forEach(impuesto => {
                console.log('se va a armar el formgroup para impuesto: ', impuesto)
                this.addImpuesto();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('impuesto: ' ,this.forma.get(['impuestos', index]));
                let cImpuesto: FormGroup = <FormGroup>this.forma.get(['impuestos', index]);
                //todo agregar lo que falta cuando esté en la api
                cImpuesto.controls['impuesto'].setValue(impuesto.Impuesto) ;
                cImpuesto.controls['tipo'].setValue(impuesto.ID_Impuestos) ;
                cImpuesto.controls['modelo'].setValue(impuesto.ID_Modelo_impuestos) ;
                cImpuesto.controls['situacion'].setValue(impuesto.Situacion) ;
                cImpuesto.controls['codInscripcion'].setValue(impuesto.Codigo_inscripcion) ;
                cImpuesto.controls['fechaInscripcion'].setValue(this.nuevaFecha(impuesto.Fecha_inscripcion));
                cImpuesto.controls['observaciones'].setValue(impuesto.Observaciones) ;
                cImpuesto.controls['poseeExenciones'].setValue((impuesto.Exenciones == 1 ? true : false)) ;
                if (impuesto.Exenciones == 1) {
                  cImpuesto.controls['fechaDesde'].setValue(this.nuevaFecha(impuesto.Fecha_Desde_Exenciones));
                  console.log('fecha desde impuesto nro ' + index, impuesto.Fecha_Desde_Exenciones)
                  cImpuesto.controls['fechaHasta'].setValue(this.nuevaFecha(impuesto.Fecha_Hasta_Exenciones));
                  console.log('fecha hasta impuesto nro ' + index, impuesto.Fecha_Hasta_Exenciones)
                }
                
                index = index +1;
              });
              this.partesCargadas = this.partesCargadas + 1;
            }
            else{ this.partesCargadas = this.partesCargadas + 1; }
          }
    });

    //cargar datos de formularios
    this._proveedoresService.getFormularios(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.formulariosProvAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de formulario asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.formulariosProvAll = this.respData.dataset;
              let index = 0;
              console.log('formulario recuperadas: ', this.formulariosProvAll)
              this.formulariosProvAll.forEach(formulario => {
                console.log('se va a armar el formgroup para formulario: ', formulario)
                this.addFormulario();
                // this.forma.controls.cuentas[0].controls[''].setValue(cuenta.CBU);
                // (<FormArray>this.forma.controls.cuentas).controls['rcCbu'].setValue(cuenta.CBU);
                console.log('impuesto: ' ,this.forma.get(['formularios', index]));
                let cFormulario: FormGroup = <FormGroup>this.forma.get(['formularios', index]);
                //todo agregar lo que falta cuando esté en la api
                cFormulario.controls['ID_Form_Proveedor'].setValue(formulario.ID_Formulario) ;
                cFormulario.controls['codForm'].setValue(formulario.ID_Formulario_nombre) ;
                //ID_Formulario es el id de relación
                cFormulario.controls['fechaPres'].setValue(this.nuevaFecha(formulario.Fecha_presentacion));
                console.log('fecha real de impuesto ' + index + '(pres): ', formulario.Fecha_presentacion);
                cFormulario.controls['fechaVenc'].setValue(this.nuevaFecha(formulario.Fecha_vencimiento));
                console.log('fecha real de impuesto ' + index + '(venc): ', formulario.Fecha_vencimiento);
                cFormulario.controls['url'].setValue(formulario.Url) ;
                cFormulario.controls['descripcion'].setValue(formulario.Descripcion) ; 
                // cFormulario.controls['Id_FormularioCte'].setValue(formulario.ID_Formulario) ; 
                
                index = index +1;
              });
              this.partesCargadas = this.partesCargadas + 1;
            }
            else{ this.partesCargadas = this.partesCargadas + 1; }
          }
    });

    //cargar datos de articulos
    //todo probar cuando lo permita la api
    this._proveedoresService.getArticulos(jsonbodyID , this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.articulosProvAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
                cArticulo.controls['artID'].setValue(articulo.id_articulo);
                //todo verificar funcionamiento de busqueda, cuando funcione la api
                // cArticulo.controls['artDesc'].setValue(articulo.NAME);
                cArticulo.controls['artDesc'].setValue(articulo.nombre_articulo);
                // this.buscarArticulo(index);

                cArticulo.controls['ultimaFecha'].setValue(this.nuevaFecha(articulo.fecha_ultima_compra));
                cArticulo.controls['ultimoPrecio'].setValue(articulo.precioultimacompra);
                cArticulo.controls['codArtProv'].setValue(articulo.codigo_articulo_proveedor);//id de proveedor
                cArticulo.controls['barrasArtProv'].setValue(articulo.codigobarra);
                cArticulo.controls['moneda'].setValue(articulo.id_moneda);
                cArticulo.controls['fecha_creacion'].setValue(articulo.fecha_creacion);
                cArticulo.controls['fecha_ult_modificacion'].setValue(articulo.fecha_ult_modificacion);
                cArticulo.controls['id_usuario_creador'].setValue(articulo.id_usuario_creador);
                cArticulo.controls['id_usuario_modificador'].setValue(articulo.id_usuario_modificador);

                index = index +1;
              });
              this.partesCargadas = this.partesCargadas + 1;
            }
            else{ this.partesCargadas = this.partesCargadas + 1; }
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de afip asociadas: ', this.respData)
            if(this.respData.dataset.length>0){
              this.datosAFIP = this.respData.dataset[0];
              // let index = 0;
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

                // index = index +1;
              // });
              this.partesCargadas = this.partesCargadas + 1;
            }
            else{ this.partesCargadas = this.partesCargadas + 1; }
          }
    });
  }
  //#endregion carga
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

  // abrirConsulta(consulta: string, control: string){
  //usa el mismo formato que los get de formcontrol: ej ['coleccion', indice_en_array...]
  /** @description Abre el modal de consulta y establece una suscripción para usar el objeto seleccionado. 
   * @example abrirConsulta('c_articulos', ['articulos', i], 'artID', 'artDesc'); //usar consulta dinámica de artículos, ir al objeto número 'i' del FormArray 'articulos', escribir el id en 'artID' y su descripción en 'artDesc'.
   * @param {string} consulta Nombre del reporte. Por ahora también el endpoint que contiene los datos
   * @param {any[]} ubicacion Camino hacia los controles a actualizar. Si está vacío se actualizan los controles al nivel base del form. Para ver cómo se muestran los FormArray buscar formArrayName y formGroupName en el html.
   * @param {string} controlID Nombre del FormControl donde se pegará el id del objeto seleccionado
   * @param {string} controlDesc (Opcional) Nombre del FormControl donde se pegará el Nombre o Descripción del objeto seleccionado
   * @param {any} filtros (Opcional) Lista de filtros Obligatorios o por Defecto. Estructura: {obligatorios: [{atributo: string, valor: any}], porDefecto: [{atributo: string, valor: any}]};
   * @param {string} funcion (Opcional) [NO IMPLEMENTADO] Nombre de la función a ejecutar luego de la selección.
   * @param {any} param (Opcional) [NO IMPLEMENTADO] Lista de parámetros para la función a ejecutar.
  */
  // abrirConsulta(consulta: string, ubicacion: any[], controlID: string, controlDesc?: string, funcion?: string, param?: any){
  //agregado objeto para filtros obligatorios/por defecto. filtros = {obligatorios: [{atributo: string, valor: any}], porDefecto: [{atributo: string, valor: any}]}
  abrirConsulta(consulta: string, ubicacion: any[], controlID: string, controlDesc?: string, filtros?: any, funcion?: string, param?: any){
    console.clear();
    console.log(' recibido por abrirconsulta1: ', consulta, controlID, controlDesc, ubicacion, filtros, funcion, param);
    let datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      modal: string;
      filtros: any;
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null,
      modal: 'consDinModal',
      filtros: filtros
    }
    
    let atributoAUsar: string;
    let atributoDesc:  string = 'name';
    switch (consulta) {
      // case 'c_articulos':
      //   atributoAUsar = 'part_number';
      //   break;
      case 'tg01_localidades':
        atributoAUsar = 'cpostal';
        break;
      case 'tg01_categoriasiva':
        atributoAUsar = 'idcategoria';
        break;
      case 'tg05_partidas_presupuestaria':
        atributoAUsar = 'codigo_partida';
        break;
      default:
        atributoAUsar = 'id';
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
        //obtener la base sobre la que se buscará los FormControl
        let fg: FormGroup;
        if (ubicacion.length == 0){
          fg = this.forma;
        }
        else{
          fg = this.forma.get(ubicacion) as FormGroup;
        }

        //escribir el valor en el primer control, para el id
        fg.controls[controlID].setValue(respuesta.selection[0][atributoAUsar]);

        //si hay que guardar descripción:
        if (controlDesc != null){
          if (respuesta.selection[0][atributoDesc] != null){
            fg.controls[controlDesc].setValue(respuesta.selection[0][atributoDesc]);
          }
          else{
            fg.controls[controlDesc].setValue('');
            console.log('Valor de ' + controlDesc + ' vaciado, no se encontró ' + atributoDesc + ' en la seleccion');
          }
        }

        //ejecutar función
        if (funcion != null){
          console.log('todo llamado a funcion');
          
          //lo siguiente funciona:
          // this[funcion](param);
        }

        // this['proveedor'] = null;
        // this['resultado'+control] = respuesta.selection[0];
        
        //todo 
        //disparar detección de cambios, cada parte es un intento distinto
        // this.proveedor = respuesta.selection[0];
        
        // setTimeout(() => this.ref.detectChanges(), 1000);
        // this.ref.markForCheck();
      
        // this.forma.controls['artDeProveedor'].updateValueAndValidity();

        // console.log('seleccionado: ',this.resultadoidGrupo, this['resultado'+control]);
      }
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
        "p_fac_ciudad": this.localidadFac.name, //"Lopez", //Id de la consulta dinámica a la tabla tg01_localidades
        "p_fac_prov": this.provinciaFac.name, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
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
        "p_id_impositivo" : this.forma.controls['idImpositivo'].value, //id de consulta dinámica a tabla tg01_impuestos
        "p_rel_estado" : this.forma.controls['estado'].value, 
        "p_rel_categoria_bloqueo" : this.forma.controls['catBloq'].value, 
        "p_rel_tipo_comprobante" : this.forma.controls['idTipoComprobante'].value 
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
            } else {
              console.log(this.respData)
              if (this.respData.returnset[0].RCode != 1){
                this.openSnackBar('Error al guardar Proveedor: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Cabecera de proveedor guardada con exito, continuando.');
                this.idCabecera = this.respData.returnset[0].RId;
                this.id = this.respData.returnset[0].RId;
                console.log('ID de proveedor recibido: ' + this.idCabecera);
                setTimeout(() => {
                  this.router.navigate(['/proveedores', this.id]);
                });
                this.guardarDatosProveedor(this.respData.returnset[0].RId);
                // this.openSnackBar('Proveedor guardado con exito, redireccionando.');
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
    /* (<FormArray>this.forma.controls.cuentas).controls.forEach( cuenta => {
       
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
      let jsonbodyRC= JSON.stringify(jsbodyRC); /
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
              }); /
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
    });// fin foreach relación comercial */
    this.guardarRelComerciales();
    
    //IMPUESTOS
    /* (<FormArray>this.forma.controls.impuestos).controls.forEach( impuesto => {
      let impuestoActual: FormGroup = <FormGroup>impuesto;

      let auxDesde, auxHasta, auxInsc;
      
      auxDesde = this.extraerFecha(<FormControl>impuestoActual.controls['fechaDesde']);
      auxHasta = this.extraerFecha(<FormControl>impuestoActual.controls['fechaHasta']);
      auxInsc  = this.extraerFecha(<FormControl>impuestoActual.controls['fechaInscripcion']);

      let jsbodyImp = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
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
    });// fin foreach impuestos */
    this.guardarImpuestos();
    
    //FORMULARIOS
    /* (<FormArray>this.forma.controls.formularios).controls.forEach( formulario => {
      let formularioActual: FormGroup = <FormGroup>formulario;

      let jsbodyForm = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_form_codigo" : formularioActual.controls['codForm'].value,
        "p_form_fecha_pres" : this.extraerFecha(<FormControl>formularioActual.controls['fechaPres']),//"1997-05-05",
        "p_form_fecha_vto" : this.extraerFecha(<FormControl>formularioActual.controls['fechaVenc']),//"1997-05-05"
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
    });// fin foreach formularios */
    this.guardarFormularios();

    //ARTICULOS
    /* (<FormArray>this.forma.controls.articulos).controls.forEach( articulo => {
      let articuloActual: FormGroup = <FormGroup>articulo;

      let jsbodyArticulo = {
        "Id_Proveedor": idProveedor, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_stock_id_art": articuloActual.controls['artID'].value, //id de consulta dinámica a tabla articulos
        "p_stock_fecha_ult_compra": this.extraerFecha(<FormControl>articuloActual.controls['ultimaFecha']), //"1997-05-05",
        "p_stock_moneda": articuloActual.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
        "p_stock_codigo_barra_prov": articuloActual.controls['barrasArtProv'].value, //Código de barra
        "p_stock_precio_ult_compra": 120.33,
        "p_stock_codigo_articulo_prov": "PROD 1"
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
              this.forma.disable();
              // this.openSnackBar('Sesión expirada.')
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
    });// fin foreach articulos */
    this.guardarArticulos();

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

    this._proveedoresService.postAFIP(jsonbodyAFIP, this.token )
      .subscribe( data => {
        //console.log(dataRC);
        this.respData = data;
        console.log('respuesta postafip: ', this.respData);
        // auxProvData = this.proveedorData.dataset.length;
        if(this.respData.returnset[0].RCode=="-6003"){
          //token invalido
          this.forma.disable();
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
    this.modificarProveedor();
    this.guardarRelComerciales();
    this.guardarImpuestos();
    this.guardarFormularios();
    
    this.guardarArticulos();
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
      "p_fac_ciudad": this.localidadFac.name, //"Lopez", //Id de la consulta dinámica a la tabla tg01_localidades
      "p_fac_prov": this.provinciaFac.name, //"Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
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
      "p_id_impositivo" :this.forma.controls['idImpositivo'].value, //id de consulta dinámica a tabla tg01_impuestos
      "p_rel_estado" : this.forma.controls['estado'].value, 
      "p_rel_categoria_bloqueo" : this.forma.controls['catBloq'].value, 
      "p_rel_tipo_comprobante" : this.forma.controls['idTipoComprobante'].value 
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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

  //#region sincronizarListas
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
      console.log('cuenta ', cuenta);
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

    console.log('Lista de cuentas a procesar: ', this.estadosCuentas);

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

  guardarFormularios(){

    this.estadosFormularios.nuevos = [];
    this.estadosFormularios.modificados = [];

    let listaFormularios = <FormArray>this.forma.get(['formularios']);
    // console.log('estado de la lista de cuentas: ', listaCuentas.dirty);
    (listaFormularios.controls).forEach(element => {
      let formulario = <FormGroup>element;
      console.log('formulario ', formulario);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (formulario.dirty){
        //si tiene id es modificación
        if (formulario.controls['ID_Form_Proveedor'].value != null){
          this.estadosFormularios.modificados.push(formulario);
        }
        else{
          this.estadosFormularios.nuevos.push(formulario);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de Formularios a procesar: ', this.estadosFormularios);

    this.estadosFormularios.nuevos.forEach(formFormulario => {
      this.guardarFormulario(formFormulario);
    });

    this.estadosFormularios.modificados.forEach(formFormulario => {
      this.modificarFormulario(formFormulario);
    });

    this.estadosFormularios.eliminados.forEach(formularioEliminado => {
      this.eliminarFormulario(formularioEliminado);
    });

    //reiniciar listas
    this.estadosFormularios ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  guardarImpuestos(){

    this.estadosImpuestos.nuevos = [];
    this.estadosImpuestos.modificados = [];

    let listaImpuestos = <FormArray>this.forma.get(['impuestos']);
    // console.log('estado de la lista de cuentas: ', listaCuentas.dirty);
    (listaImpuestos.controls).forEach(element => {
      let impuesto = <FormGroup>element;
      console.log('impuesto ', impuesto);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (impuesto.dirty){
        //si tiene id es modificación
        if (impuesto.controls['impuesto'].value != null){
          this.estadosImpuestos.modificados.push(impuesto);
        }
        else{
          this.estadosImpuestos.nuevos.push(impuesto);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de Impuestos a procesar: ', this.estadosImpuestos);

    this.estadosImpuestos.nuevos.forEach(formImpuesto => {
      this.guardarImpuesto(formImpuesto);
    });

    this.estadosImpuestos.modificados.forEach(formImpuesto => {
      this.modificarImpuesto(formImpuesto);
    });

    this.estadosImpuestos.eliminados.forEach(impuestoEliminado => {
      this.eliminarImpuesto(impuestoEliminado);
    });

    //reiniciar listas
    this.estadosImpuestos ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  guardarArticulos(){

    this.estadosArticulos.nuevos = [];
    this.estadosArticulos.modificados = [];

    let listaArticulos = <FormArray>this.forma.get(['articulos']);
    // console.log('estado de la lista de cuentas: ', listaCuentas.dirty);
    (listaArticulos.controls).forEach(element => {
      let articulo = <FormGroup>element;
      console.log('articulo ', articulo);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (articulo.dirty){
        //si tiene id es modificación
        //todo cambiar cuando arreglen la api
        if (articulo.controls['fecha_creacion'].value != null){
          this.estadosArticulos.modificados.push(articulo);
        }
        else{
          this.estadosArticulos.nuevos.push(articulo);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de Articulos a procesar: ', this.estadosArticulos);

    this.estadosArticulos.nuevos.forEach(formArticulo => {
      this.guardarArticulo(formArticulo);
    });

    this.estadosArticulos.modificados.forEach(formArticulo => {
      this.modificarArticulo(formArticulo);
    });

    this.estadosArticulos.eliminados.forEach(articuloEliminado => {
      this.eliminarArticulo(articuloEliminado);
    });

    //reiniciar listas
    this.estadosArticulos ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  //#endregion sincronizarListas

  //#region jsons
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

  armarJSONFormulario(formulario: any){
    let formgroupFormulario = <FormGroup>formulario;
    

    let jsonbodyF, jsbodyF;
    console.log('control de formulario a usar: ', formgroupFormulario)
    if (formgroupFormulario.controls['ID_Form_Proveedor'].value == null){
      
      
      jsbodyF = {
        "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_form_codigo" : formgroupFormulario.controls['codForm'].value,
        "p_form_fecha_pres" : this.fechaActual, // this.extraerFecha(<FormControl>formgroupFormulario.controls['fechaPres']),//"1997-05-05",
        "p_form_fecha_vto" :  this.fechaVenci,//this.extraerFecha(<FormControl>formgroupFormulario.controls['fechaVenc']),//"1997-05-05"
        "url": formgroupFormulario.controls['url'].value,// formgroupFormulario.controls['url'].value,
        "form_descripcion": formgroupFormulario.controls['descripcion'].value,
      }
    }
    else{
      jsbodyF = {
        /* "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor, igual a     ID_Form_Proveedor   
        "Id_FormularioCte" : formgroupFormulario.controls['ID_Form_Proveedor'].value, */
        "Id_Proveedor": this.id,
        "Id_FormularioCte": formgroupFormulario.controls['ID_Form_Proveedor'].value,
        // "p_form_codigo" : formgroupFormulario.controls['codForm'].value,
        "p_form_fecha_pres" : this.fechaActual,// this.extraerFecha(<FormControl>formgroupFormulario.controls['fechaPres']),//"1997-05-05",
        "p_form_fecha_vto" : this.fechaVenci,// this.extraerFecha(<FormControl>formgroupFormulario.controls['fechaVenc']),//"1997-05-05"
        // "url": this.urlImagen,// formgroupFormulario.controls['url'].value,
        "URL": formgroupFormulario.controls['url'].value,// formgroupFormulario.controls['url'].value,
        "form_descripcion": formgroupFormulario.controls['descripcion'].value,
      }
    }
    
    jsonbodyF= JSON.stringify(jsbodyF);
    return jsonbodyF;
  }

  armarJSONImpuesto(impuesto: any){
    let formGroupImpuesto = <FormGroup>impuesto;
    let jsonbodyImp, jsbodyImp;
    console.log('control de impuesto a usar: ', formGroupImpuesto)
    // todo revisar if, parece que no hay diferencia, y cambiar cuando arreglen la api
    // if (formGroupImpuesto.controls[''].value == null){
      jsbodyImp = {
        "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_imp_tipo" : formGroupImpuesto.controls['tipo'].value, // id de tabla tg01_impuestos
        "p_imp_modelo" : formGroupImpuesto.controls['modelo'].value, // id de tabla  tg01_modeloimpuestos
        "p_imp_situacion" : formGroupImpuesto.controls['situacion'].value,
        "p_imp_nro_inscripcion" : formGroupImpuesto.controls['codInscripcion'].value,//"1",
        "p_imp_fecha_insc" : this.extraerFecha(<FormControl>formGroupImpuesto.controls['fechaInscripcion']),//"1997-05-05",
        "p_imp_excenciones" : formGroupImpuesto.controls['poseeExenciones'].value.toString(),//"false",
        "p_imp_fecha_comienzo_excencion" : this.extraerFecha(<FormControl>formGroupImpuesto.controls['fechaDesde'], false), // → si es true
        "p_imp_fecha_caducidad_excencion" : this.extraerFecha(<FormControl>formGroupImpuesto.controls['fechaHasta'], false),//  → si es true
        "p_imp_obs" :formGroupImpuesto.controls['observaciones'].value
      }
    // }
    // else{
    //   jsbodyImp = {
    //     "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
    //     "p_imp_tipo" : formGroupImpuesto.controls['tipo'].value, // id de tabla tg01_impuestos
    //     "p_imp_modelo" : formGroupImpuesto.controls['modelo'].value, // id de tabla  tg01_modeloimpuestos
    //     "p_imp_situacion" : formGroupImpuesto.controls['situacion'].value,
    //     "p_imp_codigo" : formGroupImpuesto.controls['codInscripcion'].value,//"1",
    //     "p_imp_fecha_insc" : formGroupImpuesto.controls['fechaInscripcion'].value,//"1997-05-05",
    //     "p_imp_excenciones" : formGroupImpuesto.controls['exenciones'].value.toString(),//"false",
    //     "p_imp_fecha_comienzo_excencion" : formGroupImpuesto.controls['fechaDesde'].value, // → si es true
    //     "p_imp_fecha_caducidad_excencion" : formGroupImpuesto.controls['fechaHasta'].value,//  → si es true
    //     "p_imp_obs" :formGroupImpuesto.controls['observaciones'].value
    //   }
    // }
    jsonbodyImp= JSON.stringify(jsbodyImp);
    console.log('json impuesto a usar: ', jsonbodyImp)
    return jsonbodyImp;
  }

  armarJSONArticulo(articulo: any){
    let formgroupArticulo = <FormGroup>articulo;
    let jsonbodyArt, jsbodyArt;
    console.log('control de articulo a usar: ', formgroupArticulo)
    //condicion para saber si es update o insert
    if (formgroupArticulo.controls['fecha_creacion'].value == null){
    // if (??){
      jsbodyArt = {
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_stock_id_art": formgroupArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulo      
      "p_stock_fecha_ult_compra": this.extraerFecha(<FormControl>formgroupArticulo.controls['ultimaFecha']), //"1997-05-05",
      "p_stock_moneda": formgroupArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
      "p_stock_codigo_barra_prov": formgroupArticulo.controls['barrasArtProv'].value, //Código de barra
      "p_stock_precio_ult_compra": formgroupArticulo.controls['ultimoPrecio'].value,
      "p_stock_codigo_articulo_prov": formgroupArticulo.controls['codArtProv'].value,
      
      // "p_stock_nombre_art": formgroupArticulo.controls['artDesc'].value,

      // fecha_creacion: string;
      // fecha_ult_modificacion: string;
      // id_usuario_creador: string;
      // id_usuario_modificador: string;
    }
    }
    else{
      jsbodyArt = {
      "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
      "p_stock_id_art": formgroupArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulo      
      "p_stock_fecha_ult_compra": this.extraerFecha(<FormControl>formgroupArticulo.controls['ultimaFecha']), //"1997-05-05",
      "p_stock_moneda": formgroupArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
      "p_stock_codigo_barra_prov": formgroupArticulo.controls['barrasArtProv'].value, //Código de barra
      "p_stock_precio_ult_compra": formgroupArticulo.controls['ultimoPrecio'].value,
      "p_stock_codigo_articulo_prov": formgroupArticulo.controls['codArtProv'].value,
      
      // "p_stock_nombre_art": formgroupArticulo.controls['artDesc'].value,

      /* "fecha_creacion": formgroupArticulo.controls['fecha_creacion'].value,
      // "fecha_ult_modificacion": formgroupArticulo.controls['fecha_ult_modificacion'].value,
      "fecha_ult_modificacion": formgroupArticulo.controls['fecha_ult_modificacion'].value,
      "id_usuario_creador": formgroupArticulo.controls['id_usuario_creador'].value,
      // "id_usuario_modificador": formgroupArticulo.controls['id_usuario_modificador'].value, */
      }
    }
    jsonbodyArt= JSON.stringify(jsbodyArt);
    return jsonbodyArt;

    // let jsbodyArticulo = {
    //   "Id_Proveedor": this.id, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
    //   "p_stock_id_art": this.formaArticulo.controls['artID'].value, //id de consulta dinámica a tabla articulos
    //   "p_stock_fecha_ult_compra": this.formaArticulo.controls['ultimaFecha'].value, //"1997-05-05",
    //   "p_stock_moneda": this.formaArticulo.controls['moneda'].value, //id de consulta dinámica a tabla tg01_monedas
    //   "p_stock_codigo_barra_prov": this.formaArticulo.controls['barrasArtProv'].value, //Código de barra
    //   //ultimoPrecio
    //   //codArtProv
    // }
    // let jsonbodyArticulo = JSON.stringify(jsbodyArticulo);
  }

  
  //#endregion jsons

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
    console.log('body insertado de relacion: ', jsonbodyRC);

    this._proveedoresService.postRelComercial(jsonbodyRC, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          console.log('respuesta insert relacion: ', this.respData);
          // auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.forma.disable();
            this.openSnackBar('Token invalido insertando relacion comercial')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al agregar Relación Comercial: ' + this.respData.returnset[0].RTxt);
            }
            else{
              // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
              console.log('Relacion Comercial ID (insert): ' + this.respData.returnset[0].RId);
              (<FormGroup>cuenta).controls['ID_Relacion_Comercial'].setValue(this.respData.returnset[0].RId);
              (<FormGroup>cuenta).markAsPristine();
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
            this.forma.disable();
            this.openSnackBar('Token invalido updateando relacion comercial')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al actualizar Relación Comercial: ' + this.respData.returnset[0].RTxt);
            }
            else{
              // this.openSnackBar('Proveedor eliminado con exito, redireccionando.');
              console.log('Relacion Comercial ID (update): ' + this.respData.returnset[0].RId);
              (<FormGroup>cuenta).markAsPristine();
            }
          }
          //console.log(this.refContablesAll);
      });
  }

  guardarFormulario(formulario: any){
    let jsonbodyF = this.armarJSONFormulario(formulario);
    console.log('body insertar de formulario: ', jsonbodyF);

    this._proveedoresService.postFormulario(jsonbodyF, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta insert formulario: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.openSnackBar('Sesión expirada.')
            this.openSnackBar('Token invalido insertando Formulario')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al agregar Formulario: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Formulario ID (insert): ' + this.respData.returnset[0].RId);
              (<FormGroup>formulario).controls['ID_Formulario'].setValue(this.respData.returnset[0].RId);
              (<FormGroup>formulario).markAsPristine();              
            }
          }
      });
  }

  modificarFormulario(formulario: any){
    let jsonbodyF = this.armarJSONFormulario(formulario);
    console.log('body modificacion de formulario: ', jsonbodyF);

    this._proveedoresService.updateFormulario(jsonbodyF, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta update formulario: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.forma.disable();
            this.openSnackBar('Token invalido modificando Formulario')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al modificar Formulario: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Formulario ID (update): ' + this.respData.returnset[0].RId);
              (<FormGroup>formulario).markAsPristine();
            }
          }
      });
  }

  guardarImpuesto(impuesto: any){
    let jsonbodyI = this.armarJSONImpuesto(impuesto);
    console.log('body insertar de impuesto: ', jsonbodyI);

    this._proveedoresService.postImpuesto(jsonbodyI, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta insert impuesto: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.forma.disable();
            this.openSnackBar('Token invalido insertando Impuesto')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al agregar Impuesto: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Impuesto ID (insert): ' + this.respData.returnset[0].RId);
              (<FormGroup>impuesto).controls['impuesto'].setValue(this.respData.returnset[0].RId);
              (<FormGroup>impuesto).markAsPristine();
            }
          }
      });
  }

  modificarImpuesto(impuesto: any){
    let jsonbodyI = this.armarJSONImpuesto(impuesto);
    console.log('body modificar de impuesto: ', jsonbodyI);

    this._proveedoresService.updateImpuesto(jsonbodyI, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta update impuesto: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.forma.disable();
            this.openSnackBar('Token invalido modificando Impuesto')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al modificar Impuesto: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Impuesto ID (update): ' + this.respData.returnset[0].RId);
              (<FormGroup>impuesto).markAsPristine();
            }
          }
      });
  }

  guardarArticulo(articulo: any){
    let jsonbodyA = this.armarJSONArticulo(articulo);
    console.log('body insertar de articulo: ', jsonbodyA);

    this._proveedoresService.postArticulo(jsonbodyA, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta insert articulo: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.forma.disable();  
            this.openSnackBar('Token invalido insertando Articulo')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al agregar Articulo: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Articulo ID (insert): ' + this.respData.returnset[0].RId);
              (<FormGroup>articulo).controls['fecha_creacion'].setValue(this.respData.returnset[0].RId);//no importa que sea, sólo que tenga valor ya que no se envía por json (es generado por el backend)
              (<FormGroup>articulo).markAsPristine();
            }
          }
      });
  }

  modificarArticulo(articulo: any){
    let jsonbodyA = this.armarJSONArticulo(articulo);
    console.log('body modificar de articulo: ', jsonbodyA);

    this._proveedoresService.updateArticulo(jsonbodyA, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta modificar articulo: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            this.forma.disable();  
            this.openSnackBar('Token invalido modificar Articulo')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al modificar Articulo: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Articulo ID (update): ' + this.respData.returnset[0].RId);
              (<FormGroup>articulo).markAsPristine();
            }
          }
      });
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              console.log('Error al eliminar Relación Comercial: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Relación Comercial eliminada con exito');
            }
          }
      });
  }

  eliminarImpuesto(impuesto: any){
    let jsbody = {
      "Id_Proveedor": this.id, 
      "p_imp_tipo": impuesto.tipo, //id de consulta dinámica a tabla tg01_impuestos
      "p_imp_modelo": impuesto.modelo
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteImpuesto(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              console.log('Error al eliminar Impuesto: ' + this.respData.returnset[0].RTxt);
              // this.openSnackBar('Error al eliminar Impuesto: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Impuesto eliminado con exito');
              // this.openSnackBar('Impuesto eliminado con exito');
            }
          }
          //console.log(this.refContablesAll);
      });
  }

  eliminarArticulo(codigo: string){
    let jsbody = {
      // "prov_codigo": this.id, 
      "Id_Proveedor": this.id, 
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              this.openSnackBar('Error al eliminar Articulo: ' + this.respData.returnset[0].RTxt);
              console.log('Error al eliminar Articulo: ' + this.respData.returnset[0].RTxt, jsonbody);
            }
            else{
              this.openSnackBar('Articulo eliminado con exito');
              console.log('Eliminado Articulo: ' + this.respData.returnset[0].RTxt);
            }
          }
          //console.log(this.refContablesAll);
      });
  }

  eliminarFormulario(codigo: string){
    let jsbody = {
      "Id_Proveedor": this.id, 
      "Id_Formulario" : codigo
      }
    let jsonbody = JSON.stringify(jsbody);

    this._proveedoresService.deleteFormulario(jsonbody, this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.respData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if (this.respData.returnset[0].RCode != 1){
              // this.openSnackBar('Error al eliminar Formulario: ' + this.respData.returnset[0].RTxt);
              console.log('Error al eliminar Formulario: ' + this.respData.returnset[0].RTxt);
            }
            else{
              // this.openSnackBar('Formulario eliminado con exito');
              console.log('Eliminado Formulario: ' + this.respData.returnset[0].RTxt);
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
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
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
  extraerFecha(control: FormControl, admiteNulos?: boolean){
    console.log('control a usar para fecha: ', control)
    let auxFecha: string;
    if ((control.value != null)&&(control.value != '')){
      let ano = control.value.getFullYear().toString();
      let mes = (control.value.getMonth()+1).toString();
      if(mes.length==1){mes="0"+mes};
      let dia = control.value.getDate().toString();
      if(dia.length==1){dia="0"+dia};
      auxFecha = ano+"-"+mes+"-"+dia;
      return auxFecha;
    }
    else{
      if (admiteNulos != null){
        if (admiteNulos == false){
          return '';
        }
      }
      return null;
    }
  }

  testValidez(){
    this.estadosCuentas = {nuevos: [],
      modificados: [],
      eliminados: []};
    //ver validez de  los controles
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
  buscarTipForm(codForm,j){
    let cFormulario: FormGroup = <FormGroup>this.forma.get(['formularios',j]);
    if(cFormulario.controls['codForm'].value != null){
      this._formulariosService.getFormulario(codForm, this.token)
      .subscribe(dataF => {
        console.log(dataF)
        this.formTipo = dataF;
        this.formData = this.formTipo.dataset
        console.log(codForm)
        auxFormCod = codForm;
        if(cFormulario.controls['url'].value != null){
          this.cargaFechas(auxFormCod,j)
          
        }
        
      })
    }
    console.log('formulario: ', cFormulario.controls['codForm'].value)
    
  }

  cargaFechas(auxFormCod,j){
    let cFormulario: FormGroup = <FormGroup>this.forma.get(['formularios',j]);
  //  this.buscarTipForm(auxFormCod,j)
    if(this.formData[0].periodicidad === "M"){
      this.fechaVenci = new Date();
      this.fechaVenci.setMonth(this.fechaVenci.getMonth() + this.formData[0].periodo)
      cFormulario.controls['fechaPres'].setValue(this.fechaActual)
      cFormulario.controls['fechaVenc'].setValue(this.fechaVenci)
   //   this.fechaVencimiento = this.fechaVenci; 
    } else if(this.formData[0].periodicidad === "A"){
      this.fechaVenci = new Date();
      this.fechaVenci.setFullYear(this.fechaVenci.getFullYear() + this.formData[0].periodo)
      cFormulario.controls['fechaVenc'].setValue(this.fechaVenci)
    //  this.fechaVencimiento = this.fechaVenci; 
    } else if(this.formData[0].periodicidad === "D"){
      this.fechaVenci = new Date();
      this.fechaVenci.setDate(this.fechaVenci.getDate() + this.formData[0].periodo)
   //   this.fechaVencimiento = this.fechaVenci; 
    }
  }
  cargar(attachment,j){
    this.adjunto = attachment.files[0];
    console.clear();
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
         let cFormulario: FormGroup = <FormGroup>this.forma.get(['formularios',j]);
         cFormulario.controls['url'].setValue(this.urlImagen)
         if (cFormulario.controls['codForm'].value != null){
           this.cargaFechas(cFormulario.controls['codForm'].value,j)
         }
       });
  }
  verificaCuit(){
    let jsbody = {
      "token": "Token",
       "sign": "Sign",
       "cuitRepresentada": 30709041483,
       "idPersona": 20221064233
    }
    let jsonbodycuit = JSON.stringify(jsbody);
    this._afipService.a5GetPersona(this.token, jsonbodycuit)
      .subscribe( respC => {
        console.log("Respuesta de verificaCuit: ", respC)
        this.respCuit = respC
      })
  }

}
export interface formDatos{
  "id": string,
  "name": string,
  "deleted": number,
  "codigo": number,
  "fechavigencia": string,
  "periodicidad": string,
  "periodo": number
}
