import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { TiposComprobanteService } from "../../../services/i2t/tipos-comprobante.service";
import { CompraArticulo,CompraProveedor } from "../../../interfaces/compra.interface";
import { TipoComprobante } from "../../../interfaces/tipo-comprobante.interface";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription, from } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

var auxProvData,auxArtiData:any;

@Injectable()

@Component({
  selector: 'app-abm-compras',
  templateUrl: './abm-compras.component.html',
  styleUrls: ['./abm-compras.component.css']
})

export class AbmComprasComponent implements OnInit {

  editingRenglones:boolean = false;
  agregarReng:boolean = true;

  editingCabecera:boolean = true;
  addingArticulo:boolean = false;
  addingItem:boolean = false;
  editingAI:boolean = false;
  auxEditingArt:number = null;

  articulosData: any[] = [];
  //articulosDataSource = new MatTableDataSource(this.articulosData);

  loginData: any;
  token: string;
  cabeceraId: string;
  renglonId: string;
  articuloData: any;
  proveedorData: any;
  respCabecera: any;
  respRenglon: any;
  compraArticulo: CompraArticulo;
  compraProveedor: CompraProveedor;

  forma:FormGroup;
  formaArticulos:FormGroup;

  totalneto:number = 0;
  impuestosalicuotas:number = 0;
  totaltotal:number = 0;

  idParam:string = null;

  tcData: any;
  tipoComprobante: TipoComprobante[] = [];
  tipoComp: string[] = [];

  posicionesFiscales: string[] = ["N/D","IVA Responsable Inscripto","IVA Responsable no Inscripto",
"IVA no Responsable","IVA Sujeto Exento","Consumidor Final","Responsable Monotributo",
"Sujeto no Categorizado","Proveedor del Exterior","Cliente del Exterior","IVA Liberado - Ley N° 19.640",
"IVA Responsable Inscripto - Agente de Percepción","Pequeño Contribuyente Eventual",
"Monotributista Social","Pequeño Contribuyente Eventual Social"];

  suscripcionConsDin: Subscription;

  @ViewChild('tableArticulos') table: MatTable<any>;
  user: string;
  pass: string;

  constructor(public dialogArt: MatDialog,
              private _compraService:CompraService,
              private _tiposComprobante:TiposComprobanteService,
              private route:ActivatedRoute,
              public ngxSmartModalService: NgxSmartModalService,
              public snackBar: MatSnackBar,
              @Inject(SESSION_STORAGE) private storage: StorageService
            )
  {

    console.log(this.storage.get(TOKEN) || 'Local storage is empty');
    this.token = this.storage.get(TOKEN);

    this.forma = new FormGroup({
      'proveedor': new FormControl('',Validators.required,this.existeProveedor),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'posicionFiscal': new FormControl(),
      'tipoComprobante': new FormControl('',Validators.required),
      'nroComprobante': new FormControl('',[Validators.required,Validators.pattern("^([a-z]|[A-Z]{1})([0-9]{4,5})-([0-9]{8})$")]),
      'fecha': new FormControl('',Validators.required),
      'caicae': new FormControl('',[Validators.required,Validators.pattern("^([0-9]{14})$")]),
      'fechaVto': new FormControl('',Validators.required),
      'totalCabecera': new FormControl('',[Validators.required]),
      'observaciones': new FormControl(),
    })

    this.forma.controls['razonSocial'].disable();
    this.forma.controls['cuit'].disable();
    this.forma.controls['posicionFiscal'].disable();

    this.formaArticulos = new FormGroup({
      'codigo': new FormControl('',Validators.required,this.existeArticulo),
      'articulo': new FormControl(),
      'cantidad': new FormControl(1,Validators.required),
      'unidadMedida': new FormControl(),
      'precioUnitario': new FormControl(0),
      'descuento': new FormControl(0,Validators.required),
      'total': new FormControl(0)
    })

    this.formaArticulos.controls['total'].disable();
    this.formaArticulos.controls['articulo'].disable();
    this.formaArticulos.controls['unidadMedida'].disable();
    this.formaArticulos.controls['precioUnitario'].disable();

    // si edito un id existente
    this.route.params.subscribe( parametros=>{
      this.idParam = parametros['id'];
    });

    //if id existe
  }

  ngOnInit() { 
    this.buscarTiposComprobante();
  }

  test(){
    //console.log(this.forma.controls['caicae'].errors)
  }

  buscarTiposComprobante(){
    this._tiposComprobante.getTipoOperacion( "225170a7-747b-679b-9550-5adfa5718844", this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.tcData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tipoComprobante = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposComprobante.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTiposComprobante();
              });
            } else {
              if(this.tcData.dataset.length>0){
                this.tipoComprobante = this.tcData.dataset;
                console.log(this.tipoComprobante);
                //this.loading = false;
              } else {
                this.tipoComprobante = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  abrirConsulta(consulta: string){
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
        this.openSnackBar('Se canceló la selección de Proveedor');
      }
      else{
        this.forma.controls['proveedor'].setValue(respuesta.selection[0].codigo);
        this.buscarProveedor();
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionConsDin.unsubscribe();
      console.log('se desuscribió al modal de consulta dinamica');
    });
    this.ngxSmartModalService.open(datosModal.modal);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

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

  abrirConsulta2(consulta: string, control: string){
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

  buscarProveedor(){
    this._compraService.getProveedor( this.forma.controls['proveedor'].value, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            console.log('token invalido')
            // this.compraProveedor = null;
            // //let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsbody = {"usuario":this.user,"pass":this.pass}
            // let jsonbody = JSON.stringify(jsbody);
            // this._compraService.login(jsonbody)
            //   .subscribe( dataL => {
            //     console.log(dataL);
            //     this.loginData = dataL;
            //     this.token = this.loginData.dataset[0].jwt;
              //   this.buscarProveedor();
              // });
            } else {
              if(this.proveedorData.dataset.length>0){
                this.compraProveedor = this.proveedorData.dataset[0];
              } else {
                this.compraProveedor = null;
              }
            }
      });
  }

  buscarArticulo(){
    if(this.addingArticulo){
      this._compraService.getArticulo( this.formaArticulos.controls['codigo'].value, this.token )
        .subscribe( dataA => {
          this.articuloData = dataA;
          auxArtiData = this.articuloData.dataset.length;
          if(this.articuloData.dataset.length>0){
            this.compraArticulo = this.articuloData.dataset[0];
          } else {
            this.compraArticulo = null;
          }
        });
    }
    if(this.addingItem){
      this._compraService.getItem( this.formaArticulos.controls['codigo'].value, this.token )
        .subscribe( dataA => {
          this.articuloData = dataA;
          auxArtiData = this.articuloData.dataset.length;
          if(this.articuloData.dataset.length>0){
            this.compraArticulo = this.articuloData.dataset[0];
          } else {
            this.compraArticulo = null;
          }
        });
    }
  }

  addArticulo(){
    this.addingArticulo = true;
  }
  addItem(){
    this.addingItem = true;
  }

  guardarCabecera(){
    this.editingCabecera = false;

    let ano = this.forma.controls['fecha'].value.getFullYear().toString();
    let mes = (this.forma.controls['fecha'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    let dia = this.forma.controls['fecha'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfecha = ano+"-"+mes+"-"+dia;

    let jsbody = {
      "Tipocbte":this.forma.controls['tipoComprobante'].value,
      "Modelocbte":"cpa",//hardcoded
      "NroCbte":this.forma.controls['nroComprobante'].value,
      "ImporteTotalcbte":this.forma.controls['totalCabecera'].value,
      "Fechacbte":auxfecha,
      "codigoReferente":this.forma.controls['proveedor'].value,
      "CAE":this.forma.controls['caicae'].value,
      "FormaPago":"F",//hardcoded
      "idcondComercializacion":"1",//hardcoded
      "IdSucursal":"1",//hardcoded
      "IdDeposito":"1",//hardcoded
      "IdLista":"1",//hardcoded
      "IdMoneda":"1",//hardcoded
      "Cotizacion":"1",//hardcoded
      "FechaBase":auxfecha,
      "FechaContable":auxfecha,
      "idcaja":"1",//hardcoded
      "idUsuario":"99",//hardcoded
      "Observaciones":this.forma.controls['observaciones'].value
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._compraService.postCabecera( jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp.returnset[0].RId);
        this.respCabecera = resp;
        this.cabeceraId = this.respCabecera.returnset[0].RId;
      });

    this.forma.controls['proveedor'].disable();
    this.forma.controls['tipoComprobante'].disable();
    this.forma.controls['nroComprobante'].disable();
    this.forma.controls['fecha'].disable();
    this.forma.controls['caicae'].disable();
    this.forma.controls['fechaVto'].disable();
    this.forma.controls['totalCabecera'].disable();
  }

  guardarArticulo(){
    this.compraArticulo.cantidad = this.formaArticulos.controls['cantidad'].value;
    this.compraArticulo.descuento = this.formaArticulos.controls['descuento'].value;

    if(this.editingAI){
      //editando
      let jsbody = {
        "idrenglon":this.articulosData[this.auxEditingArt].renglonId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota*/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._compraService.editArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          //this.renglonId = this.respRenglon.returnset[0].RId;
        });

      this.articulosData[this.auxEditingArt] = this.compraArticulo;
      this.table.renderRows();

      this.editingAI=false;
    }else{
      //agregando nuevo
      if(this.addingItem){
        this.compraArticulo.tipoRenglon="I";
        this.compraArticulo.precio_unitario=0;
        this.compraArticulo.alicuota=0;
      };
      if(this.addingArticulo){this.compraArticulo.tipoRenglon="A"};

      let jsbody = {
        "idCabecera":this.cabeceraId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota*/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._compraService.postArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          this.renglonId = this.respRenglon.returnset[0].RId;
          //console.log("dentro: "+this.renglonId);
          //console.log(this.articulosData[(this.articulosData.length-1)]);
          this.articulosData[(this.articulosData.length-1)].renglonId = this.renglonId;
          //console.log(this.articulosData[(this.articulosData.length-1)]);
        });

      this.compraArticulo.renglonId="temp";
      this.articulosData.push(this.compraArticulo);
      this.table.renderRows();

      this.addingArticulo=false;
      this.addingItem=false;
    }

    let auxtotal=(this.compraArticulo.precio_unitario*this.compraArticulo.cantidad)*((100-this.compraArticulo.descuento)/100);
    this.totalneto=this.totalneto+auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas+(auxtotal*(this.compraArticulo.alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas;

    this.formaArticulos.controls['codigo'].setValue("");
    this.formaArticulos.controls['cantidad'].setValue(1);
    this.formaArticulos.controls['descuento'].setValue(0);
    this.compraArticulo = null;
  }

  cancelarArtItem(){
    this.addingItem = false;
    this.addingArticulo = false;
    this.editingAI = false;
    this.compraArticulo = null;
    this.formaArticulos.controls['codigo'].setValue("");
    this.formaArticulos.controls['cantidad'].setValue(1);
    this.formaArticulos.controls['descuento'].setValue(0);
  }

  eliminarArticulo(ind:number){
    let jsbody = {
      "idrenglon":this.articulosData[ind].renglonId,
      "idusuario":"1",//hardcoded
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._compraService.deleteArticulo( jsonbody, this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respRenglon = resp;
        //this.renglonId = this.respRenglon.returnset[0].RId;
      });

    let auxtotal=(this.articulosData[ind].precio_unitario*this.articulosData[ind].cantidad)*((100-this.articulosData[ind].descuento)/100);
    this.totalneto=this.totalneto-auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas-(auxtotal*(this.articulosData[ind].alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas;

    this.articulosData.splice(ind, 1);
    this.table.renderRows();
  };

  editarArticulo(ind:number){
    this.editingAI = true;
    this.compraArticulo = this.articulosData[ind];
    this.formaArticulos.controls['codigo'].setValue(this.articulosData[ind].codigo);
    this.formaArticulos.controls['cantidad'].setValue(this.articulosData[ind].cantidad);
    this.formaArticulos.controls['descuento'].setValue(this.articulosData[ind].descuento);
    //console.log(this.compraArticulo);
    this.auxEditingArt=ind;
  };

  

}
