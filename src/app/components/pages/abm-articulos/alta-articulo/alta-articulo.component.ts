import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Inject, Injectable  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators, FormsModule, FormBuilder, FormArray, NgControlStatus } from '@angular/forms';
import { getMatFormFieldMissingControlError, MatSnackBar } from '@angular/material';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { Proveedor } from 'src/app/interfaces/proveedor.interface';
import { Subscription, Observable, of } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { MonedasService } from 'src/app/services/i2t/monedas.service';
import { CategoriasBloqueoService } from 'src/app/services/i2t/cat-bloqueo.service';
import { AFIPInternoService } from 'src/app/services/i2t/afip.service';
import { UnidadMedidaService } from 'src/app/services/i2t/unidad-medida.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ArticulosService } from 'src/app/services/i2t/articulos.service';
import { ImageService } from 'src/app/services/i2t/image.service';
import { ProductoCategoria, Marca, AtributoArticulo, ValorAtributoArticulo, Deposito, DepostitoArticulo, ProveedorArticulo, ArticuloSustituto, FotoArticulo, cArticulo, datosArticulos, ArticuloHijo } from 'src/app/interfaces/articulo.interface';
import { UnidadMedida } from 'src/app/interfaces/unidad-medida.interface';

const ARTICULOS:any[] = [
  {'nroArticulo':0,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40},
  {'nroArticulo':1,'articulo':'Gomitas Mogul','unidadMedida':'Bolsa(s)','precioUnitario':35},
  {'nroArticulo':2,'articulo':'Chupetines Mr. Pops','unidadMedida':'Bolsa(s)','precioUnitario':50},
  {'nroArticulo':3,'articulo':'Alfajores Terrabusi','unidadMedida':'Caja(s)','precioUnitario':72},
  {'nroArticulo':4,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40}
];

var auxProvData,auxArtiData,auxUnidadData,auxGrupoData, auxMarcaData, auxDepData, auxInd:any;

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-alta-articulo',
  templateUrl: './alta-articulo.component.html',
  styleUrls: ['./alta-articulo.component.css']
})
export class AltaArticuloComponent implements OnInit {

  constArticulos = ARTICULOS;
  adjunto: any;
  urlImagen: any;
  indFoto: any = 0;

  // user:string='usuario1';
  // pass:string='password1'
  token: string;

  forma:FormGroup;
  id:any;
  loading: boolean;
  partesACargar: number = 8; //listas desplegables: 8
  partesCargadas: number;
  existe:boolean;

  fotos:any[]=[{'nroFoto':0},];
  proveedores:any[]=[{'nroProveedor':0},];
  depositos:any[]=[{'nroDeposito':0},];
  sustitutos:any[]=[{'nroSustituto':0},];
  artRelaciones:any[]=[{'nroArtRelacion':0},];
  umAlt:any[]=[{'nroUMAlt':0},];
  datosArticulos: datosArticulos[] = [];
  datosArt: any;
  auxRid:any;
  loginData: any;
  
  proveedorData: any;
  proveedor: Proveedor;
  grupo:ProductoCategoria;
  marca:Marca;
  deposito:Deposito;
  // artSust:ArticuloSustituto;
  artSust:cArticulo;

  mData: any;//monedas
  cbData:any; //categorias bloqueo
  grcaData:any;//grupo ref. contable
  aliData:any;//alicuotas
  ali2Data:any;
  umData:any;//unidades de medida
  artData:any;//articulos
  gData:any;//grupos
  marData:any;//marcas
  aaData:any;//atributos articulos
  vaaData:any;//valores de atributos articulos
  depData:any;//depositos
  respData:any;

  monedasAll:any[];
  catsBloqueoAll:any[];
  gruposRefContableArticuloAll:any[];
  alicuotasAll:any[];
  alicuotas2All:any[];
  unidadesMedidaAll:any[];
  atributosArticuloAll:AtributoArticulo[];
  valoresAtributosArticuloAll: any[] = [];
  obsValoresAtributos0: Observable<any[]>;
  obsValoresAtributos1: Observable<any[]>;
  obsValoresAtributos2: Observable<any[]>;
  depositosAll:DepostitoArticulo[];
  proveedoresAll:ProveedorArticulo[];
  sustitutosAll:ArticuloSustituto[];
  hijosAll:ArticuloHijo[];
  fotosAll:FotoArticulo[];

  estadosFotos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  estadosProveedores:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  estadosDepositos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
        modificados: [],
        eliminados: []};
  estadosArticulosSustitutos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};
  estadosArticulosHijos:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []};       
  // todo limpiar
  /* estadosUnidadesAlternativas:{
    nuevos: any[],
    modificados: any[],
    eliminados: any[]
  } = {nuevos: [],
       modificados: [],
       eliminados: []}; */  

  @ViewChild('codProv', { read: ElementRef}) elCodProv: any;
  @ViewChild('codArtProv', { read: ElementRef}) elcodArtProv: any;
  @ViewChild('codArtSust', { read: ElementRef}) elcodArtSust: any;
  @ViewChild('codArtHijo', { read: ElementRef}) elcodArtHijo: any;

  suscripcionConsDin: Subscription;
  // resultadoidGrupo: any;
  
  constructor(private route:ActivatedRoute,
              public snackBar: MatSnackBar,
              private FormBuilder: FormBuilder,
              public ngxSmartModalService: NgxSmartModalService,
              private _proveedorService: ProveedoresService,
              private _articulosService: ArticulosService,
              private _monedaService: MonedasService,
              private _categoriasBloqueoService: CategoriasBloqueoService,
              private _AFIPInternoService: AFIPInternoService,
              private _unidadMedidaService: UnidadMedidaService,
              private _imageService: ImageService,
              private ref: ChangeDetectorRef,
              @Inject(SESSION_STORAGE) private storage: StorageService
              ) {
    
    console.log(localStorage.getItem (TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem('TOKEN');            
    
    this.loading = true;
    this.partesCargadas = 0;  

    this.forma = this.FormBuilder.group({
      fecha_creacion: new FormControl(),
      tipo: new FormControl(1,Validators.required),
      nroArticulo: new FormControl(null,Validators.required),
      descripcion: new FormControl(null,Validators.required),
      codigoAlternativo: new FormControl(),
      codigoBarra: new FormControl(),
      idGrupo: new FormControl(null,Validators.required),
      nombreGrupo: new FormControl(),
      idTipoArticulo: new FormControl(null,Validators.required),
      procedencia: new FormControl(null,Validators.required),
      propio: new FormControl(),
      idMarca: new FormControl(),
      nombreMarca: new FormControl(),
      idCampo1: new FormControl(),
      idCampo2: new FormControl(),
      idCampo3: new FormControl(),
      estado: new FormControl(null,Validators.required),
      categoria_bloqueo: new FormControl(),
      obsRegistroAutoVta: new FormControl(),
      obsRegistroAutoCpa: new FormControl(),
      obsIngresoVta: new FormControl(),
      obsIngresoCpa: new FormControl(),
      obsAuditoriaVta: new FormControl(),
      obsAuditoriaCpa: new FormControl(),
      obsImprimeVta: new FormControl(),
      categoriaVenta: new FormControl(),
      categoriaCompra: new FormControl(),
      categoriaInventario: new FormControl(),
        //fotos
        fotos: this.FormBuilder.array([]),
      //comprasyventas
      precioUltCompra: new FormControl(),
      fechaUltCompra: new FormControl(),
      idMonedaUltCompra: new FormControl(),
      cantidadOptimaDeCompra: new FormControl(),
      precioUltVenta: new FormControl(),
      fechaUltVenta: new FormControl(),
      idMonedaUltVenta: new FormControl(),
        //proveedor
        proveedores: this.FormBuilder.array([]),
        /* proveedor: new FormControl(null,Validators.required,this.existeProveedor),
        razonSocial: new FormControl(),
        artDeProveedor: new FormControl(null,Validators.required,this.existeArticulo),
        artCodBarra: new FormControl(), */
      //Impositivo
      idGrupoRefContArticulo: new FormControl(),
      idAlicuotaIva: new FormControl(),
      idAlicuotaImpInt: new FormControl(),
      IIAreaAplicacionAlicuota: new FormControl(),
      IIAreaAplicacionImporteFijo: new FormControl(),
      IncorporarIIalCosto: new FormControl(),
      impuestoInternoFijo: new FormControl(),
      //Lotes y Series
      gestionDespacho: new FormControl(),
      gestionLote: new FormControl(),
      gestionSerie: new FormControl(),
      //Stock
      administraStock: new FormControl(),
      stockIdeal: new FormControl(),
      stockMaximo: new FormControl(),
      stockReposicion: new FormControl(),
        //depositos
        depositos: this.FormBuilder.array([]),
        //Productos sustitutos
        articulosSustitutos: this.FormBuilder.array([]),
        articulosRelacionados: this.FormBuilder.array([]),
        // artSust: new FormControl(),
        //Productos Relacionados
        articulosHijos: this.FormBuilder.array([]),
        // artHijo: new FormControl(),
      //Datos Dimensiones
      Dimensiones: new FormControl(),
      Pesable: new FormControl(),
      Pesable_Estandar: new FormControl(),
      unidadMedidaBase: new FormControl(),
      aplicaConversionUnidadPrecio: new FormControl(),
      unidadMedidaLP: new FormControl(),
      largo: new FormControl(),
      ancho: new FormControl(),
      profundidad: new FormControl(),
      m3: new FormControl(),
        //Unidades de medida alternativas
        // unidadesAlternativas: this.FormBuilder.array([]),
        umCompras: new FormControl(),
          umComprasDesc: new FormControl(),
        umOCompra: new FormControl(),
          umOCompraDesc: new FormControl(),
        umPCompra: new FormControl(),
          umPCompraDesc: new FormControl(),
        umPVenta: new FormControl(),
          umPVentaDesc: new FormControl(),
        umVentas: new FormControl(),
          umVentasDesc: new FormControl(),

      /*'articulo': new FormControl('',Validators.required),
      'unidadMedida': new FormControl('',Validators.required),
      'precioUnitario': new FormControl('',Validators.required)*/
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;
      console.log('viendo parametros por url');
      if( this.id !== "nuevo" ){
        /* for( let aux in this.constArticulos ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['nroArticulo'].setValue(this.id);
            /*this.forma.controls['articulo'].setValue(this.constArticulos[this.id].articulo);
            this.forma.controls['unidadMedida'].setValue(this.constArticulos[this.id].unidadMedida);
            this.forma.controls['precioUnitario'].setValue(this.constArticulos[this.id].precioUnitario);/
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['nroArticulo'].disable();
          /*this.forma.controls['articulo'].disable();
          this.forma.controls['unidadMedida'].disable();
          this.forma.controls['precioUnitario'].disable();*
        }
      } */
      console.log('llamando a buscar articulo');
      this.auxRid = this.id;
        this.buscarArticulo();
      }
    });

    //#region suscripciones
    //todo revisar
    //suscripciones para rellenar datos después 
    /* this.forma.controls['proveedor'].valueChanges.subscribe(() => {
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
    */
} 
  //#endregion suscripciones

//#region FormArrays
construirProveedor(){
  return new FormGroup({ 
    'idProveedor': new FormControl(null,Validators.required,this.existeProveedor),
    'razonSocial': new FormControl(),
    'artCodigoInt': new FormControl(),
    // 'artDeProveedor': new FormControl(null,Validators.required,this.existeArticulo),
    'artDeProveedor': new FormControl(),
    'artDesc': new FormControl(),
    'artCodBarra': new FormControl(),
    'idMonedaUltCompra': new FormControl(),
    'precioUltCompra': new FormControl(),
    'fechaUltCompra': new FormControl(),
    'esPorDefecto': new FormControl(),
    'date_entered': new FormControl(),
    'date_modified': new FormControl(),
    'created_by': new FormControl(),
    'modified_user_id': new FormControl(),
    // 'description': new FormControl(),
    'deleted': new FormControl(),
    'assigned_user_id': new FormControl(),
    'currency_id': new FormControl(),
    'aos_products_id_c': new FormControl(),
    'account_id_c': new FormControl(),
  });
}

construirArticuloSust(){
  return new FormGroup({ 
    'idArtSust': new FormControl(null,Validators.required,this.existeArticulo),//id
    'artDesc': new FormControl(),//name
    'umArticulo': new FormControl(),//tg01_unidadmedida_id_c
    'umSustituto': new FormControl(),//tg01_unidadmedida_id1_c
    'tipoSustituto': new FormControl(),
    'idsustituto': new FormControl(),
    'cantidad': new FormControl(null, Validators.required),
    'assigned_user_id': new FormControl(),
    'aos_products_id_c': new FormControl(),
    'aos_products_id1_c': new FormControl(),
    // 'tg01_unidadmedida_id_c': new FormControl(),
    // 'tg01_unidadmedida_id1_c': new FormControl(),
    // 'IIAreaAplicacionImporteFijo': new FormControl(),
    'date_entered': new FormControl(),
    'created_by': new FormControl(),
    'date_modified': new FormControl(),
    'modified_user_id': new FormControl(),
    'description': new FormControl(),
    'deleted': new FormControl(),
    // 'idsustituto': new FormControl(),
    // 'tiposustituto': new FormControl(),
  });
}

construirDeposito(){
  return new FormGroup({
    'id': new FormControl(),
    'name': new FormControl(),
    'date_entered': new FormControl(),
    'date_modified': new FormControl(),
    'modified_user_id': new FormControl(),
    'created_by': new FormControl(),
    'description': new FormControl(),
    'deleted': new FormControl(),
    'assigned_user_id': new FormControl(),
    'aos_products_id_c': new FormControl(),
    'tg01_depositos_id_c': new FormControl(null, Validators.required),
    'stockideal': new FormControl(null, Validators.required),
    'stockmaximo': new FormControl(null, Validators.required),
    'stockreposicion': new FormControl(null, Validators.required),
  });
}

construirArticuloHijo(){
  return new FormGroup({ 
    'id_tabla_relaciones': new FormControl(),

    'idArtHijo': new FormControl(null,Validators.required,this.existeArticulo),
    'artDesc': new FormControl(),
    'cantidad': new FormControl(null, Validators.required),

    'fecha_creacion': new FormControl(),
    'fecha_modificacion': new FormControl(),
    'id_usuario_creador': new FormControl(),
    'id_usuario_modificador': new FormControl(),
    'id_usuario_asignado': new FormControl(),
    'descripcion': new FormControl(),
    'id_articulo_padre': new FormControl(),
  });
}

construirUnidadMedida(){
  return new FormGroup({ 
    'UMAlt': new FormControl(null,Validators.required),
    /* 'idUMAlt': new FormControl(null,Validators.required,this.existeUnidad),
    'UMAltDesc': new FormControl(), */
  });
}

construirFoto(){
  return new FormGroup({
    'id': new FormControl(),
    'name': new FormControl(null,Validators.required),
    'date_entered': new FormControl(),
    'date_modified': new FormControl(),
    'modified_user_id': new FormControl(),
    'created_by': new FormControl(),
    'description': new FormControl(),
    'deleted': new FormControl(),
    'assigned_user_id': new FormControl(),
    'aos_products_id_c': new FormControl(),
    'foto': new FormControl(null,Validators.required), //"www.i2t-sa.com/fotoJcabreraEDIT"
  })
}

//#endregion FormArrays

  ngOnInit() {
    this.buscarMonedas();
    this.buscarGruposRef();
    this.buscarCategoriasBloqueo();
    this.buscarAlicuotas();
    this.buscarAlicuotas2();
    this.buscarUnidades();
    this.buscarAtributos();
      //this.buscarValoresAtributos();
    this.loading = false;
  }

  //#region botonesArray

  addFoto(){
    const fotos = this.forma.controls.fotos as FormArray;
    fotos.push(this.construirFoto());
  }
  deleteFoto(ind){
    const fotos = this.forma.controls.fotos as FormArray;
    console.log('fa fotos a actualizar: ', fotos)
    let foto = <FormGroup>fotos.controls[ind];
    console.log('fg foto a borrar: ', foto)
    if (foto.controls['date_entered'].value != null){
      this.estadosFotos.eliminados.push(foto.controls['foto'].value);
      // this.estadosProveedores.eliminados.push({id: foto.controls['id'].value, moneda: foto.controls['idMonedaUltCompra'].value});

    } 
    fotos.removeAt(ind);
    console.log('lista de proveedores eliminados: ', this.estadosFotos.eliminados)
  }

  addProveedor(){
    const provs = this.forma.controls.proveedores as FormArray;
    provs.push(this.construirProveedor());
  }
  deleteProveedor(ind){
    const provs = this.forma.controls.proveedores as FormArray;
    console.log('fa proveedores a actualizar: ', provs)
    let prov = <FormGroup>provs.controls[ind];
    console.log('fg proveedor a borrar: ', prov)
    if (prov.controls['date_entered'].value != null){
      // this.estadosProveedores.eliminados.push(prov.controls['idProveedor'].value);
      this.estadosProveedores.eliminados.push({id: prov.controls['idProveedor'].value, 
                                               moneda: prov.controls['idMonedaUltCompra'].value});

    } 
    provs.removeAt(ind);
    console.log('lista de proveedores eliminados: ', this.estadosProveedores.eliminados)
  }

  addSustituto(){
    const arts = this.forma.controls.articulosSustitutos as FormArray;
    arts.push(this.construirArticuloSust());
  }
  deleteSustituto(ind){
    const arts = this.forma.controls.articulosSustitutos as FormArray;
    let art = <FormGroup>arts.controls[ind];
    if (art.controls['date_entered'].value != null){
      // this.estadosArticulosSustitutos.eliminados.push(art.controls['idArtSust'].value);
      this.estadosArticulosSustitutos.eliminados.push({id: art.controls['idArtSust'].value, 
                                                       um: art.controls['umArticulo'].value,
                                                       um2:art.controls['umSustituto'].value });
    } 
    arts.removeAt(ind);
    console.log('lista de sustitutos eliminados: ', this.estadosArticulosSustitutos.eliminados)
  }

  addArtRelacion(){
    const arts = this.forma.controls.articulosHijos as FormArray;
    arts.push(this.construirArticuloHijo());
    console.log('array de articulos hijos: ', arts)
  }
  deleteArtRelacion(ind){
    const arts = this.forma.controls.articulosHijos as FormArray;
    let art = <FormGroup>arts.controls[ind];
    if (art.controls['id_tabla_relaciones'].value != null){
      this.estadosArticulosHijos.eliminados.push(art.controls['id_tabla_relaciones'].value);
    }
    arts.removeAt(ind);
    console.log('lista de hijos eliminados: ', this.estadosArticulosHijos.eliminados)
  }

  addDeposito(){
    const deps = this.forma.controls.depositos as FormArray;
    deps.push(this.construirDeposito());
  }
  deleteDeposito(ind){
    const deps = this.forma.controls.depositos as FormArray;
    let dep = <FormGroup>deps.controls[ind];
    if (dep.controls['date_entered'].value != null){
      // this.estadosDepositos.eliminados.push(dep.controls['id'].value);
      this.estadosDepositos.eliminados.push({id: dep.controls['id'].value, 
                                             deposito: dep.controls['tg01_depositos_id_c'].value});
    } 
    deps.removeAt(ind);
    console.log('lista de depositos eliminados: ', this.estadosDepositos.eliminados)
  }
  //#endregion botonesArray

  //#region datosCombobox
  //listas desplegables
  buscarMonedas(){
    console.log('buscando monedas con token: ', this.token);
    this._monedaService.getMonedas(this.token )
      .subscribe( dataM => {
        // console.log(dataM);
          this.mData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          console.log('datos para lista de monedas: ', this.mData);
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

  buscarCategoriasBloqueo(){
    this._categoriasBloqueoService.getCategoriasDeUnTipo('A', this.token )
      .subscribe( data => {
          this.cbData = data;
          console.log('datos para lista de cats bloqueo: ', this.cbData);
          if(this.cbData.returnset[0].RCode=="-6003"){
            //token invalido
            this.catsBloqueoAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.cbData.dataset.length>0){
              this.catsBloqueoAll = this.cbData.dataset;
              this.partesCargadas = this.partesCargadas +1;
            } else {
              this.catsBloqueoAll = null;
            }
          }
    });
  }

  buscarGruposRef(){
    this._AFIPInternoService.getGruposRefContable( this.token )
      .subscribe( data => {
          this.grcaData = data;
          console.log('datos para lista de grupos: ', this.grcaData);
          if(this.grcaData.returnset[0].RCode=="-6003"){
            //token invalido
            this.gruposRefContableArticuloAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.grcaData.dataset.length>0){
              this.gruposRefContableArticuloAll = this.grcaData.dataset;
              this.partesCargadas = this.partesCargadas +1;
            } else {
              this.gruposRefContableArticuloAll = null;
            }
          }
    });
  }

  buscarAlicuotas(){
    this._AFIPInternoService.getAlicuotasPorTipo('I', this.token )
      .subscribe( data => {
          this.aliData = data;
          console.log('datos para lista de alicuotas: ', this.aliData);
          if(this.aliData.returnset[0].RCode=="-6003"){
            //token invalido
            this.alicuotasAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.aliData.dataset.length>0){
              this.alicuotasAll = this.aliData.dataset;
              this.partesCargadas = this.partesCargadas +1;
            } else {
              this.alicuotasAll = null;
            }
          }
    });
  }

  buscarAlicuotas2(){
    this._AFIPInternoService.getAlicuotasPorTipo('O', this.token )
      .subscribe( data => {
          this.ali2Data = data;
          console.log('datos para lista de alicuotas 2: ', this.ali2Data);
          if(this.ali2Data.returnset[0].RCode=="-6003"){
            //token invalido
            this.alicuotas2All = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.ali2Data.dataset.length>0){
              this.alicuotas2All = this.ali2Data.dataset;
              this.partesCargadas = this.partesCargadas +1;
            } else {
              this.alicuotas2All = null;
            }
          }
    });
  }

  buscarUnidades(){
    //todo agregar ?deleted=0 si agregan el atributo en api/tg01_unidadmedida
    this._unidadMedidaService.getUnidadMedida(this.token )
      .subscribe( data => {
          this.umData = data;
          console.log('datos para lista de unidades: ', this.umData);
          if(this.umData.returnset[0].RCode=="-6003"){
            //token invalido
            this.unidadesMedidaAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.umData.dataset.length>0){
              this.unidadesMedidaAll = this.umData.dataset;
              this.partesCargadas = this.partesCargadas +1;
            } else {
              this.unidadesMedidaAll = null;
            }
          }
    });
  }
  
  buscarAtributos(){
    this._articulosService.getAtributos(this.token )
      .subscribe( data => {
          this.aaData = data;
          console.log('datos para lista de atributos: ', this.aaData);
          if(this.aaData.returnset[0].RCode=="-6003"){
            //token invalido
            this.atributosArticuloAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            if(this.aaData.dataset.length>0){
              this.atributosArticuloAll = this.aaData.dataset;
              this.partesCargadas = this.partesCargadas +1;
              // this.buscarValoresAtributos();
            } else {
              this.atributosArticuloAll = null;
            }
          }
    });
  }
  
  buscarValoresAtributos(){
    //0,1,2
    //idCampo1,idCampo2,idCampo3
    
/* 
    let cantidad = this.atributosArticuloAll.length;
    if (cantidad != 3){
      for (let index = cantidad; index < 3; index++) {
        // const element = array[index];
        let campo = this.forma.get('campo'+index) as FormControl;
        console.log('formcontrol: ', campo);
        
      }
    }
     */
    
    this.habilitarAtributos();

    this.atributosArticuloAll.forEach(atributo => {
      //atributo.idatributo comienza en 1
      console.log('llenando lista de atributos para: ', atributo);
      let indice = atributo.idatributo-1;
      this._articulosService.getValoresAtributo( atributo.idatributo.toString(), this.token )
        .subscribe( data => {
            this.vaaData = data;
            if(this.vaaData.returnset[0].RCode=="-6003"){
              //token invalido
              this.valoresAtributosArticuloAll[indice] = null;
              this.forma.disable();
              this.openSnackBar('Sesión expirada.')
            } else {
              if(this.vaaData.dataset.length>0){
                this.valoresAtributosArticuloAll[indice] = this.vaaData.dataset;
                // this['obsValoresAtributos'+indice] = new Observable(this.valoresAtributosArticuloAll[indice]);
                this['obsValoresAtributos'+indice] = of(this.valoresAtributosArticuloAll[indice] as any);
                // this.forma.controls['idCampo'+atributo].setValue(this.datosArticulos[0].id_atributosarticulos);

                // id_atributosarticulos,id_atributosarticulos_1,id_atributosarticulos_2
                //cargar el valor del atributo en su control correspondiente
                  let numero = atributo.idatributo;
                  let apendice: string;
                  if (numero == 1){
                    apendice = '';
                  }
                  else{
                    apendice = '_'+indice.toString();
                  }
                  console.log('llenando atributo con datos: ', numero, atributo.idatributo, apendice, 'id_atributosarticulos'+apendice);
                  let valor = this.datosArticulos[0]['id_atributosarticulos'+apendice];
                  console.log('valor para insertar: ', valor)
                  if (valor != null){
                    this.forma.controls['idCampo'+atributo.idatributo].setValue(valor);
                  }
                //
              } else {
                this.valoresAtributosArticuloAll[indice] = null;
              }
            }
          });
        });
        this.partesCargadas = this.partesCargadas +1; 
  }
  //#endregion datosCombobox

        // this.partesACargar = this.partesACargar + 6; //principal + 5 arrays
  //#region cargaDatos
  buscarArticulo(){
    console.log('ejecutando buscarArticulo con id:, token: ', this.id, this.token);

    this._articulosService.getArticulo(this.id, this.token)
      .subscribe( respA => {
        console.log('obtenida respuesta de buscarArticulo');
        console.log(' respuesta de buscar articulo: ', respA)
        console.log(' id de articulo buscado: ', this.id)
        this.datosArt = respA;
        if(this.datosArt.returnset[0].RCode=="-6003"){
          //token invalido
          this.datosArticulos = null;
          this.forma.disable();
          this.openSnackBar('Sesión expirada.')
        } else {
          console.log('Datos de articulo: ', this.datosArticulos[0])
          if(this.datosArt.dataset.length>0){
            this.datosArticulos = this.datosArt.dataset
            console.log('articulo recuperado: ', this.datosArticulos);
            this.forma.controls['nroArticulo'].setValue(this.datosArticulos[0].part_number);
            this.forma.controls['descripcion'].setValue(this.datosArticulos[0].nombre_producto);
            this.forma.controls['codigoAlternativo'].setValue(this.datosArticulos[0].codigo_alternativo);
            this.forma.controls['codigoBarra'].setValue(this.datosArticulos[0].codigobarra);
            this.forma.controls['idTipoArticulo'].setValue(this.datosArticulos[0].categoriaproducto);
            this.forma.controls['estado'].setValue(this.datosArticulos[0].estado);
            
            this.forma.controls['fecha_creacion'].setValue(this.datosArticulos[0].fecha_creacion);

            this.forma.controls['tipo'].setValue(this.datosArticulos[0].tipo);
            this.forma.controls['idGrupoRefContArticulo'].setValue(this.datosArticulos[0].id_gruporefcontablearticulo)
            this.forma.controls['procedencia'].setValue(this.datosArticulos[0].procedencia);
            this.forma.controls['categoria_bloqueo'].setValue(this.datosArticulos[0].id_categoriabloqueo);
            this.forma.controls['idMonedaUltCompra'].setValue(this.datosArticulos[0].id_monedas);
            this.forma.controls['idMonedaUltVenta'].setValue(this.datosArticulos[0].id_monedas_1);
            this.forma.controls['idAlicuotaIva'].setValue(this.datosArticulos[0].id_alicuotas);
            this.forma.controls['idAlicuotaImpInt'].setValue(this.datosArticulos[0].id_alicuotas_1);
            this.forma.controls['Pesable'].setValue(this.datosArticulos[0].pesable);

            this.forma.controls['idGrupo'].setValue(this.datosArticulos[0].categoriaproducto);
            this.forma.controls['idMarca'].setValue(this.datosArticulos[0].id_marcas);
            
            this.forma.controls['categoriaVenta'].setValue(this.datosArticulos[0].categoriaventa == '0' ? false : true);
            this.forma.controls['categoriaInventario'].setValue(this.datosArticulos[0].categoriainventario == '0' ? false : true);
            this.forma.controls['categoriaCompra'].setValue(this.datosArticulos[0].categoriacompra == '0' ? false : true);

            this.forma.controls['gestionDespacho'].setValue(this.datosArticulos[0].gestiondespacho == '0' ? false : true);
            this.forma.controls['gestionLote'].setValue(this.datosArticulos[0].gestionlote == '0' ? false : true);
            this.forma.controls['gestionSerie'].setValue(this.datosArticulos[0].gestionserie == '0' ? false : true);
            
            this.forma.controls['administraStock'].setValue(this.datosArticulos[0].administrastock == '0' ? false : true);
            
            //todo descomentar cuando lo agreguen
            // this.forma.controls['IncorporarIIalCosto'].setValue(this.datosArticulos[0].incorporaCosto == '0' ? false : true);
            
            this.forma.controls['obsRegistroAutoVta'].setValue(this.datosArticulos[0].obsregistroautovta == '0' ? false : true);
            this.forma.controls['obsRegistroAutoCpa'].setValue(this.datosArticulos[0].obsregistroautocpa == '0' ? false : true);
            this.forma.controls['obsIngresoVta'].setValue(this.datosArticulos[0].obsingresovta == '0' ? false : true);
            this.forma.controls['obsIngresoCpa'].setValue(this.datosArticulos[0].obsingresocpa == '0' ? false : true);
            this.forma.controls['obsImprimeVta'].setValue(this.datosArticulos[0].obsimprimevta == '0' ? false : true);
            this.forma.controls['obsAuditoriaVta'].setValue(this.datosArticulos[0].obsauditoriavta == '0' ? false : true);
            this.forma.controls['obsAuditoriaCpa'].setValue(this.datosArticulos[0].obsauditoriacpa == '0' ? false : true);

            this.forma.controls['unidadMedidaBase'].setValue(this.datosArticulos[0].id_unidadmedida);
            this.forma.controls['unidadMedidaLP'].setValue(this.datosArticulos[0].id_unidadmedida_1);
            this.forma.controls['umCompras'].setValue(this.datosArticulos[0].id_unidadmedida_2);
            this.forma.controls['umOCompra'].setValue(this.datosArticulos[0].id_unidadmedida_3);
            this.forma.controls['umPCompra'].setValue(this.datosArticulos[0].id_unidadmedida_4);
            this.forma.controls['umVentas'].setValue(this.datosArticulos[0].id_unidadmedida_5);
            this.forma.controls['umPVenta'].setValue(this.datosArticulos[0].id_unidadmedida_6);
            
            this.forma.controls['Dimensiones'].setValue(this.datosArticulos[0].dimensiones);
            this.forma.controls['Pesable_Estandar'].setValue(this.datosArticulos[0].pesable_estandar);
            this.forma.controls['largo'].setValue(this.datosArticulos[0].largo);
            this.forma.controls['ancho'].setValue(this.datosArticulos[0].ancho);
            this.forma.controls['profundidad'].setValue(this.datosArticulos[0].profundo);
            this.forma.controls['m3'].setValue(this.datosArticulos[0].m3);

            this.forma.controls['precioUltCompra'].setValue(this.datosArticulos[0].precioultcompra);
            this.forma.controls['fechaUltCompra'].setValue(this.nuevaFecha(this.datosArticulos[0].fechaultcompra));
            this.forma.controls['cantidadOptimaDeCompra'].setValue(this.datosArticulos[0].cantidadoptimadecompra);
            this.forma.controls['precioUltVenta'].setValue(this.datosArticulos[0].precioultventa);
            this.forma.controls['fechaUltVenta'].setValue(this.nuevaFecha(this.datosArticulos[0].fechaultventa));
            this.forma.controls['impuestoInternoFijo'].setValue(this.datosArticulos[0].impuestoInternoFijo);
            
            //todo revisar
              this.forma.controls['stockIdeal'].setValue(this.datosArticulos[0].stockideal);
              this.forma.controls['stockMaximo'].setValue(this.datosArticulos[0].stockmaximo);
              this.forma.controls['stockReposicion'].setValue(this.datosArticulos[0].stockreposicion);

            this.forma.controls['IIAreaAplicacionAlicuota'].setValue(this.datosArticulos[0].areaAplicacionAlicuota);
            this.forma.controls['IIAreaAplicacionImporteFijo'].setValue(this.datosArticulos[0].areaAplicacionImporteFijo);

            setTimeout(() => {
              this.buscarGrupo();
              this.buscarMarca();
              this.buscarUMs();
              this.obtenerDatosArrays();
              this.buscarValoresAtributos();
            });

            this.partesACargar = this.partesACargar + 6; //principal + 5 arrays
            this.partesCargadas = this.partesCargadas +1;

          }
          else{
            this.datosArticulos = null;
            this.forma.disable();
            this.openSnackBar('El artículo no existe.')
          }
        }
      })
      
    // this.obtenerDatosArrays();
  }
  obtenerDatosArrays(){
    console.log(' ejecutando obtenerDatosArrays');
    this.forma.controls.proveedores.reset();
    this.forma.controls.depositos.reset();
    this.forma.controls.articulosSustitutos.reset();
    this.forma.controls.articulosHijos.reset();
    this.forma.controls.fotos.reset();
    // cambiado por una cantidad determinada
    // this.forma.controls.unidadesAlternativas.reset();
    
    //cargar datos de fotos
    this._articulosService.getFotos(this.auxRid , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.fotosAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de fotos asociadas: ', this.respData)
            this.partesCargadas = this.partesCargadas +1;
            if(this.respData.dataset.length>0){
              this.fotosAll = this.respData.dataset;
              let index = 0;
              
              console.log('fotos recuperadas: ', this.fotosAll)
              this.fotosAll.forEach(foto => {
                console.log('se va a armar el formgroup para foto: ', foto)
                this.addFoto();
                console.log('foto: ' ,this.forma.get(['fotos', index]));
                console.log('id foto: ',(this.forma.get(['fotos', index])).value['id']);
                console.log('depsoito como formgroup: ', <FormGroup>this.forma.get(['fotos', index]))
                let fgFoto: FormGroup = <FormGroup>this.forma.get(['fotos', index]);
                fgFoto.controls['id'].setValue(foto.id);
                fgFoto.controls['name'].setValue(foto.name);
                fgFoto.controls['date_entered'].setValue(foto.date_entered);
                fgFoto.controls['date_modified'].setValue(foto.date_modified);
                fgFoto.controls['modified_user_id'].setValue(foto.modified_user_id);
                fgFoto.controls['created_by'].setValue(foto.created_by);
                fgFoto.controls['description'].setValue(foto.description);
                fgFoto.controls['deleted'].setValue(foto.deleted);
                fgFoto.controls['assigned_user_id'].setValue(foto.assigned_user_id);
                fgFoto.controls['aos_products_id_c'].setValue(foto.aos_products_id_c);
                fgFoto.controls['foto'].setValue(foto.foto);

                index = index +1;
              });
            }
            else{
              console.log('No se encontraron fotos.')
            }
          }
    });
    //cargar datos de depositos
    this._articulosService.getDepositosArticulo(this.auxRid , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.depositosAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de depositos asociadas: ', this.respData)
            this.partesCargadas = this.partesCargadas +1;
            if(this.respData.dataset.length>0){
              this.depositosAll = this.respData.dataset;
              let index = 0;
              this.forma.controls['administraStock'].setValue(true);
              
              console.log('depositos recuperadas: ', this.depositosAll)
              this.depositosAll.forEach(deposito => {
                console.log('se va a armar el formgroup para deposito: ', deposito)
                this.addDeposito();
                console.log('deposito: ' ,this.forma.get(['depositos', index]));
                console.log('id deposito: ',(this.forma.get(['depositos', index])).value['id']);
                console.log('depsoito como formgroup: ', <FormGroup>this.forma.get(['depositos', index]))
                let fgDeposito: FormGroup = <FormGroup>this.forma.get(['depositos', index]);
                fgDeposito.controls['id'].setValue(deposito.id);
                fgDeposito.controls['name'].setValue(deposito.name);
                fgDeposito.controls['date_entered'].setValue(deposito.date_entered);
                fgDeposito.controls['date_modified'].setValue(deposito.date_modified);
                fgDeposito.controls['modified_user_id'].setValue(deposito.modified_user_id);
                fgDeposito.controls['created_by'].setValue(deposito.created_by);
                fgDeposito.controls['description'].setValue(deposito.description);
                fgDeposito.controls['deleted'].setValue(deposito.deleted);
                fgDeposito.controls['assigned_user_id'].setValue(deposito.assigned_user_id);
                fgDeposito.controls['aos_products_id_c'].setValue(deposito.aos_products_id_c);
                fgDeposito.controls['tg01_depositos_id_c'].setValue(deposito.tg01_depositos_id_c);
                fgDeposito.controls['stockideal'].setValue(deposito.stockideal);
                fgDeposito.controls['stockmaximo'].setValue(deposito.stockmaximo);
                fgDeposito.controls['stockreposicion'].setValue(deposito.stockreposicion);
                index = index +1;
              });
            }
            else{
              this.forma.controls['administraStock'].setValue(false);
            }
          }
    });
    //cargar datos de proveedores
    this._articulosService.getProveedores(this.auxRid , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.proveedoresAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de proveedores asociadas: ', this.respData)
            this.partesCargadas = this.partesCargadas +1;
            if(this.respData.dataset.length>0){
              this.proveedoresAll = this.respData.dataset;
              let index = 0;
              console.log('proveedores recuperadas: ', this.proveedoresAll)
              this.proveedoresAll.forEach(proveedor => {
                console.log('se va a armar el formgroup para proveedor: ', proveedor)
                this.addProveedor();
                console.log('proveedor: ' ,this.forma.get(['proveedores', index]));
                console.log('id proveedor: ',(this.forma.get(['proveedores', index])).value['id']);
                console.log('proveedor como formgroup: ', <FormGroup>this.forma.get(['proveedores', index]))
                let fgProveedor: FormGroup = <FormGroup>this.forma.get(['proveedores', index]);
                fgProveedor.controls['idProveedor'].setValue(proveedor.id);
                fgProveedor.controls['razonSocial'].setValue(proveedor.name);
                if ((proveedor.name == null)||(proveedor.name == "null")){
                  this.buscarProveedor(index);
                }
                fgProveedor.controls['date_entered'].setValue(proveedor.date_entered);
                fgProveedor.controls['date_modified'].setValue(proveedor.date_modified);
                fgProveedor.controls['modified_user_id'].setValue(proveedor.modified_user_id);
                fgProveedor.controls['created_by'].setValue(proveedor.created_by);
                // fgProveedor.controls['description'].setValue(proveedor.description);
                // if ((proveedor.description == null)||(proveedor.description == "null")){
                //   this.buscarArtProveedor(index);
                // }
                fgProveedor.controls['deleted'].setValue(proveedor.deleted);
                fgProveedor.controls['assigned_user_id'].setValue(proveedor.assigned_user_id);
                fgProveedor.controls['artDeProveedor'].setValue(proveedor.aos_products_id_c);
                // fgProveedor.controls['artCodigoInt'].setValue(proveedor.codigo__);
                fgProveedor.controls['account_id_c'].setValue(proveedor.account_id_c);//id objeto proveedor
                fgProveedor.controls['artCodBarra'].setValue(proveedor.codigobarra);
                fgProveedor.controls['idMonedaUltCompra'].setValue(proveedor.tg01_monedas_id_c);
                fgProveedor.controls['precioUltCompra'].setValue(proveedor.precioultimacompra);
                fgProveedor.controls['fechaUltCompra'].setValue(this.nuevaFecha(proveedor.ultimacompra));
                fgProveedor.controls['esPorDefecto'].setValue(proveedor.pordefecto);
                index = index +1;              
              });
            }
          }
    });
    //cargar datos de articulos sustitutos
    this._articulosService.getProductosSustitutos(this.auxRid , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.sustitutosAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de sustitutos asociadas: ', this.respData)
            this.partesCargadas = this.partesCargadas +1;
            if(this.respData.dataset.length>0){
              this.sustitutosAll = this.respData.dataset;
              let index = 0;
              console.log('sustitutos recuperadas: ', this.sustitutosAll)
              this.sustitutosAll.forEach(sustituto => {
                console.log('se va a armar el formgroup para: ', sustituto)
                this.addSustituto();
                console.log('sustituto: ' ,this.forma.get(['articulosSustitutos', index]));
                console.log('id sustituto: ',(this.forma.get(['articulosSustitutos', index])).value['id']);
                console.log('sustituto como formgroup: ', <FormGroup>this.forma.get(['articulosSustitutos', index]))
                let fgSustituto: FormGroup = <FormGroup>this.forma.get(['articulosSustitutos', index]);
                fgSustituto.controls['idArtSust'].setValue(sustituto.id);
                fgSustituto.controls['artDesc'].setValue(sustituto.name);
                fgSustituto.controls['date_entered'].setValue(sustituto.date_entered);
                fgSustituto.controls['date_modified'].setValue(sustituto.date_modified);
                fgSustituto.controls['modified_user_id'].setValue(sustituto.modified_user_id);
                fgSustituto.controls['created_by'].setValue(sustituto.created_by);
                fgSustituto.controls['description'].setValue(sustituto.description);
                fgSustituto.controls['deleted'].setValue(sustituto.deleted);
                fgSustituto.controls['assigned_user_id'].setValue(sustituto.assigned_user_id);
                fgSustituto.controls['aos_products_id_c'].setValue(sustituto.aos_products_id_c);
                fgSustituto.controls['aos_products_id1_c'].setValue(sustituto.aos_products_id1_c);
                // fgSustituto.controls['tg01_unidadmedida_id_c'].setValue(sustituto.tg01_unidadmedida_id_c);
                // fgSustituto.controls['tg01_unidadmedida_id1_c'].setValue(sustituto.tg01_unidadmedida_id1_c);
                fgSustituto.controls['umArticulo'].setValue(sustituto.tg01_unidadmedida_id_c);
                fgSustituto.controls['umSustituto'].setValue(sustituto.tg01_unidadmedida_id1_c);
                fgSustituto.controls['cantidad'].setValue(sustituto.cantidad);
                fgSustituto.controls['tipoSustituto'].setValue(sustituto.tiposustituto);
                fgSustituto.controls['idsustituto'].setValue(sustituto.idsustituto);
                
                index = index +1;
              });



            }
          }
    });
    //cargar datos de articulos hijos
    this._articulosService.getProductosHijos(this.auxRid , this.token )
      .subscribe( data => {
          this.respData = data;
          // auxArticulo = this.aData.dataset.length;
          if(this.respData.returnset[0].RCode=="-6003"){
            //token invalido
            this.hijosAll = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('respuesta consulta de relacionados: ', this.respData)
            this.partesCargadas = this.partesCargadas +1;
            if(this.respData.dataset.length>0){
              this.hijosAll = this.respData.dataset;
              let index = 0;
              console.log('relacionados recuperados: ', this.hijosAll)
              this.hijosAll.forEach(hijo => {
                console.log('se va a armar el formgroup para relacionado: ', hijo)
                this.addArtRelacion();
                console.log('hijo: ' ,this.forma.get(['articulosHijos', index]));
                console.log('id hijo: ',(this.forma.get(['articulosHijos', index])).value['id']);
                console.log('hijo como formgroup: ', <FormGroup>this.forma.get(['articulosHijos', index]))
                let fgHijo: FormGroup = <FormGroup>this.forma.get(['articulosHijos', index]);
                fgHijo.controls['idArtHijo'].setValue(hijo.id_articulo);
                fgHijo.controls['artDesc'].setValue(hijo.nombre);
                fgHijo.controls['cantidad'].setValue(Math.trunc(Number(hijo.cantidad)));

                fgHijo.controls['id_tabla_relaciones'].setValue(hijo.id_tabla_relaciones);

                fgHijo.controls['fecha_creacion'].setValue(hijo.fecha_creacion);
                fgHijo.controls['fecha_modificacion'].setValue(hijo.fecha_modificacion);
                fgHijo.controls['id_usuario_creador'].setValue(hijo.id_usuario_creador);
                fgHijo.controls['id_usuario_modificador'].setValue(hijo.id_usuario_modificador);
                fgHijo.controls['id_usuario_asignado'].setValue(hijo.id_usuario_asignado);
                fgHijo.controls['descripcion'].setValue(hijo.descripcion);
                fgHijo.controls['id_articulo_padre'].setValue(hijo.id_articulo_padre);
                
                index = index +1;
              });

            }
          }
    });
  }
  //#endregion cargaDatos

  //#region armadoJSONs
  armarJSONFoto(Foto: any){
    let fgFoto = <FormGroup>Foto;
    let jsonbodyF, jsbodyF;
    console.log('control de foto a usar: ', fgFoto)
    var d = new Date();

    if(fgFoto.controls['date_entered'].value == null){
      //nuevo
      jsbodyF = {
        "id": fgFoto.controls['id'].value,
        "name": fgFoto.controls['name'].value,
        "date_entered": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_entered'].value,
        "date_modified": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_modified'].value,
        "modified_user_id": 1, //fgDeposito.controls['modified_user_id'].value, //1,controls['date_modified'].value,
        "created_by": 1, //fgDeposito.controls['created_by'].value, //1,
        "description": null, //fgDeposito.controls['description'].value,
        "deleted": 0, //fgDeposito.controls['deleted'].value,  //0,
        "assigned_user_id": 1, //fgDeposito.controls['assigned_user_id'].value, //1,
        "aos_products_id_c": this.auxRid, //fgDeposito.controls['aos_products_id_c'].value, //, //Rid,
        "foto":fgFoto.controls['foto'].value, 
      }
    }
    else{
      jsbodyF = {
        "id": fgFoto.controls['id'].value,
        "name": fgFoto.controls['name'].value,
        "date_entered": fgFoto.controls['date_entered'].value,
        "date_modified": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_modified'].value,
        "modified_user_id": 1, //fgDeposito.controls['modified_user_id'].value, //1,controls['date_modified'].value,
        "created_by": fgFoto.controls['created_by'].value, //fgDeposito.controls['created_by'].value, //1,
        "description": null, //fgDeposito.controls['description'].value,
        "deleted": 0, //fgDeposito.controls['deleted'].value,  //0,
        "assigned_user_id": 1, //fgDeposito.controls['assigned_user_id'].value, //1,
        "aos_products_id_c": this.auxRid, //fgDeposito.controls['aos_products_id_c'].value, //, //Rid,
        "foto":fgFoto.controls['foto'].value, 
      }
    }
    jsonbodyF = JSON.stringify(jsbodyF);
    console.log('json de foto stringifeado: ', jsonbodyF)
    return jsonbodyF;
  }

  redondearA2(numString: string){
    let num = Number(numString);
    return (Math.round(((num + 0.00001) * 100) / 100).toString());
  }

  armarJSONArticulo(){
    console.log('armando json articulo con form: ', this.forma);
    let jsbody;

    let precio_UCpa = this.redondearA2(this.forma.controls['precioUltCompra'].value);
    let PrecioU_vta = this.redondearA2(this.forma.controls['precioUltVenta'].value);
    let impuesto_intFijo  = this.redondearA2(this.forma.controls['impuestoInternoFijo'].value);

    if (this.forma.controls['fecha_creacion'].value == null){
      jsbody = {
        "ArticuloItem" : this.forma.controls['tipo'].value,
        "IPart_number" : this.forma.controls['nroArticulo'].value,
        "IName" : this.forma.controls['descripcion'].value,
        "C_alternativo": this.forma.controls['codigoAlternativo'].value,
        "C_barra": this.forma.controls['codigoBarra'].value,
        "idGrupo": this.forma.controls['idGrupo'].value,//id de tabla grupos-consulta dinamica

        "Tipo": this.forma.controls['idTipoArticulo'].value,// id de la tabla tipo de articulos consulta dinamica //todo revisar
        "procedencia": this.forma.controls['procedencia'].value,// combo ->0 nacional,1-importado
        "idmarca": this.forma.controls['idMarca'].value,// id de marcas ->consulta dinamica
        "campo1": this.forma.controls['idCampo1'].value,
        "campo2": this.forma.controls['idCampo2'].value,
        "campo3": this.forma.controls['idCampo3'].value,
        "estado": this.forma.controls['estado'].value,// "Activo", 
        "cat_b": this.forma.controls['categoria_bloqueo'].value,
        // "Obs_auto_vta":this.forma.controls['obsRegistroAutoVta'].value, // , 0 false , 1 true
        // "Obs_auto_cpa":this.forma.controls['obsRegistroAutoCpa'].value, //,0 false , 1 true
        // "Obs_ingr_cpa":this.forma.controls['obsIngresoCpa'].value, //,0 false , 1 true
        // "Obs_ingr_vta": this.forma.controls['obsIngresoVta'].value,//,0 false , 1 true
        // "Obs_imprime_vta": this.forma.controls['obsImprimeVta'].value,//,0 false , 1 true
        // "Obs_auditoria_cpa": this.forma.controls['obsAuditoriaCpa'].value,//,0 false , 1 true
        // "Obs_auditoria_vta": this.forma.controls['obsAuditoriaVta'].value,//,0 false , 1 true
        // "Categoria_vta": this.forma.controls['categoriaVenta'].value,//,0 false , 1 true
        // "Categoria_inventario": this.forma.controls['categoriaInventario'].value,//,0 false , 1 true
        // "Categoria_cpa": this.forma.controls['categoriaCompra'].value,//,0 false , 1 true
        "Obs_auto_vta": (this.forma.controls['obsRegistroAutoVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auto_cpa": (this.forma.controls['obsRegistroAutoCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_ingr_cpa": (this.forma.controls['obsIngresoCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_ingr_vta": (this.forma.controls['obsIngresoVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_imprime_vta": (this.forma.controls['obsImprimeVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auditoria_cpa": (this.forma.controls['obsAuditoriaCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auditoria_vta": (this.forma.controls['obsAuditoriaVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_vta": (this.forma.controls['categoriaVenta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_inventario": (this.forma.controls['categoriaInventario'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_cpa": (this.forma.controls['categoriaCompra'].value == true ? 1 : 0), // , 0 false , 1 true

        "precio_UCpa":this.forma.controls['precioUltCompra'].value,// 200,
        "fecha_UCpa": this.forma.controls['fechaUltCompra'].value,
        "idmoneda": this.forma.controls['idMonedaUltCompra'].value,// codigo de monedas → lista desplegable con tg01_monedas
        "Cant_Op_cpa": this.forma.controls['cantidadOptimaDeCompra'].value,
        "PrecioU_vta": this.forma.controls['precioUltVenta'].value,
        "FechaU_vta": this.forma.controls['fechaUltVenta'].value,
        "idmoneda1": this.forma.controls['idMonedaUltVenta'].value,//, codigo de monedas-> lista desplegable con tg01_monedas

        //datos impositivos
        "idRefC": this.forma.controls['idGrupoRefContArticulo'].value,//id de referencia contable ->consulta dinamica
        "idalicuota": this.forma.controls['idAlicuotaIva'].value,//,id de alicuota-> lista deplegable con metodo tg01_alicuotas  (tipo iva)
        "idalicuota1": this.forma.controls['idAlicuotaImpInt'].value,//,id de alicuota->consulta dinamica (tipo impuestos internos)
        "Area_AAII":this.forma.controls['IIAreaAplicacionAlicuota'].value,// ,  0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "Area_AIFII":this.forma.controls['IIAreaAplicacionImporteFijo'].value,//, 0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "incorporaCosto":(this.forma.controls['IncorporarIIalCosto'].value == true ? 1 : 0),// 0, 0 false , 1 true
        "impuesto_intFijo": this.forma.controls['impuestoInternoFijo'].value,
        "gestion_despacho":(this.forma.controls['gestionDespacho'].value == true ? 1 : 0),//0, 0 false , 1 true
        "gestion_lote":(this.forma.controls['gestionLote'].value == true ? 1 : 0),// 0,0 false , 1 true
        "gestion_serie":(this.forma.controls['gestionSerie'].value == true ? 1 : 0),//0,0 false , 1 true

        //datos de stock
        "admStock": (this.forma.controls['administraStock'].value == true ? 1 : 0),//0, 0 false , 1 true
        "stockIdeal": this.forma.controls['stockIdeal'].value,
        "stockMax": this.forma.controls['stockMaximo'].value,
        "stockRepo":this.forma.controls['stockReposicion'].value,
        //unidad de medida
        "dimensiones": this.forma.controls['Dimensiones'].value,
        "pesable": this.forma.controls['Pesable'].value,
        "pesableE": this.forma.controls['Pesable_Estandar'].value,
        "idUM": this.forma.controls['unidadMedidaBase'].value,//char(36),id de UM,consulta dinamica,
        "idUM1": this.forma.controls['unidadMedidaLP'].value,// char(36) id de UM,consulta dinamica,
        "idUM2": this.forma.controls['umCompras'].value,
        "idUM3": this.forma.controls['umOCompra'].value,
        "idUM4": this.forma.controls['umPCompra'].value,
        "idUM5": this.forma.controls['umVentas'].value,
        "IdUM6": this.forma.controls['umPVenta'].value,
        "largo":this.forma.controls['largo'].value,
        "ancho":this.forma.controls['ancho'].value,
        "profundo":this.forma.controls['profundidad'].value,
        "m3": this.forma.controls['m3'].value
      }
    }
    else{
      jsbody = {
        "ArticuloItem" : this.forma.controls['tipo'].value,
        "IPart_number" : this.forma.controls['nroArticulo'].value,
        "IName" : this.forma.controls['descripcion'].value,
        "C_alternativo": this.forma.controls['codigoAlternativo'].value,
        "C_barra": this.forma.controls['codigoBarra'].value,
        "idGrupo": this.forma.controls['idGrupo'].value,//id de tabla grupos-consulta dinamica

        "Tipo": this.forma.controls['idTipoArticulo'].value,// id de la tabla tipo de articulos consulta dinamica //todo revisar
        "procedencia": this.forma.controls['procedencia'].value,// combo ->0 nacional,1-importado
        "idmarca": this.forma.controls['idMarca'].value,// id de marcas ->consulta dinamica
        "campo1": (this.forma.controls['idCampo1'].value != null ? this.forma.controls['idCampo1'].value : 'null'),
        "campo2": (this.forma.controls['idCampo2'].value != null ? this.forma.controls['idCampo2'].value : 'null'),
        "campo3": (this.forma.controls['idCampo3'].value != null ? this.forma.controls['idCampo3'].value : 'null'),
        "estado": this.forma.controls['estado'].value,// "Activo", 
        // "cat_b": this.forma.controls['categoria_bloqueo'].value,
        "id_cat_bloqueo": this.forma.controls['categoria_bloqueo'].value,

        "Obs_auto_vta": (this.forma.controls['obsRegistroAutoVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auto_cpa": (this.forma.controls['obsRegistroAutoCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_ingr_cpa": (this.forma.controls['obsIngresoCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_ingr_vta": (this.forma.controls['obsIngresoVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_imprime_vta": (this.forma.controls['obsImprimeVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auditoria_cpa": (this.forma.controls['obsAuditoriaCpa'].value == true ? 1 : 0), // , 0 false , 1 true
        "Obs_auditoria_vta": (this.forma.controls['obsAuditoriaVta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_vta": (this.forma.controls['categoriaVenta'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_inventario": (this.forma.controls['categoriaInventario'].value == true ? 1 : 0), // , 0 false , 1 true
        "Categoria_cpa": (this.forma.controls['categoriaCompra'].value == true ? 1 : 0), // , 0 false , 1 true

        "precio_UCpa": precio_UCpa,//this.forma.controls['precioUltCompra'].value,// 200,
        "fecha_UCpa": this.forma.controls['fechaUltCompra'].value,
        // "idmoneda": this.forma.controls['idMonedaUltCompra'].value,// codigo de monedas → lista desplegable con tg01_monedas
        "idmoneda": this.forma.controls['idMonedaUltCompra'].value,// codigo de monedas → lista desplegable con tg01_monedas
        "Cant_Op_cpa": this.forma.controls['cantidadOptimaDeCompra'].value,
        "PrecioU_vta": PrecioU_vta,//this.forma.controls['precioUltVenta'].value,
        "FechaU_vta": this.forma.controls['fechaUltVenta'].value,
        // "idmoneda1": this.forma.controls['idMonedaUltVenta'].value,//, codigo de monedas-> lista desplegable con tg01_monedas
        "idmoneda1": this.forma.controls['idMonedaUltVenta'].value,//, codigo de monedas-> lista desplegable con tg01_monedas

        //datos impositivos
        "idRefC": this.forma.controls['idGrupoRefContArticulo'].value,//id de referencia contable ->consulta dinamica
        "idalicuota": this.forma.controls['idAlicuotaIva'].value,//,id de alicuota-> lista deplegable con metodo tg01_alicuotas  (tipo iva)
        "idalicuota1": this.forma.controls['idAlicuotaImpInt'].value,//,id de alicuota->consulta dinamica (tipo impuestos internos)
        "Area_AAII":this.forma.controls['IIAreaAplicacionAlicuota'].value,// ,  0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "Area_AIFII":this.forma.controls['IIAreaAplicacionImporteFijo'].value,//, 0 - No Aplica, 1 - Compras, 2 - Ventas, 3 - Ambas.
        "incorporaCosto":(this.forma.controls['IncorporarIIalCosto'].value == true ? 1 : 0),// 0, 0 false , 1 true
        "impuesto_intFijo": impuesto_intFijo,//this.forma.controls['impuestoInternoFijo'].value,
        "gestion_despacho":(this.forma.controls['gestionDespacho'].value == true ? 1 : 0),//0, 0 false , 1 true
        "gestion_lote":(this.forma.controls['gestionLote'].value == true ? 1 : 0),// 0,0 false , 1 true
        "gestion_serie":(this.forma.controls['gestionSerie'].value == true ? 1 : 0),//0,0 false , 1 true

        //datos de stock
        "admStock": (this.forma.controls['administraStock'].value == true ? 1 : 0),//0, 0 false , 1 true
        /* "stockIdeal": this.forma.controls['stockIdeal'].value,
        "stockMax": this.forma.controls['stockMaximo'].value,
        "stockRepo":this.forma.controls['stockReposicion'].value, */
        "stockIdeal": (this.forma.controls['administraStock'].value == true ? this.forma.controls['stockIdeal'].value : 'null'),
        "stockMax": (this.forma.controls['administraStock'].value == true ? this.forma.controls['stockMaximo'].value : 'null'),
        "stockRepo": (this.forma.controls['administraStock'].value == true ? this.forma.controls['stockReposicion'].value : 'null'),
        //unidad de medida
        "dimensiones": this.forma.controls['Dimensiones'].value,
        "pesable": this.forma.controls['Pesable'].value,
        "pesableE": this.forma.controls['Pesable_Estandar'].value,
        "idUM": this.forma.controls['unidadMedidaBase'].value,//char(36),id de UM,consulta dinamica,
        "idUM1": this.forma.controls['unidadMedidaLP'].value,// char(36) id de UM,consulta dinamica,
        "idUM2": this.forma.controls['umCompras'].value,
        "idUM3": this.forma.controls['umOCompra'].value,
        "idUM4": this.forma.controls['umPCompra'].value,
        "idUM5": this.forma.controls['umVentas'].value,
        "IdUM6": this.forma.controls['umPVenta'].value,
        "largo":this.forma.controls['largo'].value,
        "ancho":this.forma.controls['ancho'].value,
        "profundo":this.forma.controls['profundidad'].value,
        "m3": this.forma.controls['m3'].value
      }  
    }
    console.log('stringifeando esto: ', jsbody)
    let jsonbody = JSON.stringify(jsbody);
    console.log('json de cabecera stringifeado: ', jsonbody)
    return jsonbody;
  }

  // armarJSONDeposito(Deposito: any, id?: string){
  armarJSONDeposito(Deposito: any){
    let fgDeposito = <FormGroup>Deposito;
    let jsonbodyD, jsbodyD;
    console.log('control de deposito a usar: ', fgDeposito)
    var d = new Date();

    if(fgDeposito.controls['date_entered'].value == null){
      //nuevo
      jsbodyD = {
        "id": fgDeposito.controls['tg01_depositos_id_c'].value,
        "name": fgDeposito.controls['name'].value,
        "date_entered": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_entered'].value,
        "date_modified": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_modified'].value,
        "modified_user_id": 1, //fgDeposito.controls['modified_user_id'].value, //1,
        "created_by": 1, //fgDeposito.controls['created_by'].value, //1,
        "description": null, //fgDeposito.controls['description'].value,
        "deleted": 0, //fgDeposito.controls['deleted'].value,  //0,
        "assigned_user_id": 1, //fgDeposito.controls['assigned_user_id'].value, //1,
        "aos_products_id_c": this.auxRid, //fgDeposito.controls['aos_products_id_c'].value, //, //Rid, 
        "tg01_depositos_id_c": fgDeposito.controls['tg01_depositos_id_c'].value, //Id consulta dinámica de tabla: tg01_depositos
        "stockideal": fgDeposito.controls['stockideal'].value, //150,
        "stockmaximo": fgDeposito.controls['stockmaximo'].value, //1500,
        "stockreposicion": fgDeposito.controls['stockreposicion'].value, //15
      };
    }
    else{
      jsbodyD = {
        // "id": fgDeposito.controls['tg01_depositos_id_c'].value,
        "name": fgDeposito.controls['name'].value,
        "date_entered": fgDeposito.controls['date_entered'].value,
        "date_modified": d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),//fgDeposito.controls['date_modified'].value,
        "modified_user_id": 1, //fgDeposito.controls['modified_user_id'].value, //1,
        "created_by": fgDeposito.controls['created_by'].value, //1,
        "description": null, //fgDeposito.controls['description'].value,
        "deleted":fgDeposito.controls['deleted'].value,  //0,
        "assigned_user_id": fgDeposito.controls['assigned_user_id'].value, //1,
        "aos_products_id_c": fgDeposito.controls['aos_products_id_c'].value, //, //Rid, 
        "tg01_depositos_id_c": fgDeposito.controls['tg01_depositos_id_c'].value, //Id consulta dinámica de tabla: tg01_depositos
        "stockideal": fgDeposito.controls['stockideal'].value, //150,
        "stockmaximo": fgDeposito.controls['stockmaximo'].value, //1500,
        "stockreposicion": fgDeposito.controls['stockreposicion'].value, //15
      };
    }

    jsonbodyD = JSON.stringify(jsbodyD);
    return jsonbodyD;
  }

  armarJSONProveedor(Proveedor: any){
    let fgProveedor = <FormGroup>Proveedor;
    let jsonbodyP, jsbodyP;
    console.log('control de deposito a usar: ', fgProveedor)
    var d = new Date();
    var porDefecto: number =
      (fgProveedor.controls['esPorDefecto'].value == null ? 0 : fgProveedor.controls['esPorDefecto'].value);

    if(fgProveedor.controls['date_entered'].value == null){
      //nuevo
      jsbodyP = {
        "id": fgProveedor.controls['idProveedor'].value,//todo revisar
        "name": fgProveedor.controls['razonSocial'].value,
        "date_entered":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": 1, //,usuario logueado por ahora 1
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "codigobarra": fgProveedor.controls['artCodBarra'].value,//alfanumerico hasta 20 caracteres
        "precioultimacompra":fgProveedor.controls['precioUltCompra'].value,// 100,
        "currency_id": 1,
        "ultimacompra": this.extraerFecha(<FormControl>fgProveedor.controls['fechaUltCompra']),//"2018-02-26",
        "tg01_monedas_id_c": fgProveedor.controls['idMonedaUltCompra'].value, //1, ID de consulta dinámica a la tabla tg01_monedas
        // "pordefecto": (fgProveedor.controls['esPorDefecto'].value == null ? 0 : 1 ),//1,
        "pordefecto": porDefecto,//1,
        "aos_products_id_c": this.auxRid,
        "account_id_c": 1, //fgProveedor.controls[''].value,//1 ID de consulta dinámica a la tabla tg01_accounts_cstm, tiporeferente_c = P
      }
    }
    else{
      jsbodyP = {
        // "id": fgProveedor.controls['idProveedor'].value,//todo revisar
        "name": fgProveedor.controls['razonSocial'].value,
        "date_entered": fgProveedor.controls['date_entered'].value,
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": fgProveedor.controls['created_by'].value, //,usuario logueado por ahora 1
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "codigobarra": fgProveedor.controls['artCodBarra'].value,//alfanumerico hasta 20 caracteres
        "precioultimacompra":fgProveedor.controls['precioUltCompra'].value,// 100,
        "currency_id": 1,
        "ultimacompra": this.extraerFecha(<FormControl>fgProveedor.controls['fechaUltCompra']),//"2018-02-26",
        // "tg01_monedas_id_c": fgProveedor.controls['idMonedaUltCompra'].value, //1, ID de consulta dinámica a la tabla tg01_monedas
        "tg01_monedas_id_c": 1, //ID de consulta dinámica a la tabla tg01_monedas
        // "pordefecto": fgProveedor.controls['esPorDefecto'].value,//1,
        "pordefecto": porDefecto,//1,
        "aos_products_id_c": this.auxRid,
        "account_id_c": 1, //fgProveedor.controls[''].value,//1 ID de consulta dinámica a la tabla tg01_accounts_cstm, tiporeferente_c = P
      }
    }

    jsonbodyP = JSON.stringify(jsbodyP);
    return jsonbodyP;
  }

  armarJSONSustituto(Sustituto: any){
    let fgSustituto = <FormGroup>Sustituto;
    let jsonbodyP, jsbodyP;
    console.log('control de sustituto a usar: ', fgSustituto)
    var d = new Date();

    if(fgSustituto.controls['date_entered'].value == null){
      //nuevo
      jsbodyP = {
        "id": fgSustituto.controls['idArtSust'].value,//todo revisar si se duplica
        "name": fgSustituto.controls['artDesc'].value,
        "date_entered":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": 1, //,usuario logueado por ahora 1
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "aos_products_id_c": this.auxRid,
        "aos_products_id1_c": fgSustituto.controls['idArtSust'].value, //1, //todo: Id del producto sustituto (Consulta dinámica a aos_products)
        "cantidad": fgSustituto.controls['cantidad'].value, //100, Cantidad
        "tg01_unidadmedida_id_c": fgSustituto.controls['umArticulo'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "tg01_unidadmedida_id1_c": fgSustituto.controls['umSustituto'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "idsustituto": fgSustituto.controls['idsustituto'].value, //, codigo de articulo //todo revisar si es part number
        "tiposustituto": fgSustituto.controls['tipoSustituto'].value, //, S simple, C compuesto, P sustituto
      }
    }
    
    else{
      jsbodyP = {
        // "id": fgSustituto.controls['idArtSust'].value,//todo revisar si se duplica
        // "name": fgSustituto.controls['razonSocial'].value,
        "name": fgSustituto.controls['artDesc'].value,
        "date_entered": fgSustituto.controls['date_entered'].value,
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": fgSustituto.controls['created_by'].value,
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "aos_products_id_c": this.auxRid,
        "aos_products_id1_c": fgSustituto.controls['idArtSust'].value, //1, //todo: Id del producto sustituto (Consulta dinámica a aos_products)
        "cantidad": fgSustituto.controls['cantidad'].value, //100, Cantidad
        "tg01_unidadmedida_id_c": fgSustituto.controls['umArticulo'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "tg01_unidadmedida_id1_c": fgSustituto.controls['umSustituto'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "idsustituto": fgSustituto.controls['idsustituto'].value, //, codigo de articulo //todo revisar si es part number
        "tiposustituto": fgSustituto.controls['tipoSustituto'].value, //, S simple, C compuesto, P sustituto
      }
    }

    jsonbodyP = JSON.stringify(jsbodyP);
    return jsonbodyP;
  }
  armarJSONHijo(hijo: any){
    let fgHijo = <FormGroup>hijo;
    let jsonbodyP, jsbodyP;
    console.log('control de hijo a usar: ', fgHijo)
    var d = new Date();

    if(fgHijo.controls['id_tabla_relaciones'].value == null){
      //nuevo
      jsbodyP = {
        
        /* "id": fgHijo.controls['idArtHijo'].value,//todo revisar si se duplica
        "name": fgHijo.controls['artDesc'].value,
        "date_entered":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": 1, //,usuario logueado por ahora 1
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "aos_products_id_c": this.auxRid,
        "aos_products_id1_c": fgHijo.controls['idArtSust'].value, //1, //todo: Id del producto sustituto (Consulta dinámica a aos_products)
        "cantidad": fgHijo.controls['cantidad'].value, //100, Cantidad
        "tg01_unidadmedida_id_c": fgHijo.controls['umArticulo'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "tg01_unidadmedida_id1_c": fgHijo.controls['umSustituto'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "idsustituto": fgHijo.controls['idsustituto'].value, //, codigo de articulo //todo revisar si es part number
        "tiposustituto": fgHijo.controls['tipoSustituto'].value, //, S simple, C compuesto, P sustituto */

        "art_rel_id_usuario": "ff413af6-ee5c-11e8-ab85-d050990fe081", //todo usar usuario real
        "art_rel_nombre": fgHijo.controls['artDesc'].value,// "ART REL 1",
        "art_rel_descripcion": fgHijo.controls['descripcion'].value,//"ARTICULO RELACIONADO 1",
        "art_rel_id_articulo": fgHijo.controls['idArtHijo'].value,//"1020-I",
        "art_rel_id_articulo_padre": this.auxRid,//"102-R",
        "art_rel_cantidad":fgHijo.controls['cantidad'].value, //1.0005
      }
    }
    
    else{
      jsbodyP = {
        /* // "id": fgSustituto.controls['idArtSust'].value,//todo revisar si se duplica
        // "name": fgSustituto.controls['razonSocial'].value,
        "name": fgHijo.controls['artDesc'].value,
        "date_entered": fgHijo.controls['date_entered'].value,
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": fgHijo.controls['created_by'].value,
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "aos_products_id_c": this.auxRid,
        "aos_products_id1_c": fgHijo.controls['idArtSust'].value, //1, //todo: Id del producto sustituto (Consulta dinámica a aos_products)
        "cantidad": fgHijo.controls['cantidad'].value, //100, Cantidad
        "tg01_unidadmedida_id_c": fgHijo.controls['umArticulo'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "tg01_unidadmedida_id1_c": fgHijo.controls['umSustituto'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "idsustituto": fgHijo.controls['idsustituto'].value, //, codigo de articulo //todo revisar si es part number
        "tiposustituto": fgHijo.controls['tipoSustituto'].value, //, S simple, C compuesto, P sustituto */
        
        "art_rel_id": fgHijo.controls['id_tabla_relaciones'].value,//"e708cba3-4b30-11e9-9a02-d050990fe081",
        "art_rel_id_usuario": "ff413af6-ee5c-11e8-ab85-d050990fe081", //todo usar usuario real
        "art_rel_nombre": fgHijo.controls['artDesc'].value,// "ART REL 1",
        "art_rel_descripcion": fgHijo.controls['descripcion'].value,//"ARTICULO RELACIONADO 1",
        "art_rel_id_articulo": fgHijo.controls['idArtHijo'].value,//"1020-I",
        "art_rel_id_articulo_padre": this.auxRid,//"102-R",
        "art_rel_cantidad":fgHijo.controls['cantidad'].value, //1.0005
      }
    }

    jsonbodyP = JSON.stringify(jsbodyP);
    return jsonbodyP;
  }
  /*
  armarJSONFoto(Foto: any){
    let fgFoto = <FormGroup>Foto;
    let jsonbodyF, jsbodyF;
    console.log('control de deposito a usar: ', fgFoto)
    var d = new Date();

    if(fgFoto.controls['id'].value != null){
      //nuevo
      jsbodyF = {
        "id": 12,
        "name": "jcabrera",
        "date_entered": now()
        "date_modified":now(),
        "modified_user_id": 1 ,usuario logueado por ahora 1
        "created_by": 1,usuario logueado por ahora 1
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1, usuario logueado por ahora 1
        "aos_products_id_c": RId,
        "foto": "www.i2t-sa.com/fotoJcabrera", URL de la foto
        }
    }
    else{
      jsbodyF = {
        // "id": fgSustituto.controls['idArtSust'].value,//todo revisar si se duplica
        "name": fgSustituto.controls['razonSocial'].value,
        "date_entered": fgSustituto.controls['date_entered'].value,
        "date_modified":  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id": 1,//usuario logueado por ahora 1
        "created_by": fgSustituto.controls['created_by'].value,
        "description": null,
        "deleted": 0,
        "assigned_user_id": 1,//usuario logueado por ahora 1
        "aos_products_id_c": this.auxRid,
        "aos_products_id1_c": fgSustituto.controls['idArtSust'].value, //1, //todo: Id del producto sustituto (Consulta dinámica a aos_products)
        "cantidad": fgSustituto.controls['cantidad'].value, //100, Cantidad
        "tg01_unidadmedida_id_c": fgSustituto.controls['umArticulo'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "tg01_unidadmedida_id1_c": fgSustituto.controls['umSustituto'].value, //1, Id consulta dinámica a tg01_unidadmedida
        "idsustituto": fgSustituto.controls['idArtSust'].value, //, codigo de articulo //todo revisar
        "tiposustituto": fgSustituto.controls['tipoSustituto'].value, //, S simple, C compuesto, P sustituto
      }
    }
    
    jsonbodyF = JSON.stringify(jsbodyF);
    return jsonbodyF;
  }
  */
  //#endregion armadoJSONs

  guardarArticulo(){
    if( this.id == "nuevo" ){
      // insertando
      let jsonbodyCabecera = this.armarJSONArticulo();

      console.log('json principal para insertar: ', jsonbodyCabecera);
      this._articulosService.postCabeceraArticulo(jsonbodyCabecera, this.token )
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
                this.openSnackBar('Error al guardar Articulo: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Cabecera de Articulo guardada con exito, continuando.');
                // this.id = this.respData.returnset[0].RId;
                this.auxRid = this.respData.returnset[0].RId;
                console.log('ID de Articulo recibido: ' + this.auxRid, this.respData);
                // this.guardarDatosArticulo(this.respData.returnset[0].RId);
                this.guardarDatosArticulo();
                // this.openSnackBar('Proveedor guardado con exito, redireccionando.');

                //todo agregar redirección
              }
            }
            //console.log(this.refContablesAll);
      });
    

      // ARTÍCULO - DEPÓSITO: INSERT
      /*
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
      */

      
    }else{
      //actualizando

      let jsonbodyCabecera = this.armarJSONArticulo();
      /* let jsbody = {
        "ArticuloItem" : this.forma.controls['tipo'].value,
        "IPart_number" : this.forma.controls['nroArticulo'].value,
        "IName" : this.forma.controls['descripcion'].value,
        "C_alternativo": this.forma.controls['codigoAlternativo'].value,
        "C_barra": this.forma.controls['codigoBarra'].value,
        "Grupo": "",//id de tabla grupos-consulta dinamica

        "Tipo":"",// id de la tabla tipo de articulos consulta dinamica
        "procedencia": this.forma.controls['procedencia'].value,// combo ->0 nacional,1-importado
        "marca":"",// id de marcas ->consulta dinamica
        // "campo1": this.forma.controls['campo1'].value,
        // "campo2": this.forma.controls['campo2'].value,
        // "campo3": this.forma.controls['campo3'].value,
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
      } */
      
      console.log('json principal para actualizar: ', jsonbodyCabecera);
      this._articulosService.updateCabeceraArticulo(jsonbodyCabecera, this.token )
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
                this.openSnackBar('Error al actualizar Articulo: ' + this.respData.returnset[0].RTxt);
              }
              else{
                this.openSnackBar('Cabecera de Articulo actualizada con exito, continuando.');
                // this.id = this.respData.returnset[0].RId;
                this.auxRid = this.respData.returnset[0].RId;
                console.log('ID de Articulo recibido: ' + this.auxRid, this.respData);
                // this.guardarDatosArticulo(this.respData.returnset[0].RId);
                this.guardarDatosArticulo();
                // this.openSnackBar('Proveedor guardado con exito, redireccionando.');

                //todo agregar redirección
              }
            }
            //console.log(this.refContablesAll);
      });

    }
  }

  // guardarDatosArticulo(idProveedor: string){
  guardarDatosArticulo(){
    this.guardarProveedores();
    this.guardarDepositos();
    this.guardarSustitutos();
    this.guardarHijos();
    //todo agregar
    // this.guardarFotos();
  }

  //#region sincronizarListas
  guardarProveedores(){
    this.estadosProveedores.nuevos = [];
    this.estadosProveedores.modificados = [];

    let listaProveedores = <FormArray>this.forma.get(['proveedores']);
    (listaProveedores.controls).forEach(element => {
      let proveedor = <FormGroup>element;
      console.log('proveedor ', proveedor);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (proveedor.dirty){
        //si tiene x es modificación
        if (proveedor.controls['date_entered'].value != null){
          this.estadosProveedores.modificados.push(proveedor);
        }
        else{
          this.estadosProveedores.nuevos.push(proveedor);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de proveedores a procesar: ', this.estadosProveedores);

    this.estadosProveedores.nuevos.forEach(formProveedor => {
      console.log('se agregará proveedor: ', formProveedor);
      this.guardarProveedor(formProveedor);
    });

    this.estadosProveedores.modificados.forEach(formProveedor => {
      this.modificarProveedor(formProveedor);
    });

    this.estadosProveedores.eliminados.forEach(proveedorEliminado => {
      this.eliminarProveedor(proveedorEliminado);
    });

    //reiniciar listas
    this.estadosProveedores ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  guardarDepositos(){
    this.estadosDepositos.nuevos = [];
    this.estadosDepositos.modificados = [];

    let listaDepositos = <FormArray>this.forma.get(['depositos']);
    (listaDepositos.controls).forEach(element => {
      let deposito = <FormGroup>element;
      console.log('deposito ', deposito);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (deposito.dirty){
        //si tiene x es modificación
        if (deposito.controls['date_entered'].value != null){
          this.estadosDepositos.modificados.push(deposito);
        }
        else{
          this.estadosDepositos.nuevos.push(deposito);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de depositoes a procesar: ', this.estadosDepositos);

    this.estadosDepositos.nuevos.forEach(formDeposito => {
      console.log('se agregará deposito: ', formDeposito);
      this.guardarDeposito(formDeposito);
    });

    this.estadosDepositos.modificados.forEach(formDeposito => {
      this.modificarDeposito(formDeposito);
    });

    this.estadosDepositos.eliminados.forEach(depositoEliminado => {
      this.eliminarDeposito(depositoEliminado);
    });

    //reiniciar listas
    this.estadosDepositos ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  guardarSustitutos(){
    this.estadosArticulosSustitutos.nuevos = [];
    this.estadosArticulosSustitutos.modificados = [];

    let listaSustitutos = <FormArray>this.forma.get(['articulosSustitutos']);
    (listaSustitutos.controls).forEach(element => {
      let sustituto = <FormGroup>element;
      console.log('sustituto ', sustituto);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (sustituto.dirty){
        //si tiene x es modificación
        if (sustituto.controls['date_entered'].value != null){
          this.estadosArticulosSustitutos.modificados.push(sustituto);
        }
        else{
          this.estadosArticulosSustitutos.nuevos.push(sustituto);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de sustitutoes a procesar: ', this.estadosArticulosSustitutos);

    this.estadosArticulosSustitutos.nuevos.forEach(formSustituto => {
      console.log('se agregará sustituto: ', formSustituto);
      this.guardarArticuloSustituto(formSustituto);
    });

    this.estadosArticulosSustitutos.modificados.forEach(formSustituto => {
      this.modificarArticuloSustituto(formSustituto);
    });

    this.estadosArticulosSustitutos.eliminados.forEach(sustitutoEliminado => {
      this.eliminarArticuloSustituto(sustitutoEliminado);
    });

    //reiniciar listas
    this.estadosArticulosSustitutos ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }

  guardarHijos(){
    this.estadosArticulosHijos.nuevos = [];
    this.estadosArticulosHijos.modificados = [];

    let listaHijos = <FormArray>this.forma.get(['articulosHijos']);
    (listaHijos.controls).forEach(element => {
      let hijo = <FormGroup>element;
      console.log('hijo ', hijo);
      // console.log('Estado del formgroup(sucio?, valido?, status?): ', cuenta.dirty, cuenta.valid, cuenta.status)
      if (hijo.dirty){
        //si tiene x es modificación
        if (hijo.controls['id_tabla_relaciones'].value != null){
          this.estadosArticulosHijos.modificados.push(hijo);
        }
        else{
          this.estadosArticulosHijos.nuevos.push(hijo);
        }
      }
      else{
        //nada porque no fue tocado
      }
    });

    console.log('Lista de hijos a procesar: ', this.estadosArticulosHijos);

    this.estadosArticulosHijos.nuevos.forEach(formHijo => {
      console.log('se agregará hijo: ', formHijo);
      this.guardarArticuloHijo(formHijo);
    });

    this.estadosArticulosHijos.modificados.forEach(formHijo => {
      console.log('se modificará hijo: ', formHijo);
      this.modificarArticuloHijo(formHijo);
    });

    this.estadosArticulosHijos.eliminados.forEach(hijoEliminado => {
      this.eliminarArticuloHijo(hijoEliminado);
    });

    //reiniciar listas
    this.estadosArticulosHijos ={nuevos: [],
                          modificados: [],
                          eliminados: []};
  }
  //#endregion sincronizarListas

  //#region abm
    //#region abmProveedor
    guardarProveedor(proveedor: any){
      let jsonbodyP = this.armarJSONProveedor(proveedor);
      console.log('body guardado de proveedor: ', jsonbodyP);

      this._articulosService.postProveedor(jsonbodyP, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta insert proveedor: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido insertando proveedor')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al agregar Proveedor: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Proveedor ID (insert): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    modificarProveedor(proveedor: any){
      let jsonbodyP = this.armarJSONProveedor(proveedor);
      console.log('body modificado de proveedor: ', jsonbodyP);
      let id = (<FormGroup>proveedor).controls['idProveedor'].value;
      this._articulosService.updateProveedor(id, jsonbodyP, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta modificar proveedor: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido modificando proveedor')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al modificar Proveedor: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Proveedor ID (update): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    eliminarProveedor(proveedor: any){
      console.log('Eliminando prov: ', proveedor.id);
      
      let jsbody = { 
        "deleted": 1,
        "tg01_monedas_id_c": proveedor.moneda
      };
      let jsonbody = JSON.stringify(jsbody);

      this._articulosService.deleteProveedor(proveedor.id, jsonbody, this.token )
        .subscribe( data => {
            this.respData = data;
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Sesión expirada.')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al eliminar Proveedor: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Proveedor ID (eliminado): ' + proveedor.id);
              }
            }
        });
    }
    //#endregion abmProveedor
    //#region abmDeposito
    guardarDeposito(deposito: any){
      let jsonbodyD = this.armarJSONDeposito(deposito);
      console.log('body guardado de deposito: ', jsonbodyD);

      this._articulosService.postDeposito(jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta insert deposito: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido insertando deposito')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al agregar Deposito: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Deposito ID (insert): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    modificarDeposito(deposito: any){
      let jsonbodyD = this.armarJSONDeposito(deposito);
      console.log('body modificado de deposito: ', jsonbodyD);
      let id = (<FormGroup>deposito).controls['id'].value;
      this._articulosService.updateDeposito(id, jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta modificar deposito: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido modificando deposito')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al modificar Deposito: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Deposito ID (update): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    eliminarDeposito(deposito: any){
      console.log('Eliminando dep: ', deposito);
      
      let jsbody = { 
        "deleted": 1,
        "tg01_depositos_id_c": deposito.deposito
      };
      let jsonbody = JSON.stringify(jsbody);

      this._articulosService.deleteDeposito( deposito.id, jsonbody, this.token )
        .subscribe( data => {
            this.respData = data;
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Sesión expirada.')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al eliminar Deposito: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Deposito ID (eliminado): ' + deposito);
              }
            }
        });
    }
    //#endregion abmDeposito
    //#region abmArticulosSustitutos
    guardarArticuloSustituto(sustituto: any){
      let jsonbodyD = this.armarJSONSustituto(sustituto);
      console.log('body guardado de sustituto: ', jsonbodyD);

      this._articulosService.postArticuloSustituto(jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta insert sustituto: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido insertando sustituto')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al agregar Sustituto: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Sustituto ID (insert): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    modificarArticuloSustituto(sustituto: any){
      let jsonbodyD = this.armarJSONSustituto(sustituto);
      console.log('body modificado de sustituto: ', jsonbodyD);
      let id = (<FormGroup>sustituto).controls['idArtSust'].value;
      this._articulosService.updateArticuloSustituto(id, jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta modificar sustituto: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido modificando sustituto')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al modificar Sustituto: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Sustituto ID (update): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    eliminarArticuloSustituto(sustituto: any){
      console.log('Eliminando sust: ', sustituto);
      let jsbody = { 
        "deleted": 1,
        "tg01_unidadmedida_id_c": sustituto.um,
        "tg01_unidadmedida_id1_c": sustituto.um2
      };
      let jsonbody = JSON.stringify(jsbody);

      this._articulosService.deleteArticuloSustituto(sustituto.id, jsonbody, this.token )
        .subscribe( data => {
            this.respData = data;
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Sesión expirada.')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al eliminar Sustituto: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('Sustituto ID (eliminado): ' + sustituto);
              }
            }
        });
    }
    //#endregion abmArticulosSustitutos
    //#region abmArticulosHijos
    guardarArticuloHijo(hijo: any){
      let jsonbodyD = this.armarJSONHijo(hijo);
      console.log('body guardado de hijo: ', jsonbodyD);

      this._articulosService.postArticuloHijo(jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta insert hijo: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido insertando hijo')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al agregar hijo: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('hijo ID (insert): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    modificarArticuloHijo(hijo: any){
      let jsonbodyD = this.armarJSONHijo(hijo);
      console.log('body modificado de hijo: ', jsonbodyD);
      let id = (<FormGroup>hijo).controls['idArtHijo'].value;
      this._articulosService.updateArticuloHijo( jsonbodyD, this.token )
        .subscribe( data => {
            this.respData = data;
            console.log('respuesta modificar hijo: ', this.respData);
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Token invalido modificando hijo')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al modificar hijo: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('hijo ID (update): ' + this.respData.returnset[0].RId);
              }
            }
        });
    }

    eliminarArticuloHijo(hijo: string){
      console.log('Eliminando hijo: ', hijo);
      let jsbody = { 
        "art_rel_id": hijo,//"e708cba3-4b30-11e9-9a02-d050990fe081"
      };
      let jsonbody = JSON.stringify(jsbody);

      this._articulosService.deleteArticuloHijo(jsonbody, this.token )
        .subscribe( data => {
            this.respData = data;
            if(this.respData.returnset[0].RCode=="-6003"){
              //token invalido
              this.forma.disable();
              this.openSnackBar('Sesión expirada.')
            } else {
              if (this.respData.returnset[0].RCode != 1){
                console.log('Error al eliminar hijo: ' + this.respData.returnset[0].RTxt, this.respData);
              }
              else{
                console.log('hijo ID (eliminado): ' + hijo);
              }
            }
        });
    }

    //#endregion abmArticulosHijos
  //#endregion abm

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

  //#region validaciones
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

  //todo borrar
  /* existeUnidad( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxUnidadData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  } */

  existeMarca( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxMarcaData!=1 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeGrupo( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxGrupoData!=1 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeDeposito( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxDepData!=1 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }
  //#endregion validaciones

  //#region busquedasAutocompletado
  buscarProveedor(indice: number){
    console.log('llamado buscar proveedor para proveedor nro ', indice)
    const provs = this.forma.controls.proveedores as FormArray;
    let id = provs.controls[indice].value['idProveedor'];
    // console.log('buscando item ', id, provs.controls[indice])
    this._proveedorService.getCProveedor(id , this.token )
      .subscribe( data => {
          this.proveedorData = data;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            this.proveedor = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
          // console.log('resultado buscar proveedor para proveedor nro ', this.proveedorData)

          if(this.proveedorData.dataset.length>0){
            this.proveedor = this.proveedorData.dataset[0];
            
            //rellenar descripcion
            ((this.forma.controls.proveedores as FormArray).
              controls[indice] as FormGroup).
                controls['razonSocial'].setValue(this.proveedor.name);
          } else {
            this.proveedor = null;
            
            //vaciar descripcion
            ((this.forma.controls.proveedores as FormArray).
              controls[indice] as FormGroup).
                controls['razonSocial'].setValue('');
          }
        }
      });
  }

  buscarDeposito(indice: number){
    // console.log('llamado buscar articulo para proveedor nro ', indice)
    const deps = this.forma.controls.depositos as FormArray;
    let id = deps.controls[indice].value['tg01_depositos_id_c'];
    // console.log('buscando item ', id, provs.controls[indice])
    this._articulosService.getDeposito(id , this.token )
      .subscribe( data => {
          this.depData = data;
          auxDepData = this.depData.dataset.length;
          if(this.depData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.deposito = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
          // console.log('resultado buscar articulo para deposito nro ', this.depData)

          if(this.depData.dataset.length>0){
            this.deposito = this.depData.dataset[0];
            
            //rellenar descripcion
            ((this.forma.controls.depositos as FormArray).
              controls[indice] as FormGroup).
                controls['name'].setValue(this.deposito.name);
          } else {
            this.deposito = null;
            
            //vaciar descripcion
            ((this.forma.controls.depositos as FormArray).
              controls[indice] as FormGroup).
                controls['name'].setValue('');
          }
        }
      });
  }

  buscarArtProveedor(indice: number){
    console.log('llamado buscar articulo para proveedor nro ', indice)
    const provs = this.forma.controls.proveedores as FormArray;
    let id = provs.controls[indice].value['artDeProveedor'];
    console.log('buscando item indice ' + indice, id, provs.controls[indice])
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
          this.artData = data;
          auxArtiData = this.artData.dataset.length;
          if(this.artData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.proveedor = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
          console.log('resultado buscar articulo para proveedor nro '+ indice, this.artData)

          if(this.artData.dataset.length>0){
            this.proveedor = this.artData.dataset[0];
            
            //rellenar descripcion
            ((this.forma.controls.proveedores as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name);
          } else {
            this.proveedor = null;
            
            //vaciar descripcion
            ((this.forma.controls.proveedores as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue('');
          }
        }
      });
  }

  buscarArtSust(indice: number){
    // console.log('llamado buscar articulo para sustituto nro ', indice)
    const arts = this.forma.controls.articulosSustitutos as FormArray;
    let id = arts.controls[indice].value['idArtSust'];
    // console.log('buscando item ', id, provs.controls[indice])
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
          this.artData = data;
          auxArtiData = this.artData.dataset.length;
          if(this.artData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.proveedor = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
          // console.log('resultado buscar articulo para sustituto nro ', this.artData)

          if(this.artData.dataset.length==1){
            this.artSust = this.artData.dataset[0];
            
            //rellenar descripcion
            ((this.forma.controls.articulosSustitutos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.artSust.name);
            ((this.forma.controls.articulosSustitutos as FormArray).
              controls[indice] as FormGroup).
                controls['idsustituto'].setValue(this.artSust.part_number);  
          } else {
            this.artSust = null;
            
            //vaciar descripcion
            ((this.forma.controls.articulosSustitutos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(null);
            ((this.forma.controls.articulosSustitutos as FormArray).
              controls[indice] as FormGroup).
                controls['idsustituto'].setValue(null);  
          }
        }
      });
  }

  buscarArtHijo(indice: number){
    // console.log('llamado buscar articulo para hijo nro ', indice)
    const arts = this.forma.controls.articulosHijos as FormArray;
    let id = arts.controls[indice].value['idArtHijo'];
    // console.log('buscando item ', id, provs.controls[indice])
    this._articulosService.getcArticulo(id , this.token )
      .subscribe( data => {
          this.artData = data;
          auxArtiData = this.artData.dataset.length;
          if(this.artData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.proveedor = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
          // console.log('resultado buscar articulo para hijo nro ', this.artData)

          if(this.artData.dataset.length==1){
            this.proveedor = this.artData.dataset[0];
            
            //rellenar descripcion
            ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name);
          } else {
            this.proveedor = null;
            
            //vaciar descripcion
            ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue('');
          }
        }
      });
  }
  
  buscarGrupo(){
    // console.log('llamado buscar grupo para base ', indice)
    // const arts = this.forma.controls.articulosHijos as FormArray;
    // let id = arts.controls[indice].value['idArtHijo'];
    // console.log('buscando item ', id, provs.controls[indice])
    // this._articulosService.getcArticulo(id , this.token )
    this._articulosService.getCategoria(this.forma.controls['idGrupo'].value, this.token)
      .subscribe( data => {
          this.gData = data;
          auxGrupoData = this.gData.dataset.length;
          if(this.gData.returnset[0].RCode=="-6003"){
            //token invalido
            this.grupo = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('buscar grupo para base con :', this.forma.controls['idGrupo'].value)
          console.log('resultado buscar grupo para base ', this.gData)

          if(this.gData.dataset.length>0){
            this.grupo = this.gData.dataset[0];
            
            //rellenar descripcion
            this.forma.controls['nombreGrupo'].setValue(this.grupo.name);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name); */
          } else {
            this.grupo = null;
            
            //vaciar descripcion
            this.forma.controls['nombreGrupo'].setValue(null);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(''); */
          }
        }
      });
  }

  buscarMarca(){
    // console.log('llamado buscar grupo para base ', indice)
    // const arts = this.forma.controls.articulosHijos as FormArray;
    // let id = arts.controls[indice].value['idArtHijo'];
    // console.log('buscando item ', id, provs.controls[indice])
    // this._articulosService.getcArticulo(id , this.token )
    this._articulosService.getMarca(this.forma.controls['idMarca'].value, this.token)
      .subscribe( data => {
          this.marData = data;
          auxMarcaData = this.marData.dataset.length;
          if(this.marData.returnset[0].RCode=="-6003"){
            //token invalido
            this.marca = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('buscar marca para base con :', this.forma.controls['idMarca'].value)
          console.log('resultado buscar marca para base :', this.marData)

          if(this.marData.dataset.length>0){
            this.marca = this.marData.dataset[0];
            
            //rellenar descripcion
            this.forma.controls['nombreMarca'].setValue(this.marca.name);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name); */
          } else {
            this.marca = null;
            
            //vaciar descripcion
            this.forma.controls['nombreMarca'].setValue(null);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(''); */
          }
        }
      });
  }

  buscarUMs(){
    if (this.unidadesMedidaAll != null){
      let listaUMs = [{id: 'umCompras', desc: 'umComprasDesc'},
                      {id: 'umOCompra', desc: 'umOCompraDesc'},
                      {id: 'umPCompra', desc: 'umPCompraDesc'},
                      {id: 'umVentas', desc: 'umVentasDesc'},
                      {id: 'umPVenta', desc: 'umPVentaDesc'}]

      let unidades = this.unidadesMedidaAll as UnidadMedida[];
      console.log('buscando unidades alternativas con ', listaUMs, unidades);
      listaUMs.forEach(um => {
        let unidadEncontrada = unidades.find(unidad => unidad.id == this.forma.controls[um.id].value);
        if(unidadEncontrada != null){
          this.forma.controls[um.desc].setValue(unidadEncontrada.name);
        }
        console.log('buscando descripcion para: ', um, unidadEncontrada)
        // this.forma.controls[um.desc].setValue(unidades.find(unidad => unidad.id == this.forma.controls[um.id].value));
      });
    }
  }
  //#endregion busquedasAutocompletado

  //modal
  //agregado agregar indice y array para escribir el resultado en donde corresponda con control
  /* abrirConsulta2(consulta: string, control: string, control2: string, ubicacion: any[], funcion: string, param: any){
    console.log(' recibido por abrirconsulta2: ', consulta, control, control2, ubicacion);
    if (ubicacion.length == 0 )
    (this.forma.get(ubicacion) as FormGroup).controls[control].setValue('1');
    let fg = (this.forma.get(ubicacion) as FormGroup);
    fg.controls[control2].setValue('2');
    // this['openSnackBar']('i');
    this[funcion](param);
  } */
  
  //usa el mismo formato que los get de formcontrol: ej ['coleccion', indice_en_array...]
  abrirConsulta(consulta: string, ubicacion: any[], controlID: string, controlDesc?: string, funcion?: string, param?: any){
    console.clear();
    console.log(' recibido por abrirconsulta1: ', consulta, controlID, controlDesc, ubicacion, funcion, param);
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
    let atributoDesc:  string = 'name';
    switch (consulta) {
      case 'c_proveedores':
        atributoAUsar = 'codigo';
        break;
      // case 'c_articulos':
      //   // atributoAUsar = 'idcategoria';
      //   atributoAUsar = '';
      //   break;
      default:
        atributoAUsar = 'id';
        // atributoDesc = 'name';
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
          // this.forma.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
          // ==>
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
  
  testcampos(){
    console.log('lista de valores todos ', this.valoresAtributosArticuloAll);
    console.log('observables: ', this.obsValoresAtributos0, this.obsValoresAtributos1, this.obsValoresAtributos2)
    console.log('test con verdadero valor')
    let cantidad = this.atributosArticuloAll.length;
    if (cantidad != 3){
      for (let index = cantidad; index < 3; index++) {
        // const element = array[index];
        console.log('buscando idCampo'+(index+1));
        let campo = this.forma.get('idCampo'+(index+1)) as FormControl;
        console.log('formcontrol: ', campo);
        campo.reset();
        campo.disable();
      }
    }

    console.log('test con cantidad = 1');
    cantidad = 1
    for (let index = cantidad; index < 3; index++) {
      // const element = array[index];
      console.log('buscando idCampo'+(index+1));
      let campo = this.forma.get('idCampo'+(index+1)) as FormControl;
      console.log('formcontrol: ', campo);
      
    }
  }

  seleccionarTipo(value){
    if (value != 2){
      this.habilitarAtributos();  
    }
    else
    {
      this.forma.controls['idCampo1'].disable();
      this.forma.controls['idCampo2'].disable();
      this.forma.controls['idCampo3'].disable();
    }
  }

  habilitarAtributos(){
    this.forma.controls['idCampo1'].enable();
    this.forma.controls['idCampo2'].enable();
    this.forma.controls['idCampo3'].enable();
    let cantidad = this.atributosArticuloAll.length;
    if (cantidad != 3){
      for (let index = cantidad; index < 3; index++) {
        // const element = array[index];
        console.log('buscando idCampo'+(index+1));
        let campo = this.forma.get('idCampo'+(index+1)) as FormControl;
        console.log('formcontrol: ', campo);
        campo.reset();
        campo.disable();
      }
    }
  }

  calcularM3(){
    // (largo*ancho*profundo)/ 1000000
    let largo = this.forma.controls['largo'].value;
    let ancho = this.forma.controls['ancho'].value;
    let profundidad = this.forma.controls['profundidad'].value;

    if(( largo == undefined )||( ancho == undefined )||( profundidad == undefined )){
      this.forma.controls['m3'].setValue(null);
    }
    else{
      this.forma.controls['m3'].setValue(largo*ancho*profundidad/1000000);
    }
  }

  extraerFecha(control: FormControl){
    console.log('control a usar para fecha: ', control)
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
  nuevaFecha(dateString: string){
    //agregado 1 día a la fecha para que se muestre correctamente en el datepicker
    let fecha = new Date(dateString);
    fecha.setDate(fecha.getDate() +1);
    return fecha;
  }

  cargarFoto(attachment, i){
    this.adjunto = attachment.files[0];
    console.clear();
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
  
         let fgFoto: FormGroup = <FormGroup>this.forma.get(['fotos', i]);
         fgFoto.controls['foto'].setValue(this.urlImagen);
    
      //   this.inputParam.url = this.urlImagen
       });
    //   this.guardar();
  }
}
