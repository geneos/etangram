import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
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
import { ProveedorCabecera } from 'src/app/interfaces/proveedor.interface';
import { CategoriasBloqueoService } from 'src/app/services/i2t/cat-bloqueo.service';
import { FormulariosService } from 'src/app/services/i2t/formularios.service';
import { PartidasPresupuestariasService } from 'src/app/services/i2t/part-presupuestaria.service';

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
        catRef: new FormControl('', Validators.required),
        // idZona: new FormControl(),
        idZona: new FormControl('', [], this.existeZona), //19/01/02 10:40=> no hay zonas
        zonaDesc: new FormControl(),
        // idVendedor: new FormControl(),
        idVendedor: new FormControl('', [], this.existeVendedor), //no hay vendedores
        vendedorDesc: new FormControl(),
        // idCobrador: new FormControl(),
        idCobrador: new FormControl('', [], this.existeCobrador),
        cobradorDesc: new FormControl(),
        limiteCredito: new FormControl(),
        //parametros
        idlistaPrecios: new FormControl('', [], this.existeListaPrecios),
        condComercial: new FormControl('', [], this.existeCondComercial),
        // idPartidaPresupuestaria: new FormControl(),
        idPartidaPresupuestaria: new FormControl('', [], this.existePartidaPresupuestaria),
        refContable: new FormControl('', [], this.existeRefContable),
        idTipoComprobante: new FormControl('', [], this.existeTipoComprobante),
          //descripciones de parametros
          descListaPrecios: new FormControl(),
          descCondComercial: new FormControl(),
          descPartidaPresupuestaria: new FormControl(),
          descRefContable: new FormControl(),
          descTipoComprobante: new FormControl(),
        //cuentas: aparte
        cuentas: this.FormBuilder.array([]),
      catBloq: new FormControl(),
      //IMPUESTOS
      sitIVA: new FormControl(),
      cuit: new FormControl(),
      cai: new FormControl(),
      fechaVtoCai: new FormControl(),
      cuitExterior: new FormControl(),
      idImpositivo: new FormControl(),
        //+ formaImpuesto
        impuestos: this.FormBuilder.array([]),
          //excenciones dentro
        //+ formaFormulario
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

        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.disable();
          /* this.forma.controls['numero'].disable();
          this.forma.controls['razonSocial'].disable();
          this.forma.controls['cuit'].disable();
          this.forma.controls['posicionFiscal'].disable(); */
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

  construirCuentaBancaria(){
    console.log('creando cuenta vacia')
    return new FormGroup({ 
      'rcCbu': new FormControl('', Validators.required),
      'rcTipo': new FormControl('', Validators.required),
      'rcCuentaBancaria': new FormControl('', Validators.required),
      'rcCodigoSucursal': new FormControl('', Validators.required)
    });
  }
  construirImpuesto(){
    return new FormGroup({
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
    /* return new FormGroup({
      'artID': new FormControl('', Validators.required, this.existeArticulo),
        'artDesc': new FormControl(),
      'ultimaFecha': new FormControl('', Validators.required),
      'ultimoPrecio': new FormControl(),
      'codArtProv': new FormControl(),
      'barrasArtProv': new FormControl('', Validators.required),
      'moneda': new FormControl('', Validators.required)
    }); */

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
    this.buscarCategoriasBloqueo();
    this.buscarFormularios();

    this.tipoReferente = 'P';
    this.loading = false;
  }

  copiarDireccion(){
    this.forma.controls['envCalle'].setValue(this.forma.controls['facCalle'].value);
    this.forma.controls['envCodigoPostal'].setValue(this.forma.controls['facCodigoPostal'].value);
  }

//impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  /* addImpuesto(){
    this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    console.log(this.impuestos)
  }
  deleteImpuesto(ind){this.impuestos.splice(ind, 1);} */

  addImpuesto(){
    // this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    // console.log(this.impuestos)

    console.log('clickeado agregar impuesto');
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
    console.log('Lista de formularios ', forms.length, forms);
    forms.push(this.construirFormulario());
    console.log('Lista de formularios ', forms.length, forms);
  }
  deleteFormulario(ind: number){
    const forms= <FormArray>this.forma.get(['formularios']);
    console.log('Lista de formularios ', forms.length, forms);
    forms.removeAt(ind);
    console.log('Lista de formularios ', forms.length, forms);
  }

/*   addArticulosStock(){this.articulosStock.push({'nroArticulosStock':(this.articulosStock.length)});}
  deleteArticulosStock(ind){this.articulosStock.splice(ind, 1);} */

  addArticulosStock(){
    // console.log('clickeado agregar articulo a ', this.forma.controls.articulos as FormArray);
    // console.log('clickeado agregar articulo 2 a ', this.forma.controls.articulos as FormControl);
    const arts = this.forma.controls.articulos as FormArray;
    // console.log('arts: ', arts)
    arts.push(this.construirArticulo());

    console.log('agregado');

  }
  deleteArticulosStock(indice: number){
    const arts = this.forma.controls.articulos as FormArray;
    arts.removeAt(indice);
  }

  deleteCuentasBanc(indice: number){
    // this.cuentasBanc.splice(ind, 1);
    const ctas = this.forma.controls.cuentas as FormArray;
    ctas.removeAt(indice);
  }
  // addCuentaBanc(){this.cuentasBanc.push({'nroCuenta':(this.cuentasBanc.length)});}
  addCuentaBanc(){
    // ctas.push(this.construirCuentaBancaria());
    console.log('clickeado agregar cuenta');
    const ctas = this.forma.controls.cuentas as FormArray;
    ctas.push(this.FormBuilder.group({
        rcCbu: new FormControl('', Validators.required),
        rcTipo: new FormControl('', Validators.required),
        rcCuentaBancaria: new FormControl('', Validators.required),
        rcCodigoSucursal: new FormControl('', Validators.required)
      })
    );
    
      
  }


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
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarCategoriasBloqueo();
              });
            } else {
              if(this.cbData.dataset.length>0){
                this.catsBloqueoAll = this.cbData.dataset;
                console.log('obtenidos bloqueos', this.catsBloqueoAll);
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
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarFormularios();
              });
            } else {
              if(this.fData.dataset.length>0){
                this.formulariosAll = this.fData.dataset;
                console.log('obtenidos formularios', this.formulariosAll);
                //this.loading = false;

              } else {
                this.formulariosAll = null;
              }
            }
            //console.log(this.refContablesAll);
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
    //"e5dc7f36-31ba-acbf-8c72-5ba4042eec36"
    this._localidadesService.getPaises(this.provinciaFac.tg01_paises_id_c, this.token )
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
    this._localidadesService.getPaises(this.provinciaEnv.tg01_paises_id_c, this.token )
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
              console.log('respuesta lista de precios: ', this.lpData)
              if(this.lpData.dataset.length==1){
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
    console.log('buscando partida con id:')
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
              console.log('resultado consulta partida: ', this.ppData)
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
              if(this.rcData.dataset.length==1){
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

    this._tiposComprobanteService.getTipoOperacionPorIdTipoComprobante(this.forma.controls['idTipoComprobante'].value, this.token )
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
              console.log('resultado consulta partida: ', this.tcData)
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
  buscarArticulo(indice: number){
    const arts = this.forma.controls.articulos as FormArray;
    let id = arts.controls[indice].value['artID'];
    // this._articulosService.getArticulo(this.formaArticulo.controls['artID'].value, this.token )
    console.log('buscando articulo con: ', id);
    // this._articulosService.getArticulo(id , this.token )
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
        //console.log(dataRC);
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
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarArticulo(indice);
              });
            } else {
              if(this.aData.dataset.length>0){
                // this.articulo = this.aData.dataset[0];
                this.carticulo = this.aData.dataset[0];
                console.log('articulo encontrada: ', this.carticulo);
                console.log('nombre de ref: ', this.carticulo.name);
                
                //rellenar descripcion
                ((this.forma.controls.articulos as FormArray).
                  controls[indice] as FormGroup).
                    controls['artDesc'].setValue(this.carticulo.name);
                //this.loading = false;
              } else {
                // this.articulo = null;
                this.carticulo = null;
                console.log('no se encontro el articulo ' + id);
                
                //vaciar descripcion
                ((this.forma.controls.articulos as FormArray).
                  controls[indice] as FormGroup).
                    controls['artDesc'].setValue('');
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  //

  //todo cargar datos y buscar relacionados
  obtenerProveedor(){
    // this._articulosService.getArticulo(this.formaArticulo.controls['artID'].value, this.token )
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
            this._localidadesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.obtenerProveedor();
              });
            } else {
              if(this.provData.dataset.length>0){
                this.provCabecera = this.provData.dataset[0];
                console.log('proveedor encontrado: ', this.provCabecera);
                //this.loading = false;
              } else {
                this.provCabecera = null;
                console.log('no se encontro el proveedor ' + this.id);
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  //carga de datos


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
            console.log('existe localidad env salio por false: ', auxLocalidadEnv)
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
        "p_situacion_iva": this.forma.controls['sitIVA'].value, //"1", //id de consulta dinámica a tabla tg01_categoriasiva
        "p_cuit_c": this.forma.controls['cuit'].value,
        "p_cai"	: this.forma.controls['cai'].value, //CAI
        "p_fecha_vto_cai" : this.extraerFecha(<FormControl>this.forma.controls['fechaVtoCai']),//this.forma.controls['fechaVtoCai'].value,
        "p_cuit_exterior" : this.forma.controls['cuitExterior'].value,//todo ver qué es, abajo también
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
                console.log(dataL);
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
  }

  guardarDatosProveedor(idProveedor: string){
    //RELACION COMERCIAL
    (<FormArray>this.forma.controls.cuentas).controls.forEach( cuenta => {
       
      console.log(cuenta);
      let cuentaActual: FormGroup = <FormGroup>cuenta;
      console.log(cuentaActual.controls['rcCbu'].value, 
                  cuentaActual.controls['rcCuentaBancaria'].value, 
                  cuentaActual.controls['rcCodigoSucursal'].value);

      let jsbodyRC = {
        "Id_Proveedor": idProveedor, //Rid devuelto en el alta de proveedor
        "p_cbu": cuentaActual.controls['rcCbu'].value, //this.forma.controls['rcCbu'].value,
        "p_cuentabancaria": cuentaActual.controls['rcCuentaBancaria'].value, //this.forma.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": cuentaActual.controls['rcCodigoSucursal'].value //this.forma.controls['rcCodigoSucursal'].value
      }
      let jsonbodyRC= JSON.stringify(jsbodyRC);
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
                console.log(dataL);
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
        "p_imp_tipo" : impuestoActual.controls['tipo'].value, // id de tabla tg01_impuestos
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
                console.log(dataL);
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
                console.log(dataL);
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
                console.log(dataL);
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
              console.log(dataL);
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
      "p_fecha_vto_cai" : this.extraerFecha(<FormControl>this.forma.controls['fechaVtoCai']),
      "p_cuit_exterior" :this.forma.controls['cuitExterior'].value,//todo ver qué es, abajo también
      "p_id_impositivo" :this.forma.controls['idImpositivo'].value //id de consulta dinámica a tabla tg01_impuestos
    }
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
  }

  modificarRelacion(){
    //RELACION COMERCIAL
    let jsbodyRC = {
      "Id_Proveedor": this.id, //Rid devuelto en el alta de proveedor
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
      "p_imp_excenciones" : this.formaImpuesto.controls['exenciones'].value.toString(),//"false",
      "p_imp_fecha_comienzo_excencion" : this.formaImpuesto.controls['fechaDesde'].value, // → si es true
      "p_imp_fecha_caducidad_excencion" : this.formaImpuesto.controls['fechaHasta'].value,//  → si es true
      "p_imp_obs" :this.formaImpuesto.controls['observaciones'].value
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

  extraerFecha(control: FormControl){
    let auxFecha: string;
    if (control.value != null){
      let ano = control.value.getFullYear().toString();
      let mes = (control.value.getMonth()+1).toString();
      if(mes.length==1){mes="0"+mes};
      let dia = control.value.getDate().toString();
      if(dia.length==1){dia="0"+dia};
      auxFecha = ano+"-"+mes+"-"+dia;
      // console.log('Fecha extraida: '+ auxFecha);
      return auxFecha;
    }
    else{
      // console.log('control de fecha vacio o invalido: ', control);
      return null;
    }
  }
}
