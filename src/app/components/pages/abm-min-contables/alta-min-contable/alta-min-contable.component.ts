import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MonedasService } from 'src/app/services/i2t/monedas.service';
import { TiposComprobanteService } from 'src/app/services/i2t/tipos-comprobante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametrosService } from 'src/app/services/i2t/parametros.service';
import { Parametros } from 'src/app/interfaces/parametros.interface';
import { TipoComprobante } from 'src/app/interfaces/tipo-comprobante.interface';
import { Moneda } from 'src/app/interfaces/moneda.interface';
import { OrganizacionesService } from 'src/app/services/i2t/organizaciones.service';
import { Organizacion } from 'src/app/interfaces/organizacion.interfac';
import { MinContable } from 'src/app/interfaces/min-contable.interface';
import { CajasService } from 'src/app/services/i2t/cajas.service';
import { RefContablesService } from 'src/app/services/i2t/ref-contables.service';
import { RefContable } from 'src/app/interfaces/ref-contable.interface';
import { CentroCosto } from 'src/app/interfaces/cen-costo.interface';
import { CentrosCostosService } from 'src/app/services/i2t/cen-costos.service';
import { MinContablesService } from 'src/app/services/i2t/min-contables.service';


var auxRefConData,auxCCostoData:any;

@Component({
  selector: 'app-alta-min-contable',
  templateUrl: './alta-min-contable.component.html',
  styleUrls: ['./alta-min-contable.component.css']
})

export class AltaMinContableComponent implements OnInit {
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
  editingRenglones:boolean = false;
  agregarReng:boolean = true;

  editingCabecera:boolean = true;
  addingReferencia:boolean = false;
  addingItem:boolean = false;
  editingAI:boolean = false;
  auxEditingArt:number = null;

  referenciasData: any[] = [];
  //referenciasDataSource = new MatTableDataSource(this.referenciasData);

  loginData: any;
  token: string = "a";
  existe:boolean;
  loading:boolean;

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

  minutaContable: MinContable;
  mcData: any;
  //todo revisar
  cabeceraId: string;
  renglonId: string;
  refContableData: any;
  centroCostoData: any;
  respCabecera: any;
  respRenglon: any;
  
  centroCosto: CentroCosto;
  refContable: RefContable;

  forma:FormGroup;
  formaReferencias:FormGroup;
/* 
  totalneto:number = 0;
  impuestosalicuotas:number = 0;
  totaltotal:number = 0;

  posicionesFiscales: string[] = ["N/D","IVA Responsable Inscripto","IVA Responsable no Inscripto",
"IVA no Responsable","IVA Sujeto Exento","Consumidor Final","Responsable Monotributo",
"Sujeto no Categorizado","Proveedor del Exterior","Cliente del Exterior","IVA Liberado - Ley N° 19.640",
"IVA Responsable Inscripto - Agente de Percepción","Pequeño Contribuyente Eventual",
"Monotributista Social","Pequeño Contribuyente Eventual Social"]; */

  @ViewChild('tableArticulos') table: MatTable<any>;//

  //todo cambiar
  constructor(public dialogArt: MatDialog, 
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
              public snackBar: MatSnackBar) {
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

    this.formaReferencias = new FormGroup({
      'refContable': new FormControl('',Validators.required,this.existeRefContable),
      'centroDeCosto': new FormControl('',Validators.required,this.existeCentroCosto),
      'debe': new FormControl(this.esDebeHaberValido),
      'haber': new FormControl(this.esDebeHaberValido)
    })

    this.formaReferencias.controls['refContable'].disable();
    this.formaReferencias.controls['centroDeCosto'].disable();
    this.formaReferencias.controls['debe'].disable();
    this.formaReferencias.controls['haber'].disable();

    //cargar listas para combobox
    this.buscarCajas();

    this.route.params.subscribe( parametros=>{
      this.cabeceraId = parametros['id'];
      this.existe = false;

      if( this.cabeceraId !== "nuevo" ){
        this.buscarMinutasContables(this.cabeceraId);
        //habilitar campos de detalles/renglones
        this.formaReferencias.controls['refContable'].enable();
        this.formaReferencias.controls['centroDeCosto'].enable();
        this.formaReferencias.controls['debe'].enable();
        this.formaReferencias.controls['haber'].enable();
      } else {
        this.loading = false;
        //todo borrar console
        console.log('Obtener parametros');

        //obtener valores parametrizados
        this.buscarParametros();

        //establecer valores de salida
        //this.buscarTipoComprobante(this.parametrosSistema.tg01_tipocomprobante_id_c);
        //this.forma.controls['tipo'].setValue(this.tipoComprobante.name);
        //this.buscarOrganizacion(this.parametrosSistema.account_id1_c);
        //this.forma.controls['organizacion'].setValue(this.organizacion.NAME);
        //this.buscarMoneda(this.parametrosSistema.tg01_monedas_id2_c);
        //this.forma.controls['moneda'].setValue(this.moneda.name);
        this.forma.controls['fecha'].setValue(new Date());
      }

      //this.forma.controls['nomenclador'].disable();

    });
  }

  ngOnInit() {}

  test(){
    //console.log(this.forma.controls['caicae'].errors)
  }

  buscarParametros(){
    this._parametrosService.getParametros( this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
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
                this.buscarParametros();
              });
            } else {
              if(this.pData.dataset.length>0){
                this.parametrosSistema = this.pData.dataset[0];
                this.buscarTipoComprobante(this.parametrosSistema.tg01_tipocomprobante_id_c);
                this.buscarOrganizacion(this.parametrosSistema.account_id1_c);
                this.buscarMoneda(this.parametrosSistema.tg01_monedas_id2_c);
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
            this.tipoComprobante = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._parametrosService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarParametros();
              });
            } else {
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset[0];
                this.forma.controls['tipo'].setValue(this.tipoComprobante.name);
              }
              
              console.log('buscando tipo de comprobante con ' + auxid);
              console.log(this.tipoComprobante);
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
                this.buscarParametros();
              });
            } else {
              if(this.mData.dataset.length>0){
                this.moneda = this.mData.dataset[0];
                this.forma.controls['moneda'].setValue(this.moneda.name);
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
                this.buscarParametros();
              });
            } else {
              if(this.oData.dataset.length>0){
                console.log('organizacion con '+auxid+': ');
                console.log(this.organizacion);
                this.organizacion = this.oData.dataset[0];
                this.forma.controls['organizacion'].setValue(this.organizacion.NAME);
              }
              console.log('organizacion con '+auxid+': ');
              console.log(this.organizacion);
            }

      });
  }

  buscarCajas(){
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
console.log('json armado: ');
    console.log(jsonbody);
    
    this._minContableService.getMinContables( jsonbody, this.token )
    //this._refContableService.getProveedores()
      .subscribe( dataMC => {
        console.log(dataMC);
          this.mcData = dataMC;
          //auxRefConData = this.mcData.dataset.length;
          if(this.mcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.minutaContable = null;
            let jsbodyl = {"usuario":"usuario1","pass":"password1"}
            let jsonbodyl = JSON.stringify(jsbodyl);
            this._minContableService.login(  jsonbodyl )
              .subscribe( dataL => {
                console.log('resultado login');
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMinutasContables(auxid);
              });
            } else {
              if(this.mcData.dataset.length>0){
                this.minutaContable = this.mcData.dataset[0];
                this.existe = true;
                if (this.existe == true){
                  //console.log(this.planDeCuentas);
                  this.loading = false;
                  
                  this.forma.controls['fecha'].setValue(this.minutaContable.fecha);
                  this.forma.controls['observaciones'].setValue(this.minutaContable.description);
                  
                  console.log('pidiendo tipo op con: ');
                  console.log(this.minutaContable);
                  //todo cambiar por lo del objeto cargado cuando se pueda traer solo minutas
                  this.forma.controls['organizacion'].setValue(this.minutaContable.nombre_fantasia_c);
                  this.buscarTipoComprobante(this.minutaContable.tipooperacion);
                  // this.buscarTipoComprobante('43966f4a-4fc8-11e8-b1a0-d050990fe081');
                  console.log('buscando organizacion con '+this.minutaContable.account_id_c);
                  this.buscarOrganizacion(this.minutaContable.account_id_c);
                  

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
    let debe = this.formaReferencias.controls['debe'].value;
    let haber = this.formaReferencias.controls['haber'].value;
    
    if ((debe === null || debe === 0) && (haber === null || haber === 0)){
      //Debe ingresar un Debe o un Haber
      return false;
    }

    if ((debe > 0) && (haber > 0)){
      //No puede ingresar un Debe y un Haber al mismo tiempo
      return false;
    }

    if (!(debe === null)&&(debe < 0)){
      //Debe ingresar un Debe positivo
      return false;
    }

    if (!(haber === null)&&(haber < 0)){
      //Debe ingresar un Haber positivo
      return false;
    }

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
                this.buscarRefContable();
              });
            } else {
              if(this.refContableData.dataset.length>0){
                this.refContable = this.refContableData.dataset[0];
                console.log('auto referencia: ');
                console.log(this.refContable);


                //centro de costo
                /*
                La referencia contable determina el uso de este atributo
                  - si no tiene centro de costo, se omite
                  - si ya tiene uno definido, se impone ese centro de costo y no se permite modificar
                  - si es variable, puede ingresar el valor y validar con el metodo tg01_centrocosto o bien seleccionarlo con el componente “consulta dinamica” “c_tg01_centrocosto”
                */
                if (this.refContable.tg01_centrocosto_id_c === null){
                  this.formaReferencias.controls['centroDeCosto'].disable();
                  this.formaReferencias.controls['centroDeCosto'].setValue('');
                }
                else{
                  if (this.refContable.tg01_centrocosto_id_c.indexOf(',') != 0){
                    this.formaReferencias.controls['centroDeCosto'].setValue(this.refContable.tg01_centrocosto_id_c);
                    this.formaReferencias.controls['centroDeCosto'].disable();
                  }
                  else{
                    this.formaReferencias.controls['centroDeCosto'].setValue('');
                    this.formaReferencias.controls['centroDeCosto'].enable();
                  }
                }
              } else {
                this.refContable = null;
                this.formaReferencias.controls['centroDeCosto'].disable();
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
    this.formaReferencias.controls['haber'].setValue('');
    this.formaReferencias.controls['debe'].setValue('');
    this.addingReferencia = true;
  }

  guardarCabecera(){
    this.editingCabecera = false;
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

    let jsbody = {
      // "ID_TipoComp":this.forma.controls['tipo'].value,
      "ID_TipoComp":this.tipoComprobante.id,
      "ID_Cliente":1,//hardcoded, todo cambiar
      "ID_Caja":this.forma.controls['caja'].value,
      "ID_Moneda":this.forma.controls['moneda'].value,
      "ID_Usuario":1,//hardcoded, todo cambiar
      "P_Fecha":auxfecha,
      "P_Total":0,//todo cambiar
      "P_Obs":this.forma.controls['observaciones'].value,
      "P_Estado":1//hardcoded, todo cambiar
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
        this.cabeceraId = this.respCabecera.returnset[0].RId;
        console.log('respuesta del post >>');
        console.log(resp);
        console.log(resp[0].returnset[0].RTxt);
        console.log('<< respuesta del post');
      });

    this.forma.controls['fecha'].disable();
    this.forma.controls['tipo'].disable();
    this.forma.controls['numero'].disable();
    this.forma.controls['organizacion'].disable();
    this.forma.controls['moneda'].disable();
    this.forma.controls['caja'].disable();
  }

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

    this.referenciasData.splice(ind, 1);
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

}
