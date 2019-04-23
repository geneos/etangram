import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { MonedasService } from 'src/app/services/i2t/monedas.service';
import { TiposComprobanteService } from 'src/app/services/i2t/tipos-comprobante.service';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { ParametrosService } from 'src/app/services/i2t/parametros.service';
import { Parametros } from 'src/app/interfaces/parametros.interface';
import { TipoComprobante } from 'src/app/interfaces/tipo-comprobante.interface';
import { Moneda } from 'src/app/interfaces/moneda.interface';
import { OrganizacionesService } from 'src/app/services/i2t/organizaciones.service';
import { Organizacion } from 'src/app/interfaces/organizacion.interfac';
import { MinContable, MinContableDet } from 'src/app/interfaces/min-contable.interface';
import { CajasService } from 'src/app/services/i2t/cajas.service';
import { RefContablesService } from 'src/app/services/i2t/ref-contables.service';
import { RefContable,RefContableItem } from 'src/app/interfaces/ref-contable.interface';
import { CentroCosto } from 'src/app/interfaces/cen-costo.interface';
import { CentrosCostosService } from 'src/app/services/i2t/cen-costos.service';
import { MinContablesService } from 'src/app/services/i2t/min-contables.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { CdkRowDef } from '@angular/cdk/table';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { filter } from "rxjs/operators";
import { PlatformLocation } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ResourceLoader } from '@angular/compiler';
import { componentRefresh } from '@angular/core/src/render3/instructions';
//import { resetApplicationState } from '@angular/core/src/render3/instructions';

// key that is used to access the data in local storage
const TOKEN = '';
var auxDetId:number;
var auxRefConData,auxCCostoData:any;
var auxdatasource = new MatTableDataSource
var auxDebe, auxHaber:any;
@Injectable()

@Component({
  selector: 'app-alta-min-contable',
  templateUrl: './alta-min-contable.component.html',
  styleUrls: ['./alta-min-contable.component.css']
})

export class AltaMinContableComponent implements OnInit {
  history: History;
  dataDet: any;
/*
//todo borrar, cambiar por lo real
datos =
  {
    returnset: [
        {
            RCode: 1,
            RTxt: 'OK',
            RId: null,
            RSQLErrNo: 0,
            RSQLErrtxt: 'OK'
        }
    ],
    dataset: [
        {
            id: '1',
            name: 'Test 1',
            estado: 0,
            assigned_user_id: 1,
            created_by: 'lsole',
            date_entered: '01/12/2018',
            date_modified: '01/12/2018',
            deleted: 0,
            tg01_monedas_id2_c: '1',
            account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
            tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
            fecha: '01/12/2018',
            tg01_cajas_id_c: 'd336b046-ee63-11e8-ab85-d050990fe081'
        },
        {
          id: '2',
          name: 'Test 2',
          estado: 0,
          assigned_user_id: 1,
          created_by: 'lsole',
          date_entered: '01/12/2018',
          date_modified: '01/12/2018',
          deleted: 0,
          tg01_monedas_id2_c: '1',
          account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
          tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
          fecha: '02/12/2018',
          tg01_cajas_id_c: 'd50a0d5c-c723-88d6-85df-5bf882d33847'
      },
      {
        id: '3',
        name: 'Test 3',
        estado: 0,
        assigned_user_id: 1,
        created_by: 'lsole',
        date_entered: '01/12/2018',
        date_modified: '01/12/2018',
        deleted: 0,
        tg01_monedas_id2_c: '1',
        account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
        tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
        fecha: '03/12/2018',
        tg01_cajas_id_c: 'd336b046-ee63-11e8-ab85-d050990fe081'
      }
    ]
  }
  /////
*/
  // editingRenglones:boolean = false;
  // agregarReng:boolean = true;

  editingCabecera:boolean = true;
  addingReferencia:boolean = false;
  addingItem:boolean = false;
  editingAI:boolean = false;
  editingID: string;
  auxEditingArt:number = null;

   referenciasData: any[] = [];
  refContableItemData: RefContableItem[] = []
  tienectocosto:number = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableReferencias') table: MatTable<any>;
  @ViewChild('codRef') refContableId: any;
  //dataSource = new MatTableDataSource(this.refContableItemData)
  dataSource = new MatTableDataSource(this.refContableItemData)
 // displayedColumns: string[] = ['opciones', 'refContable', 'centroDeCosto', 'debe', 'haber'];

  selection = new SelectionModel(true, []);
  //referenciasDataSource = new MatTableDataSource(this.referenciasData);

  loginData: any;
  // token: string = "a";
  token: string;
  existe:boolean;
  existenDetalles:boolean;
  loading:boolean;
  logueado:boolean = true;

  //parametros
  pData: any;
  parametrosSistema: Parametros;

  tcData:any;
  tipoComprobante: TipoComprobante;

  mData:any;
  moneda: Moneda;

  oData: any;
  organizacion: Organizacion;
  //
  //listas|combobox
  cData: any;
  cajasAll: any[]= [{ id: 0, name: 'Cargando'}]
  //
 // auxdatasource = new MatTableDataSource(this.refContableItemData)
  minutaContable: MinContable;
  detallesAll: MinContableDet[];
  mcData: any;
  mcdData:any;
  //todo revisar
  cabeceraId: string;
  renglonId: string;
  refContableData: any;
  //refContableItemData: RefContableItem;
  centroCostoData: any;
  respCabecera: any;
  respRenglon: any;
  totaldebe: number = 0;
  totalhaber: number = 0;
  debeAnterior: number = 0;
  haberAnterior: number = 0;
  auxDebeHaber: boolean = false;
  auxDebeHaberMensaje: string = null;
  centroCosto: CentroCosto;
  refContable: RefContable;
  refeCont: any[] = [];
  forma:FormGroup;
  formaReferencias:FormGroup;

  //Para consulta Dinamica
  suscripcionConsDin: Subscription;
  itemDeConsulta: any;
  // Fin Para consulta dinamica
/*
  totalneto:number = 0;
  impuestosalicuotas:number = 0;
  totaltotal:number = 0;

  posicionesFiscales: string[] = ["N/D","IVA Responsable Inscripto","IVA Responsable no Inscripto",
"IVA no Responsable","IVA Sujeto Exento","Consumidor Final","Responsable Monotributo",
"Sujeto no Categorizado","Proveedor del Exterior","Cliente del Exterior","IVA Liberado - Ley N° 19.640",
"IVA Responsable Inscripto - Agente de Percepción","Pequeño Contribuyente Eventual",
"Monotributista Social","Pequeño Contribuyente Eventual Social"]; */

  // @ViewChild('tableArticulos') table: MatTable<any>;//

  //todo cambiar
urlAnterior: string;
  constructor(public dialogArt: MatDialog,
              public location: PlatformLocation,
              private  _minContableService: MinContablesService,
              private _refContableService: RefContablesService,
              private _centroCostoService: CentrosCostosService,
              private _monedaService: MonedasService,
              private _tipoComprobanteService: TiposComprobanteService,
              private _organizacionService: OrganizacionesService,
              private _parametrosService: ParametrosService,
              private _cajasService: CajasService,
              private route:ActivatedRoute,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public snackBar: MatSnackBar,
              public ngxSmartModalService: NgxSmartModalService,
              @Inject(SESSION_STORAGE) private storage: StorageService) {


                console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
                this.token = localStorage.getItem('TOKEN')
               // this.token = this.storage.get(TOKEN);
               if (localStorage.length == 0){
                this.loading = true;
                this.logueado = false;     
              } else {
                this.loading = false;
              } 
              
    this.forma = new FormGroup({
      'fecha': new FormControl('',Validators.required),
      'tipo': new FormControl(),
      'numero': new FormControl(),
      'organizacion': new FormControl(),
      'moneda': new FormControl(),
      'caja': new FormControl('',Validators.required),
      'observaciones': new FormControl()
    })


    //atributos de salida, no se pueden editar
    this.forma.controls['tipo'].disable();
    this.forma.controls['numero'].disable();
    this.forma.controls['organizacion'].disable();
    this.forma.controls['moneda'].disable();
    this.forma.controls['fecha'].enable();
    this.forma.controls['observaciones'].enable();
        

    this.formaReferencias = new FormGroup({
      'refContable': new FormControl('',Validators.required,this.existeRefContable),
      'nombreRefContable': new FormControl('',Validators.required,this.existeRefContable),
      'centroDeCosto': new FormControl('',Validators.required,this.existeCentroCosto),
      'debe': new FormControl(this.esDebeHaberValido),
      'haber': new FormControl(this.esDebeHaberValido)
    })

    this.formaReferencias.controls['refContable'].disable();
  
    this.formaReferencias.controls['nombreRefContable'].disable();
    this.formaReferencias.controls['centroDeCosto'].disable();
    this.formaReferencias.controls['debe'].disable();
    this.formaReferencias.controls['haber'].disable();

    //cargar listas para combobox
    console.log('rellenando comboboxes')
    this.buscarCajas();
    
    
    this.route.params.subscribe( parametros=>{
      this.cabeceraId = parametros['id'];
      this.existe = false;
      
      if( this.cabeceraId !== 'nuevo' ){
        this.editingCabecera=true;
        this.buscarMinutasContables(this.cabeceraId);
        //cargar lista de referencias contables
        if (this.minutaContable != null){
          this.buscarMinutasContablesDet(this.minutaContable.id);
          //habilitar campos de detalles/renglones
          this.formaReferencias.controls['refContable'].enable();
          this.formaReferencias.controls['nombreRefContable'].enable();
          this.formaReferencias.controls['centroDeCosto'].enable();
          this.formaReferencias.controls['debe'].enable();
          this.formaReferencias.controls['haber'].enable();
  
        }
      } else  {
        this.loading = false;
        //todo borrar console
        console.log('Obtener parametros');

        //obtener valores parametrizados
        this.buscarParametros(true);
        this.forma.reset()
        this.forma.controls['caja'].enable();
        console.log('editando cabecera? ', this.editingCabecera)
        //establecer valores de salida
        //this.buscarTipoComprobante(this.parametrosSistema.tg01_tipocomprobante_id_c);
        //this.forma.controls['tipo'].setValue(this.tipoComprobante.name);
        //this.buscarOrganizacion(this.parametrosSistema.account_id1_c);
        //this.forma.controls['organizacion'].setValue(this.organizacion.NAME);
        //this.buscarMoneda(this.parametrosSistema.tg01_monedas_id2_c);
        //this.forma.controls['moneda'].setValue(this.moneda.name);
        this.forma.controls['fecha'].enable();
        this.forma.controls['fecha'].setValue(new Date());
      //  this.editingCabecera = true;
        this.formaReferencias.reset()
        

       // this.dataSource = null;
      }

      //this.forma.controls['nomenclador'].disable();
      

    });

    // this.formaReferencias.controls['refContable'].valueChanges.subscribe(() => {
    //   setTimeout(() => {
    //     console.log('hubo un cambio')
    // //    console.log('estado después de timeout ',this['provinciaEnv'])  
    //     this.refContableId.nativeElement.dispatchEvent(new Event('keyup'));
    //   })
    // });
    location.onPopState(() => {
      console.log('Atras')
      this.router.navigate(["/min-contables"]); 
      });
  }


  ngOnInit() {
    
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }
  
  
  buscarParametros(incluirOrg: boolean){
    
    console.log('buscando parametros');
    this._parametrosService.getParametros( this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataP => {
        console.log('datap = ', dataP);
          this.pData = dataP;
          //auxRefConData = this.mcData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            this.parametrosSistema = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._parametrosService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarParametros(incluirOrg);
              });
            } else {
              console.log('respuesta buscar parametros', this.pData);
              if(this.pData.dataset.length>0){
                this.parametrosSistema = this.pData.dataset[0];
                this.buscarTipoComprobante(this.parametrosSistema.tg01_tipocomprobante_id_c);
                this.buscarMoneda(this.parametrosSistema.tg01_monedas_id2_c);
                if (incluirOrg){
                  this.buscarOrganizacion(this.parametrosSistema.account_id1_c);
                }
                console.log('parametros encontrados ok: ', this.pData);

              }
              else
              {
                console.log('no se encontro parametros')
              }
            }
      });
  }

  buscarTipoComprobante(auxid:string){
    this._tipoComprobanteService.getTipoComprobante( auxid, this.token )
      .subscribe( dataTC => {
        console.log(dataTC);
          this.tcData = dataTC;
          //auxRefConData = this.mcData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            /*this.tipoComprobante = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._parametrosService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTipoComprobante(auxid);
              });*/
              console.log('token invalido')
            } else {
              console.log('buscando tipo de comprobante con ' + auxid);
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset[0];
                this.forma.controls['tipo'].setValue(this.tipoComprobante.name);

                console.log('tipo comprobante recuperado: ', this.tipoComprobante);

              }
              console.log('buscando tipo de comprobante con ' + auxid + ': NO ENCONTRADO');
            }

      });
  }

  buscarMoneda(auxid:string){
    this._monedaService.getMoneda( auxid, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataM => {
        console.log(dataM);
          this.mData = dataM;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mData.returnset[0].RCode=="-6003"){
            //token invalido
            this.moneda = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._parametrosService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMoneda(auxid);
              });
            } else {
              console.log('buscada moneda con ', auxid)
              if(this.mData.dataset.length>0){
                this.moneda = this.mData.dataset[0];
                this.forma.controls['moneda'].setValue(this.moneda.name);
                console.log('moneda encontrada: ', this.moneda)
              }
              else{
                console.log('no s eencontro moneda')
              }
            }

      });
  }

  buscarOrganizacion(auxid:string){
    this._organizacionService.getOrganizacion( auxid, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataO => {
        console.log(dataO);
          this.oData = dataO;
          //auxRefConData = this.mcData.dataset.length;
          if(this.oData.returnset[0].RCode=="-6003"){
            //token invalido
            this.organizacion = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._parametrosService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarOrganizacion(auxid);
              });
            } else {
              console.log('organizacion con '+auxid+': ');
              if(this.oData.dataset.length>0){
                this.organizacion = this.oData.dataset[0];
                this.forma.controls['organizacion'].setValue(this.organizacion.NAME);
                console.log('org encontrada: ', this.organizacion);
              }
              console.log('organizacion con '+auxid+': no encontrada');
            }

      });
  }

  buscarCajas(){
    console.log('buscando cajas');
    this._cajasService.getCajas( this.token )
      .subscribe( dataC => {
        //console.log(dataC);
        this.cData = dataC;
        //auxRefConData = this.refContableData.dataset.length;
        if(this.cData.returnset[0].RCode=="-6003"){
          //token invalido
          this.cajasAll = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._cajasService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.buscarCajas();
            });
          } else {
            if(this.cData.dataset.length>0){
              console.log('cajas encontradas: ', this.cajasAll);
              this.cajasAll = this.cData.dataset;
              console.log(this.cajasAll);
              this.loading = false;
              /*
              this.constMinContables = new MatTableDataSource(this.minContablesAll);

              this.constMinContables.sort = this.sort;
              this.constMinContables.paginator = this.paginator;
*/
              //this.table.renderRows();
              //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

            } else {
              console.log('No se encontró cajas');
              this.cajasAll = null;
            }
          }
          //console.log(this.minContablesAll);
    });


  }

  buscarMinutasContables(auxid:string){

    let jsbody = {
      "ID_Comprobante":auxid,
      "Id_Cliente":"",
      "Fecha_desde":"",
      "Fecha_hasta":"",
      "param_limite":"1",
      "param_offset":"0"
  };
  let jsonbody= JSON.stringify(jsbody);
    //obtener datos
    //obtener descripciones
   /*  this.buscarTipoComprobante(this.minutaContable.tg01_tipocomprobante_id_c);
    this.buscarOrganizacion(this.minutaContable.account_id1_c);
    this.buscarMoneda(this.minutaContable.tg01_monedas_id2_c);

    //mostrar datos
    console.log('Mostrar datos: ');
    //this.forma.controls['fecha'].setValue(this.minutaContable.fecha);
    this.forma.controls['fecha'].setValue(new Date(this.minutaContable.fecha));
    console.log(this.minutaContable.fecha);
    this.forma.controls['caja'].setValue(this.minutaContable.tg01_cajas_id_c);
    console.log(this.minutaContable.tg01_cajas_id_c);
    //habilitar edición de renglones
    this.editingCabecera = false; */
    console.log('json armado: ', jsonbody);

    this._minContableService.getMinContables( jsonbody, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataMC => {
        console.log(dataMC);
          this.mcData = dataMC;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mcData.returnset[0].RCode=="-6003"){
            //token invalido
            /*this.minutaContable = null;
            let jsbodyl = {"usuario":"usuario1","pass":"password1"}
            let jsonbodyl = JSON.stringify(jsbodyl);
            this._minContableService.login(  jsonbodyl )
              .subscribe( dataL => {
                console.log('resultado login');
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMinutasContables(auxid);
              });*/
              console.log('token invalido')
            } else {
              if(this.mcData.dataset.length>0){
                this.minutaContable = this.mcData.dataset[0];
                this.existe = true;
                if (this.existe == true){
                  //console.log(this.planDeCuentas);

                  //usado el parametro, actualmente no se guarda por la api
                  // this.buscarMoneda(this.parametrosSistema.tg01_monedas_id2_c);
                  this.buscarParametros(false);

                  this.loading = false;
                  this.editingCabecera = false;

                  //todo corregir fecha
                  // this.forma.controls['fecha'].setValue(this.minutaContable.fecha);
                  let fecha = new Date(this.minutaContable.fecha);
                  // fecha.setMinutes(fecha.getMinutes() + -180);
                  fecha.setDate(fecha.getDate() + 1);
                  this.forma.controls['fecha'].setValue(fecha);

                  this.forma.controls['observaciones'].setValue(this.minutaContable.description);
                  this.forma.controls['observaciones'].disable();

                  this.forma.controls['caja'].setValue(this.minutaContable.idcajaorigen);
                  this.forma.controls['caja'].disable();

                  this.forma.controls['numero'].setValue(this.minutaContable.name);
                  

                  console.log('pidiendo tipo op con: ');
                  console.log(this.minutaContable);
                  this.buscarTipoComprobante(this.minutaContable.id);
                  //todo cambiar por lo del objeto cargado cuando se pueda traer solo minutas
                  this.forma.controls['organizacion'].setValue(this.minutaContable.nombre_fantasia_c);
                  // this.buscarTipoComprobante('43966f4a-4fc8-11e8-b1a0-d050990fe081');
                  console.log('buscando organizacion con '+this.minutaContable.account_id_c);
                  this.buscarOrganizacion(this.minutaContable.account_id_c);

                  this.buscarMinutasContablesDet(this.minutaContable.id);

                 /*  this.forma.controls['cuentacontable'].setValue(this.planDeCuentas.cuentacontable);
                  this.forma.controls['name'].setValue(this.planDeCuentas.name);
                  this.forma.controls['nomenclador'].setValue(this.planDeCuentas.nomenclador);
                  this.forma.controls['nomencladorpadre'].setValue(this.planDeCuentas.nomencladorpadre);
                  this.forma.controls['orden'].setValue(this.planDeCuentas.orden);
                  this.forma.controls['imputable'].setValue(this.planDeCuentas.imputable.toString());
                  this.forma.controls['patrimonial'].setValue(this.planDeCuentas.patrimonial.toString());
                  this.forma.controls['estado'].setValue(this.planDeCuentas.estado.toString()); */
                }
              } else {
                this.minutaContable = null;
                this.existe = false;
                if (this.existe == false){
                  console.log('no existe este id!');
                  this.openSnackBar('La Minuta Contable no existe');
                  this.forma.controls['fecha'].disable();
                  this.forma.controls['observaciones'].disable();
                  /* this.forma.controls['cuentacontable'].disable();
                  this.forma.controls['name'].disable();
                  this.forma.controls['imputable'].disable();
                  this.forma.controls['patrimonial'].disable();
                  this.forma.controls['nomenclador'].disable();
                  this.forma.controls['nomencladorpadre'].disable();
                  this.forma.controls['orden'].disable();
                  this.forma.controls['estado'].disable(); */
                }
              }
            }

      });

  }

  buscarMinutasContablesDet(auxid:string){
    this.existenDetalles = false;//
    let jsbody = {

      "ID_ComprobanteCab":auxid,

      "ID_ComprobanteDet": "", //docu dice no obligatorio, pero si no está no trae nada (aunque no de error)

      "Fecha_desde":"",

      "Fecha_hasta":"",

      "param_limite":"1000",

      "param_offset":"0"

  };
  let jsonbody= JSON.stringify(jsbody);
    //obtener datos
    //obtener descripciones
   /*  this.buscarTipoComprobante(this.minutaContable.tg01_tipocomprobante_id_c);
    this.buscarOrganizacion(this.minutaContable.account_id1_c);
    this.buscarMoneda(this.minutaContable.tg01_monedas_id2_c);

    //mostrar datos
    console.log('Mostrar datos: ');
    //this.forma.controls['fecha'].setValue(this.minutaContable.fecha);
    this.forma.controls['fecha'].setValue(new Date(this.minutaContable.fecha));
    console.log(this.minutaContable.fecha);
    this.forma.controls['caja'].setValue(this.minutaContable.tg01_cajas_id_c);
    console.log(this.minutaContable.tg01_cajas_id_c);
    //habilitar edición de renglones
    this.editingCabecera = false; */
    console.log('json armado para detalles: ', jsonbody);

    this._minContableService.getMinContablesDet( jsonbody, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataMCD => {
        console.log(dataMCD);
          this.mcdData = dataMCD;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mcdData.returnset[0].RCode=="-6003"){
            //token invalido
            this.detallesAll = null;
            let jsbodyl = {"usuario":"usuario1","pass":"password1"}
            let jsonbodyl = JSON.stringify(jsbodyl);
            this._minContableService.login(  jsonbodyl )
              .subscribe( dataL => {
                console.log('resultado login');
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMinutasContablesDet(auxid);
              });
            } else {
              if(this.mcdData.dataset.length>0){
                this.detallesAll = this.mcdData.dataset;
                this.existenDetalles = true;
                
                if (this.existenDetalles == true){
                  console.log('lista de detalles obtenida: ', this.detallesAll);

                  //todo agregar cargado de detalles
                  let detAll: any =  JSON.stringify([this.detallesAll])
                  detAll = JSON.parse(detAll)
                  console.log(detAll)
                  console.log(detAll[0].length)

                  for (let i = 0; i < detAll[0].length; i++) {
                    detAll.forEach(detalle => {
                      let referencia: any;
                      
                      console.log(detalle[i].name)
                  
                      this._refContableService.getRefContablesPorNombre(this.token, detalle[i].name)
                        .subscribe(dataD => {
                         console.log(dataD)
                          this.dataDet = dataD
                          auxDetId = this.dataDet.dataset[0].id
                          if(detalle[i].precio > 0){
                            auxHaber = detalle[i].precio;
                            auxDebe = 0;
                            this.totalhaber = this.totalhaber + auxHaber
                          } else if(detalle[i].precio < 0){
                            auxDebe = detalle[i].precio*-1
                            auxHaber = 0;
                            this.totaldebe = this.totaldebe + auxDebe
                          }
                          this.refContableItemData.push({
                              refContable: auxDetId,
                              nombreRefContable: detalle[i].name,
                              centroDeCosto: '',
                              debe: auxDebe,
                              haber: auxHaber,
                              idEnMinuta: this.renglonId
                              });
                              this.dataSource = new MatTableDataSource(this.refContableItemData)
                              this.table.renderRows();
                              console.log(auxDetId)
                              console.log(i)
                      })
                    });
  
                  };  
                  let i: number = 0;
                  
                  
                  /*
                  this.refContableItemData.push({ refContable: this.formaReferencias.controls['refContable'].value,
                  nombreRefContable: this.formaReferencias.controls['nombreRefContable'].value,
                  centroDeCosto: this.formaReferencias.controls['centroDeCosto'].value,
                  debe: this.formaReferencias.controls['debe'].value,
                  haber: this.formaReferencias.controls['haber'].value });

                  this.dataSource = new MatTableDataSource(this.refContableItemData)
                  this.table.renderRows();
*/
                  this.loading = false;

                  // this.referenciasData = new MatTableDataSource(this.detallesAll);

                  // this.referenciasData.sort = this.sort;
                  // this.referenciasData.paginator = this.paginator;
                  // this.editingCabecera = false;

                  //todo corregir fecha
                  // // this.forma.controls['fecha'].setValue(this.minutaContable.fecha);
                  // let fecha = new Date(this.minutaContable.fecha);
                  // fecha.setMinutes(fecha.getMinutes() + -180);
                  // this.forma.controls['fecha'].setValue(fecha);

                  // this.forma.controls['observaciones'].setValue(this.minutaContable.description);

                  // console.log('pidiendo tipo op con: ');
                  // console.log(this.minutaContable);
                  // this.buscarTipoComprobante(this.minutaContable.id);
                  // //todo cambiar por lo del objeto cargado cuando se pueda traer solo minutas
                  // this.forma.controls['organizacion'].setValue(this.minutaContable.nombre_fantasia_c);
                  // // this.buscarTipoComprobante('43966f4a-4fc8-11e8-b1a0-d050990fe081');
                  // console.log('buscando organizacion con '+this.minutaContable.account_id_c);
                  // this.buscarOrganizacion(this.minutaContable.account_id_c);


                 /*  this.forma.controls['cuentacontable'].setValue(this.planDeCuentas.cuentacontable);
                  this.forma.controls['name'].setValue(this.planDeCuentas.name);
                  this.forma.controls['nomenclador'].setValue(this.planDeCuentas.nomenclador);
                  this.forma.controls['nomencladorpadre'].setValue(this.planDeCuentas.nomencladorpadre);
                  this.forma.controls['orden'].setValue(this.planDeCuentas.orden);
                  this.forma.controls['imputable'].setValue(this.planDeCuentas.imputable.toString());
                  this.forma.controls['patrimonial'].setValue(this.planDeCuentas.patrimonial.toString());
                  this.forma.controls['estado'].setValue(this.planDeCuentas.estado.toString()); */
                }
              } else {
                this.detallesAll = null;
                this.existenDetalles = false;
                if (this.existenDetalles == false){
                  console.log('no existen detalles!');
                  // this.forma.controls['fecha'].disable();
                  // this.forma.controls['observaciones'].disable();
                  /* this.forma.controls['cuentacontable'].disable();
                  this.forma.controls['name'].disable();
                  this.forma.controls['imputable'].disable();
                  this.forma.controls['patrimonial'].disable();
                  this.forma.controls['nomenclador'].disable();
                  this.forma.controls['nomencladorpadre'].disable();
                  this.forma.controls['orden'].disable();
                  this.forma.controls['estado'].disable(); */
                }
              }
            }

      });

  }

  existeRefContable( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxRefConData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  existeCentroCosto( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxCCostoData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  esDebeHaberValido(){
    //si los dos tienen valor, o ninguno de los dos tiene valor, o los dos son 0
    /*
    if((this.formaReferencias.controls['debe'].value == null
        && this.formaReferencias.controls['haber'].value ==null) ||
       (!(this.formaReferencias.controls['debe'].value == null)
        && !(this.formaReferencias.controls['haber'].value == null)) ||
        (this.formaReferencias.controls['debe'].value === 0
        && this.formaReferencias.controls['haber'].value ===0) ){
          console.log('debehaber INvalido');
          console.log(this.formaReferencias.controls['debe'].value);
          console.log(this.formaReferencias.controls['haber'].value);
          return false;
    }
    else{
      console.log('debehaber valido');
      console.log(this.formaReferencias.controls['debe'].value);
      console.log(this.formaReferencias.controls['haber'].value);
      return true;
    }
    */
   /*
    if ((((this.formaReferencias.controls['debe'].value === null)&&(this.formaReferencias.controls['haber'].value > 0))
      ||((this.formaReferencias.controls['debe'].value > 0)||(this.formaReferencias.controls['haber'].value === null)))
      &&!((this.formaReferencias.controls['debe'].value > 0)&&(this.formaReferencias.controls['haber'].value > 0)))
      {
        console.log('debehaber valido');
        console.log(this.formaReferencias.controls['debe'].value);
        console.log(this.formaReferencias.controls['haber'].value);
      }
    else{
      console.log('debehaber INvalido');
      console.log(this.formaReferencias.controls['debe'].value);
      console.log(this.formaReferencias.controls['haber'].value);
      return false;
    }

    return true;
    */
    // let debe = this.formaReferencias.controls['debe'].value;
    // let haber = this.formaReferencias.controls['haber'].value;

    if ((this.formaReferencias.controls['debe'].value > 0) && (this.formaReferencias.controls['haber'].value > 0)){
      //No puede ingresar un Debe y un Haber al mismo tiempo
      console.log("No puede ingresar un Debe y un Haber al mismo tiempo")
      this.auxDebeHaberMensaje = "No puede ingresar un importe en Debe y Haber al mismo tiempo";
      this.auxDebeHaber = false
      return false;
    }

    if ((this.formaReferencias.controls['debe'].value === null || this.formaReferencias.controls['debe'].value === 0) && (this.formaReferencias.controls['haber'].value === null || this.formaReferencias.controls['haber'].value === 0)){
      //Debe ingresar un Debe o un Haber
      console.log('Debe ingresar uno de los dos')
      this.auxDebeHaberMensaje = "Es necesario ingresar un Importe";
      this.auxDebeHaber = false
      return false;
    }



    if (!(this.formaReferencias.controls['haber'].value === null)&&(this.formaReferencias.controls['debe'].value < 0)){
      //Debe ingresar un Debe positivo
      this.auxDebeHaber = false
      console.log("Debe Ingresar un Debe Positivo");
      this.auxDebeHaberMensaje = "Debe Ingresar un Debe Positivo";
      // this.openSnackBar('Debe Ingresar un Debe Positivo');
      return false;
    }

    if (!(this.formaReferencias.controls['debe'].value === null)&&(this.formaReferencias.controls['haber'].value < 0)){
      //Debe ingresar un Haber positivo
      this.auxDebeHaber = false
      console.log("Debe Ingresar un Haber Positivo");
      this.auxDebeHaberMensaje = "Debe Ingresar un Haber Positivo";
      // this.openSnackBar('Debe Ingresar un Haber Positivo');
      return false;
    }
    this.auxDebeHaber = true;
    this.auxDebeHaberMensaje = "Debe / Haber Correcto";
    return true;
  }

  buscarRefContable(){
    this._refContableService.getRefContable( this.formaReferencias.controls['refContable'].value, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataRC => {
        console.log(dataRC);
          this.refContableData = dataRC;
          auxRefConData = this.refContableData.dataset.length;
          if(this.refContableData.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContableService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
            //    this.buscarRefContable();
              });
            } else {
              //validar que se haya encontrado 1 referencia
              //validar que la referencia no esté eliminada (deleted = 1)
              if((this.refContableData.dataset.length>0)&&(this.refContableData.dataset[0].deleted!==1)){
                this.refContable = this.refContableData.dataset[0];
                //(this.refContable.deleted !== 1)
                console.log('auto referencia: ');
                console.log(this.refContable);

                //centro de costo
                /*
                La referencia contable determina el uso de este atributo
                  - si no tiene centro de costo, se omite
                  - si ya tiene uno definido, se impone ese centro de costo y no se permite modificar
                  - si es variable, puede ingresar el valor y validar con el metodo tg01_centrocosto o bien seleccionarlo con el componente “consulta dinamica” “c_tg01_centrocosto”
                */
                if (this.refContable.id === null){
                  this.formaReferencias.controls['centroDeCosto'].setValue('');
                  this.formaReferencias.controls['centroDeCosto'].disable();
                  this.formaReferencias.controls['nombreRefContable'].setValue('');
                  this.formaReferencias.controls['nombreRefContable'].disable();
                }
                else{
                  //if (this.refContable.tg01_centrocosto_id_c.indexOf(',') != 0){
                    this.tienectocosto = this.refContable.tienectocosto;
                    console.log(this.tienectocosto)
                    if (this.tienectocosto == 2){
                      this.formaReferencias.controls['centroDeCosto'].enable();
                    } else{
                      this.formaReferencias.controls['centroDeCosto'].disable();
                    }
                    this.formaReferencias.controls['centroDeCosto'].setValue(this.refContable.tg01_centrocosto_id_c);
                    this.formaReferencias.controls['nombreRefContable'].setValue(this.refContable.name);

                    this.formaReferencias.controls['nombreRefContable'].disable();
                  /*}
                  else{
                    this.formaReferencias.controls['centroDeCosto'].setValue('');
                    this.formaReferencias.controls['centroDeCosto'].enable();
                    this.formaReferencias.controls['nombreRefContable'].setValue('');
                    this.formaReferencias.controls['nombreRefContable'].enable();
                  }*/
                }
              } else {
                this.refContable = null;
                this.formaReferencias.controls['centroDeCosto'].disable();
                this.formaReferencias.controls['nombreRefContable'].disable();
                //this.formaReferencias.controls['debe'].disable();
                //this.formaReferencias.controls['haber'].disable();
              }
            }
      });
  }

  buscarCentroCostos(){
    if(this.addingReferencia){
      this._centroCostoService.getCentro( this.formaReferencias.controls['centroDeCosto'].value, this.token )
        .subscribe( dataCC => {
          this.centroCostoData = dataCC;
          auxCCostoData = this.centroCostoData.dataset.length;
          if(this.centroCostoData.dataset.length>0){
            this.centroCosto = this.centroCostoData.dataset[0];
          } else {
            this.centroCosto = null;
          }
        });
    }
    if(this.addingItem){
      this._centroCostoService.getCentro( this.formaReferencias.controls['centroDeCosto'].value, this.token )
        .subscribe( dataCC => {
          this.centroCostoData = dataCC;
          auxCCostoData = this.centroCostoData.dataset.length;
          if(this.centroCostoData.dataset.length>0){
            this.centroCosto = this.centroCostoData.dataset[0];
          } else {
            this.centroCosto = null;
          }
        });
    }
  }

  addReferencia(){
    this.refContable = null;
    this.formaReferencias.controls['refContable'].enable();
    this.formaReferencias.controls['nombreRefContable'].enable();
    this.formaReferencias.controls['debe'].enable();
    this.formaReferencias.controls['haber'].enable();

    this.formaReferencias.controls['haber'].setValue(0);
    this.formaReferencias.controls['debe'].setValue(0);
    this.formaReferencias.controls['refContable'].setValue('');
    this.formaReferencias.controls['nombreRefContable'].setValue('');
    this.addingReferencia = true;
  }

  guardarReferencia(){

    // console.clear();
    console.log('guardando ref');
    this.esDebeHaberValido();
    if(this.auxDebeHaber){
    if(this.editingAI){
   //   this.totaldebe = this.totaldebe - this.refContableItemData[this.auxEditingArt].debe
      this.refContableItemData[this.auxEditingArt].refContable = this.formaReferencias.controls['refContable'].value,
      this.refContableItemData[this.auxEditingArt].nombreRefContable = this.formaReferencias.controls['nombreRefContable'].value,
      this.refContableItemData[this.auxEditingArt].centroDeCosto = this.formaReferencias.controls['centroDeCosto'].value,
      this.refContableItemData[this.auxEditingArt].debe = this.formaReferencias.controls['debe'].value,
      this.refContableItemData[this.auxEditingArt].haber = this.formaReferencias.controls['haber'].value

      // this.refContableItemData = [{ refContable: this.formaReferencias.controls['refContable'].value,
      //                               centroDeCosto: this.formaReferencias.controls['centroDeCosto'].value,
      //                               debe: this.formaReferencias.controls['debe'].value,
      //                               haber: this.formaReferencias.controls['haber'].value }]

      this.dataSource[this.auxEditingArt] = this.refContableItemData[this.auxEditingArt]

      if(this.debeAnterior != this.refContableItemData[this.auxEditingArt].debe){
        this.totaldebe = Number(this.totaldebe) - Number(this.debeAnterior)
        this.totaldebe = Number(this.totaldebe) + Number(this.refContableItemData[this.auxEditingArt].debe)
      }
      if(this.haberAnterior != this.refContableItemData[this.auxEditingArt].haber){
        this.totalhaber = Number(this.totalhaber) - Number(this.haberAnterior)
        this.totalhaber = Number(this.totalhaber) + Number(this.refContableItemData[this.auxEditingArt].haber)
      }
      this.guardarRenglon()
    //  this.dataSource[this.auxEditingArt] = this.refContableItemData;
      this.addingReferencia = false;
      this.editingAI = false;
      //update

      //actualizar en backend
      let importe: number;
      // if ((refContableDet.debe != null)&&(refContableDet.debe != 0)){
        if((this.formaReferencias.controls['debe'].value)&&(this.formaReferencias.controls['debe'].value)){
          // importe = 0- refContableDet.debe;
          importe = 0- this.formaReferencias.controls['debe'].value
        }
        else{
          // importe = 0+ refContableDet.haber;
          importe = 0+ this.formaReferencias.controls['haber'].value
        }
        let jsbody = {
          "ID_ComprobanteDet": this.editingID,
          "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080', //morecchia //todo cambiar por uno real
          "P_Importe": importe
        }
        console.log('stringifeando');
        let jsonbody= JSON.stringify(jsbody);
        console.log('String update detalle: ', jsonbody);
        this._minContableService.putMinContablesDet(jsonbody, this.token).subscribe( resp => {
          //console.log(resp.returnset[0].RId);
          this.respRenglon = resp;
          if(this.respRenglon.returnset[0].RCode=="-6003"){
            //token invalido
            // this.refContable = null;
            /*let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._minContableService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this._minContableService.postMinContablesDet(jsonbody, this.token);//todo comprobar
              });*/
              console.log('token invalido')
          }
          else{
            console.log('respuesta del put detalle >>');
            console.log(this.respRenglon);
            console.log('<< respuesta del put detalle');
            if (this.respRenglon.returnset[0].RCode == 1){
              // this.renglonId = this.respRenglon.returnset[0].RId;
              console.log(this.renglonId);
              this.openSnackBar('Datos guardados');
              // this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081

              // this.forma.controls['numero'].setValue(this.cabeceraId);
            }
            else{
              this.openSnackBar('No se pudo modificar el renglon de Minuta Contable');
            }

          }
          });
        //actualizar lista
        //todo todo
        let index = this.refContableItemData.findIndex((e) => e.idEnMinuta === this.editingID);

        if (index === -1) {
          this.refContableItemData.push();
        }
        else{
          this.refContableItemData[index] = { refContable: this.formaReferencias.controls['refContable'].value,
          nombreRefContable: this.formaReferencias.controls['nombreRefContable'].value,
          centroDeCosto: this.formaReferencias.controls['centroDeCosto'].value,
          debe: this.formaReferencias.controls['debe'].value,
          haber: this.formaReferencias.controls['haber'].value,
          idEnMinuta: this.editingID };
          // this.openSnackBar('No se pudo actualizar la lista mostrada');
        }
    }
    else {
      this.esDebeHaberValido();

      //obtener importe
      let importe: number;
      // if ((refContableDet.debe != null)&&(refContableDet.debe != 0)){
      if((this.formaReferencias.controls['debe'].value)&&(this.formaReferencias.controls['debe'].value)){
        // importe = 0- refContableDet.debe;
        importe = 0- this.formaReferencias.controls['debe'].value
      }
      else{
        // importe = 0+ refContableDet.haber;
        importe = 0+ this.formaReferencias.controls['haber'].value
      }

      let centro: string;
      if (this.formaReferencias.controls['centroDeCosto'].value == null){
        centro = '0';
      }
      else{
        centro =this.formaReferencias.controls['centroDeCosto'].value;
      }

      //determinar acción
      //insert
      let tipo: string;
      if (importe < 0){
        tipo = 'D';
      }
      else{
        tipo = 'H';
      }
      let jsbody = {
        "ID_ComprobanteCab": this.cabeceraId,
        "ID_Item": this.formaReferencias.controls['refContable'].value,
        "ID_CentroCosto": centro, //refContableDet.centroDeCosto,
        "P_TipoImputacion": tipo,
        "P_Importe": importe,
        "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080' //morecchia //todo cambiar por uno real
      }

      console.log('stringifeando');
      let jsonbody= JSON.stringify(jsbody);
      console.log('string insert detalle: ', jsonbody);
      //guardar id de renglon
      this._minContableService.postMinContablesDet(jsonbody, this.token).subscribe( resp => {
        //console.log(resp.returnset[0].RId);
        this.respRenglon = resp;
        if(this.respRenglon.returnset[0].RCode=="-6003"){
          //token invalido
          // this.refContable = null;
          /*let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._minContableService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this._minContableService.postMinContablesDet(jsonbody, this.token);//todo comprobar
            });*/
            console.log('token invalido');
        }
        else{
          console.log('respuesta del post detalle >>');
          console.log(this.respRenglon);
          console.log('<< respuesta del post detalle');
          if (this.respRenglon.returnset[0].RId != null){
            this.renglonId = this.respRenglon.returnset[0].RId;
            console.log(this.renglonId);
            // this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081

            this.refContableItemData.push({ refContable: this.formaReferencias.controls['refContable'].value,
            nombreRefContable: this.formaReferencias.controls['nombreRefContable'].value,
            centroDeCosto: this.formaReferencias.controls['centroDeCosto'].value,
            debe: this.formaReferencias.controls['debe'].value,
            haber: this.formaReferencias.controls['haber'].value,
            idEnMinuta: this.renglonId });

            this.dataSource = new MatTableDataSource(this.refContableItemData)
            this.table.renderRows();
            console.log(this.dataSource);
            auxdatasource = this.dataSource
            this.totaldebe = Number(this.totaldebe) + Number(this.formaReferencias.controls['debe'].value);
            this.totalhaber = Number(this.totalhaber) + Number(this.formaReferencias.controls['haber'].value);
            this.addingReferencia = false;
            this.editingAI = false;

            this.openSnackBar('Datos guardados');
            
            // this.forma.controls['numero'].setValue(this.cabeceraId);
          }
          else{
            this.openSnackBar('No se pudo crear el renglon de Minuta Contable');
          }

        }


        })

    }
   }
   else {
      this.openSnackBar(this.auxDebeHaberMensaje);
      // this.openSnackBar('Se debe ingresar un Debe o un Haber');
   }
}
  eliminarReferencia(index){

    // console.clear();
    console.log('eliminando ref');
    let jsbody = {
      "ID_ComprobanteCab": this.cabeceraId,
      "ID_ComprobanteDet": this.refContableItemData[index].idEnMinuta,
      "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080' //morecchia //todo cambiar por uno real
    }

    //   let index: number = this.refContableItemData.findIndex(d => d === item);
    this.totaldebe = Number(this.totaldebe) - Number(this.refContableItemData[index].debe);
    this.totalhaber = Number(this.totalhaber) - Number(this.refContableItemData[index].haber);
    this.refContableItemData.splice(index,1);

    //eliminar del backend

    console.log('stringifeando');
    let jsonbody= JSON.stringify(jsbody);
    this._minContableService.delMinContablesDet(jsonbody, this.token)
    .subscribe( resp => {
      //console.log(resp.returnset[0].RId);
      this.respRenglon = resp;
      if(this.respRenglon.returnset[0].RCode=="-6003"){
        //token invalido
        // this.refContable = null;
        /*let jsbody = {"usuario":"usuario1","pass":"password1"}
        let jsonbody = JSON.stringify(jsbody);
        this._minContableService.login(jsonbody)
          .subscribe( dataL => {
            console.log(dataL);
            this.loginData = dataL;
            this.token = this.loginData.dataset[0].jwt;
            this._minContableService.postMinContablesDet(jsonbody, this.token);//todo comprobar
          });*/
          console.log('token invalido');
      }
      else{
        console.log('respuesta del delete detalle >>');
        console.log(this.respRenglon);
        console.log('<< respuesta del delete detalle');
        if (this.respRenglon.returnset[0].RCode === 1){

          this.openSnackBar('Renglon de Minuta Contable eliminado');
          // this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081

          // this.forma.controls['numero'].setValue(this.cabeceraId);
        }
        else{
          this.openSnackBar('No se pudo eliminar renglon de Minuta Contable');
        }

      }

    this.table.renderRows();
    });
  }

  editarReferencia(ind:number){

    // console.clear();
    console.log('editando referencia');
    this.editingAI = true;
    //this.compraArticulo = this.referenciasData[ind];
    console.log(this.refContableItemData[ind]);
    this.formaReferencias.controls['refContable'].setValue(this.refContableItemData[ind].refContable);
    this.formaReferencias.controls['nombreRefContable'].setValue(this.refContableItemData[ind].nombreRefContable);
    this.formaReferencias.controls['centroDeCosto'].setValue(this.refContableItemData[ind].centroDeCosto);
    this.formaReferencias.controls['debe'].setValue(this.refContableItemData[ind].debe);
    this.formaReferencias.controls['haber'].setValue(this.refContableItemData[ind].haber);
    //console.log(this.compraArticulo);
    this.debeAnterior = this.refContableItemData[ind].debe;
    this.haberAnterior = this.refContableItemData[ind].haber;
    this.auxEditingArt=ind;
    if(this.debeAnterior > 0){
      this.formaReferencias.controls['haber'].disable();
      this.formaReferencias.controls['debe'].enable();
    }
    else{
      this.formaReferencias.controls['haber'].enable();
      this.formaReferencias.controls['debe'].disable();
    }
    this.editingID = this.refContableItemData[ind].idEnMinuta;
    console.log('referencia id: ', this.editingID);
  };
  guardarRenglon(){
    this.refContableItemData.forEach(refContableDet => {
      //obtener importe
      let importe: number;
      if ((refContableDet.debe != null)&&(refContableDet.debe != 0)){
        importe = 0- refContableDet.debe;
      }
      else{
        importe = 0+ refContableDet.haber;
      }

      //determinar acción
        //insert
        let tipo: string;
        if (importe < 0){
          tipo = 'D';
        }
        else{
          tipo = 'H';
        }
        let jsbody = {
          "ID_ComprobanteCab": this.cabeceraId,
          "ID_Item": refContableDet.refContable,
          "ID_CentroCosto": refContableDet.centroDeCosto,
          "P_TipoImputacion": tipo,
          "P_Importe": importe,
          "ID_Usuario": 'lsole' //todo cambiar por uno real
        }
        console.log('stringifeando');
        let jsonbody= JSON.stringify(jsbody);
        console.log(jsonbody);
        this._minContableService.postMinContablesDet(jsonbody, this.token);

      //  this.openSnackBar('Datos guardados')
    ;})
  }
  guardarCabecera(){
    // console.clear();
    console.log('guardando cabecera');
    //this.editingCabecera = false;
    console.log('armando fecha');
    let ano = this.forma.controls['fecha'].value.getFullYear().toString();
    let mes = (this.forma.controls['fecha'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    let dia = this.forma.controls['fecha'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfecha = ano+"-"+mes+"-"+dia;
    console.log('armando json');

    console.log(auxfecha);
    // console.log(this.forma.controls['tipo'].value);
    console.log(this.tipoComprobante.id);
    console.log(this.forma.controls['caja'].value);
    console.log(this.forma.controls['moneda'].value);
    console.log(this.forma.controls['observaciones'].value);
    let auxObs = this.forma.controls['observaciones'].value;

    if (this.forma.controls['observaciones'].value == null){auxObs = "''"};
      console.log('observacion: "' + auxObs +'"');
    let jsbody = {
      // "ID_TipoComp":this.forma.controls['tipo'].value,
      "ID_TipoComp":this.tipoComprobante.id,
      "ID_Cliente":this.parametrosSistema.account_id1_c,//hardcoded, según parámetro
      "ID_Caja":this.forma.controls['caja'].value,
      "ID_Moneda":this.moneda.idmoneda,//this.forma.controls['moneda'].value,
      "ID_Usuario":1,//hardcoded, todo cambiar
      "P_Fecha":auxfecha,
      "P_Total":0,//todo cambiar
      "P_Obs":auxObs,//this.forma.controls['observaciones'].value,
      "P_Estado":0//hardcoded, los nuevos son siempre 0 (todo revisar)
    };

/*
     {
            "servicio": "InternoCabIns",
                {
                    "name": "P_Estado",
                    "required": "Y"
                }
        },
            "id": "03jmeYePLuMU8qfJqiOtwDFIgWRaYEW3EUp4",
            "name": "PUB 170",
            "description": "Factura B Número 170",
            "fecha": "2017-12-28",
            "tipooperacion": "225170a7-747b-679b-9550-5adfa5718844",
            "impmxdtotal": 8324.8,
            "account_id_c": "880",
            "nombre_fantasia_c": "TELEVISION FEDERAL S.A.TELEFE "
*/
    console.log('stringifeando');
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    //todo modificar servicio

    this._minContableService.postCabecera( jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp.returnset[0].RId);
        this.respCabecera = resp;
        if(this.respCabecera.returnset[0].RCode=="-6003"){
          //token invalido
          /*this.refContable = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._minContableService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.guardarCabecera();
            });*/
            console.log('token invalido');
        }
        else{
          if (this.respCabecera.returnset[0].RId != null){
            if (this.respCabecera.returnset[0].RId == "0"){
              this.openSnackBar(this.respCabecera.returnset[0].RTxt);
              //this.router.navigate(['/min-contables', 'nuevo']);
            }
            else{
              this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081
              this.openSnackBar('Minuta Contable creada. Redireccionando...');
              // this.forma.controls['numero'].setValue(this.cabeceraId);
              console.log('respuesta del post >>');
              console.log(this.respCabecera);
              console.log(this.cabeceraId);
              console.log('<< respuesta del post');
              this.forma.controls['fecha'].disable();
              this.forma.controls['tipo'].disable();
              this.forma.controls['numero'].disable();
              this.forma.controls['organizacion'].disable();
              this.forma.controls['moneda'].disable();
              this.forma.controls['caja'].disable();
              this.forma.controls['observaciones'].disable();
              setTimeout(() => {
                // this.router.navigate(['nextRoute']);
                this.editingCabecera = false;
                this.router.navigate(['/min-contables', this.cabeceraId]);
              }, 1000);  //2s

            }
          }
          else{
            this.openSnackBar('No se pudo crear la Minuta Contable');
          }

        }


      });


  }

  confirmar(  ){
    // console.clear();
    console.log('confirmando');
    console.log(this.totaldebe, this.totalhaber)
    if(Number(this.totaldebe) == Number(this.totalhaber)){
      let jsbody = {
        "ID_Comprobante":this.cabeceraId,
        "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080', //morecchia //todo cambiar por uno real,
        "P_Total": Number(this.totalhaber) - Number(this.totaldebe),
        "P_Obs": this.minutaContable.description, //todo revisar
        "Id_Cliente": this.parametrosSistema.account_id1_c,
        "P_Estado": 1,
        "P_UpdImp":"S"
      };
      console.log('stringifeando');
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);

      this._minContableService.putCabecera( jsonbody,this.token ).subscribe( resp => {
        //console.log(resp.returnset[0].RId);
        this.respCabecera = resp;
        if(this.respCabecera.returnset[0].RCode=="-6003"){
          //token invalido
          // this.refContable = null;
          /*let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._minContableService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.confirmar();
            });*/
            console.log('token invalido')
        }
        else{
          console.log(this.respCabecera);

          if (this.respCabecera.returnset[0].RCode === 0){
            this.openSnackBar('Se confirmó la Minuta Contable');
          }
          else{
            this.openSnackBar('No se pudo confirmar la Minuta Contable');
          }
        }

      })
    }
    else{
      this.openSnackBar('El Debe y el Haber deben tener el mismo importe');
    }
  }


  /*
  confirmar(){
    console.clear();
    console.log('confirmar clickeado');
    this.refContableItemData.forEach(refContableDet => {
      //obtener importe
      let importe: number;
      if ((refContableDet.debe != null)&&(refContableDet.debe != 0)){
        importe = 0- refContableDet.debe;
      }
      else{
        importe = 0+ refContableDet.haber;
      }

      let centro: string;
      if (refContableDet.centroDeCosto == null){
        centro = '0';
      }
      else{
        centro = refContableDet.centroDeCosto;
      }

      //determinar acción
        //insert
        let tipo: string;
        if (importe < 0){
          tipo = 'D';
        }
        else{
          tipo = 'H';
        }
        let jsbody = {
          "ID_ComprobanteCab": this.cabeceraId,
          "ID_Item": refContableDet.refContable,
          "ID_CentroCosto": centro, //refContableDet.centroDeCosto,
          "P_TipoImputacion": tipo,
          "P_Importe": importe,
          "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080' //morecchia //todo cambiar por uno real
        }
        console.log('stringifeando');
        let jsonbody= JSON.stringify(jsbody);
        console.log('json para post de detalle: ', jsonbody);
        this._minContableService.postMinContablesDet(jsonbody, this.token)
          .subscribe( resp => {
          //console.log(resp.returnset[0].RId);
          this.respRenglon = resp;
          if(this.respRenglon.returnset[0].RCode=="-6003"){
            //token invalido
            // this.refContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._minContableService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this._minContableService.postMinContablesDet(jsonbody, this.token);//todo comprobar
              });
          }
          else{
            console.log('respuesta del post detalle >>');
            console.log(this.respRenglon);
            console.log('<< respuesta del post detalle');
            if (this.respRenglon.returnset[0].RId != null){

              // this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081

              // this.forma.controls['numero'].setValue(this.cabeceraId);
            }
            else{
              this.openSnackBar('No se pudo crear el renglon de Minuta Contable');
            }

          }


        });
      }
    );
  }

        /*
        //update
        let jsbody = {
          // "ID_ComprobanteCab": this.cabeceraId,
          "ID_ComprobanteDet": refContableDet.refContable, //ID_Item
          // "ID_CentroCosto": refContableDet.centroDeCosto,
          // "P_TipoImputacion": tipo,
          "ID_Usuario": 'lsole', //todo cambiar por uno real
          "P_Importe": importe
        }
        console.log('stringifeando');
        let jsonbody= JSON.stringify(jsbody);
        console.log(jsonbody);
        this._minContableService.putMinContablesDet(jsonbody, this.token);

        //delete
        let jsbody = {
          "ID_ComprobanteCab": this.cabeceraId,
          "ID_ComprobanteDet": refContableDet.refContable, //ID_Item
          // "ID_CentroCosto": refContableDet.centroDeCosto,
          // "P_TipoImputacion": tipo,
          "ID_Usuario": 'lsole' //todo cambiar por uno real
          // "P_Importe": importe
        }
        console.log('stringifeando');
        let jsonbody= JSON.stringify(jsbody);
        console.log(jsonbody);
        this._minContableService.delMinContablesDet(jsonbody, this.token);
        */


  guardarArticulo(){
    /*
    this.compraArticulo.cantidad = this.formaReferencias.controls['cantidad'].value;
    this.compraArticulo.descuento = this.formaReferencias.controls['descuento'].value;

    if(this.editingAI){
      //editando
      let jsbody = {
        "idrenglon":this.referenciasData[this.auxEditingArt].renglonId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      //todo modificar servicio
      /*
      this._refContableService.editArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          //this.renglonId = this.respRenglon.returnset[0].RId;
        });
/
      this.referenciasData[this.auxEditingArt] = this.compraArticulo;
      this.table.renderRows();

      this.editingAI=false;
    }else{
      //agregando nuevo
      if(this.addingItem){
        this.compraArticulo.tipoRenglon="I";
        this.compraArticulo.precio_unitario=0;
        this.compraArticulo.alicuota=0;
      };
      if(this.addingReferencia){this.compraArticulo.tipoRenglon="A"};

      let jsbody = {
        "idCabecera":this.cabeceraId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      //todo modificar servicio
      /*
      this._refContableService.postArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          this.renglonId = this.respRenglon.returnset[0].RId;
          //console.log("dentro: "+this.renglonId);
          //console.log(this.referenciasData[(this.referenciasData.length-1)]);
          this.referenciasData[(this.referenciasData.length-1)].renglonId = this.renglonId;
          //console.log(this.referenciasData[(this.referenciasData.length-1)]);
        });
/
      this.compraArticulo.renglonId="temp";
      this.referenciasData.push(this.compraArticulo);
      this.table.renderRows();

      this.addingReferencia=false;
      this.addingItem=false;
    }

    let auxtotal=(this.compraArticulo.precio_unitario*this.compraArticulo.cantidad)*((100-this.compraArticulo.descuento)/100);
    //todo revisar
    / this.totalneto=this.totalneto+auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas+(auxtotal*(this.compraArticulo.alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas; /

    this.formaReferencias.controls['codigo'].setValue("");
    this.formaReferencias.controls['cantidad'].setValue(1);
    this.formaReferencias.controls['descuento'].setValue(0);
    this.compraArticulo = null;
    */
  }

  cancelarReferencia(){

    this.addingItem = false;
    this.addingReferencia = false;
    this.editingAI = false;
    //this.compraArticulo = null;

    this.formaReferencias.controls['refContable'].setValue("");
    this.formaReferencias.controls['nombreRefContable'].setValue("");
    this.formaReferencias.controls['centroDeCosto'].setValue("");
    this.formaReferencias.controls['debe'].setValue("");
    this.formaReferencias.controls['haber'].setValue("");
  }

  cancelarArtItem(){
    this.addingItem = false;
    this.addingReferencia = false;
    this.editingAI = false;
    //this.compraArticulo = null;
    this.formaReferencias.controls['codigo'].setValue("");
    this.formaReferencias.controls['cantidad'].setValue(1);
    this.formaReferencias.controls['descuento'].setValue(0);
  }

  eliminarArticulo(ind:number){
    let jsbody = {
      "idrenglon":this.referenciasData[ind].renglonId,
      "idusuario":"1",//hardcoded
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    //todo modificar servicio
    /*
    this._refContableService.deleteArticulo( jsonbody, this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respRenglon = resp;
        //this.renglonId = this.respRenglon.returnset[0].RId;
      });
*/
    let auxtotal=(this.referenciasData[ind].precio_unitario*this.referenciasData[ind].cantidad)*((100-this.referenciasData[ind].descuento)/100);
    //todo revisar
    /* this.totalneto=this.totalneto-auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas-(auxtotal*(this.referenciasData[ind].alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas; */

    // this.referenciasData.splice(ind, 1);todo revisar
    //this.referenciasData.data.push();//todo agregar nueva referencia
    this.table.renderRows();
  };

  editarArticulo(ind:number){
    this.editingAI = true;
    //this.compraArticulo = this.referenciasData[ind];
    this.formaReferencias.controls['codigo'].setValue(this.referenciasData[ind].codigo);
    this.formaReferencias.controls['cantidad'].setValue(this.referenciasData[ind].cantidad);
    this.formaReferencias.controls['descuento'].setValue(this.referenciasData[ind].descuento);
    //console.log(this.compraArticulo);
    this.auxEditingArt=ind;
  };

  cancelar(){
    
    setTimeout(() => {
      console.log('eliminando ref');
      let index = 0;
      this.refContableItemData.forEach( ref => {
        let jsbody = {
          "ID_ComprobanteCab": this.cabeceraId,
          "ID_ComprobanteDet": this.refContableItemData[index].idEnMinuta,
          "ID_Usuario": '72e55348-8e82-7c98-4227-4e1731c20080' //morecchia //todo cambiar por uno real
        }
        for (let i = 0; i < this.refContableItemData.length; i++) {
          this.refContableItemData.forEach(detalle => {
            let referencia: any;
            
            console.log(detalle[i])
        
           
                 //   this.dataSource = new MatTableDataSource(this.refContableItemData)
                  //  this.table.renderRows();
                    console.log(auxDetId)
                    console.log(i)
                    i = i + 1
            })
            
          }
        
    this.totaldebe = Number(this.totaldebe) - Number(this.refContableItemData[index].debe);
    this.totalhaber = Number(this.totalhaber) - Number(this.refContableItemData[index].haber);
    this.refContableItemData.splice(index,1);
    this.table.renderRows()
    index = index +1
    //eliminar del backend

    console.log('stringifeando');
    let jsonbody= JSON.stringify(jsbody);
    this._minContableService.delMinContablesDet(jsonbody, this.token)
    .subscribe( resp => {
      //console.log(resp.returnset[0].RId);
      this.respRenglon = resp;
      if(this.respRenglon.returnset[0].RCode=="-6003"){
        //token invalido
        // this.refContable = null;
        /*let jsbody = {"usuario":"usuario1","pass":"password1"}
        let jsonbody = JSON.stringify(jsbody);
        this._minContableService.login(jsonbody)
          .subscribe( dataL => {
            console.log(dataL);
            this.loginData = dataL;
            this.token = this.loginData.dataset[0].jwt;
            this._minContableService.postMinContablesDet(jsonbody, this.token);//todo comprobar
          });*/
          console.log('token invalido');
      }
      else{
        console.log('respuesta del delete detalle >>');
        console.log(this.respRenglon);
        console.log('<< respuesta del delete detalle');
        if (this.respRenglon.returnset[0].RCode === 1){

          this.openSnackBar('Renglon de Minuta Contable eliminado');
          // this.cabeceraId = this.respCabecera.returnset[0].RId; //dd6c40e7-127a-11e9-b2de-d050990fe081
         
          // this.forma.controls['numero'].setValue(this.cabeceraId);
        }
        else{
          this.openSnackBar('No se pudo eliminar renglon de Minuta Contable');
        }

      }
    //  this.table.renderRows();
    });
   
      })
   

      this.editingCabecera = true;
      this.router.navigate(['/min-contables', 'nuevo']);
    }, 1000);  //2s
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
    let atributoAUsar2: string;
    switch (consulta) {
      case 'tg01_referenciascontables':
        atributoAUsar = 'idreferenciacontable';
        atributoAUsar2 = 'name'
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
        this.formaReferencias.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
        this.formaReferencias.controls['nombreRefContable'].setValue(respuesta.selection[0][atributoAUsar2]);
        this.formaReferencias.controls['nombreRefContable'].disable()
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

}
