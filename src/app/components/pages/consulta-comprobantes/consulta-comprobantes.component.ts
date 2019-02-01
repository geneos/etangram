import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Injectable  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable,MatTableDataSource, MatDialog, MatPaginator, MatSort, MatSnackBar, MatPaginatorIntl, } from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { ConsultaComprobantesService } from 'src/app/services/i2t/consulta-comprobantes.service';
//import { CdkTableModule } from '@angular/cdk/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
//import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";
import { Router, ActivatedRoute } from "@angular/router";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
//import { LoginComponent } from 'src/app/components/pages/login/login.component';
//import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

//import jsPDF from 'jspdf';
//import jspdf from 'jspdf-autotable';

// key that is used to access the data in local storage
const TOKEN = '';

declare var require: any
var jsPDF = require('jspdf');
require('jspdf-autotable');
//declare var jsPDF: any;

var auxProvData: any;

let itemActual:any;

@Injectable()

@Component({
  selector: 'app-consulta-comprobantes',
  templateUrl: './consulta-comprobantes.component.html',
  styleUrls: ['./consulta-comprobantes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],

})

export class ConsultaComprobantesComponent implements OnInit {

  paginatorIntl = new MatPaginatorIntl();
  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
  token: string;
  proveedorData: any;
  consultaComprobantes: consultaComprobantes[] = [];
  respCabecera: any;
  cabeceraId: string;
  loading: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();
  tabla: any = [];
  filtrada:boolean = false;

  ProveedorData: any;
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];
  cuit: any;
  razonSocial:string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tableCompr') table: MatTable<any>;
  @ViewChild('tablaDatos') tablaDatos: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay  = ['Fecha', 'Tipo_Comprobante', 'Expediente', 'Certificado', 'Importe_Total', 'Saldo', 'Estados', 'Estado', 'accion'];
  dataSource = new MatTableDataSource<consultaComprobantes>(this.consultaComprobantes);
  expandedElement: consultaComprobantes | null;

  selection = new SelectionModel(true, []);
  id: any;

  constructor( private route:ActivatedRoute,private router: Router,
              @Inject('Window') private window: Window,
              public snackBar: MatSnackBar,
              public dialogArt: MatDialog,
              private _compraService:CompraService,
              private _consultaComprobantesServices:ConsultaComprobantesService,
              private adapter: DateAdapter<any>,
              @Inject(SESSION_STORAGE) private storage: StorageService
              ) {

    console.log(this.storage.get(TOKEN) || 'Local storage is empty');
    this.token = this.storage.get(TOKEN);

    this.loading = true;

    this.forma = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'tipocomprobante': new FormControl(''),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(),
      'expediente': new FormControl(''),
      'certificado': new FormControl('')
    })

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      //this.token = parametros['token'];
      //this.Controles['proveedor'].setValue(this.id);
      this.buscarProveedor();

    });

    /*this.fechaActual.setDate(this.fechaActual.getDate());
    this.fechaDesde.setDate(this.fechaActual.getDate() - 60);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);*/

   }

  ngOnInit() {
    /*this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
  //  this.adapter.setLocale('fr');
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    console.log(this.paginator._intl.getRangeLabel);

    this.fechaActual.setDate(this.fechaActual.getDate());
    this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    this.fechaDesde.setDate(this.fechaActual.getDate() - 60);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);

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


  buscarProveedor(){
    this._compraService.getProveedor( this.id, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            console.log('Token invalido');
          //   this.compraProveedor = null;
          //  let jsbody = {"usuario":"usuario1","pass":"password1"}
          //  let jsonbody = JSON.stringify(jsbody);
          //  this._compraService.login(jsonbody)
          //    .subscribe( dataL => {
          //      console.log(dataL);
          //      this.loginData = dataL;
          //      this.token = this.loginData.dataset[0].jwt;
          //      this.buscarProveedor();
           //  });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.compraProveedor = this.proveedorData.dataset[0];
              this.loading = false;
              let icuit,mcuit,fcuit;
              if(this.compraProveedor.cuit!=null){
                icuit = this.compraProveedor.cuit.slice(0,2);
                mcuit = this.compraProveedor.cuit.slice(2,10);
                fcuit = this.compraProveedor.cuit.slice(10);
                this.cuit = icuit + '-' + mcuit + '-' + fcuit;
              } else {
                this.cuit = ' ';
              }

              this.razonSocial = this.compraProveedor.name
            } else {
              this.compraProveedor = null;
            }
          }
      });
  }

  getComprobantes(){

    let ano = this.forma.controls['fecdesde'].value.getFullYear().toString();
    let mes = (this.forma.controls['fecdesde'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    let dia = this.forma.controls['fecdesde'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfechadesde = ano+"-"+mes+"-"+dia;

    ano = this.forma.controls['fechasta'].value.getFullYear().toString();
    mes = (this.forma.controls['fechasta'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    dia = this.forma.controls['fechasta'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfechahasta = ano+"-"+mes+"-"+dia;

    let jsbody = {
      "IdCliente": this.id,
      "FechaDesde":auxfechadesde,//this.forma.controls['fecdesde'].value,//"2015-01-01",
      "FechaHasta":auxfechahasta,//this.forma.controls['fechasta'].value,//"2019-12-3",
      "TipoReferente": "P",
      "TipoOperacion": "CPA",
      "TipoComprobante": this.forma.controls['tipocomprobante'].value,
      "Expendiente":this.forma.controls['expediente'].value,
      "ReservaPresup":"",
      "Certificado":this.forma.controls['certificado'].value,

      "param_limite": 10,
      "param_offset": 0

    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._consultaComprobantesServices.getComprobante( jsonbody,this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respCabecera = resp;
        this.cabeceraId = this.respCabecera.returnset[0].RId;
        console.log(this.respCabecera.dataset[0])
        console.log(this.forma.controls['fecdesde'].value);
        if(this.respCabecera.dataset.length>0){
          this.consultaComprobantes = this.respCabecera.dataset;
          this.filtrada = true;
          this.dataSource = new MatTableDataSource(this.consultaComprobantes);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          //this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
        } else {
          this.consultaComprobantes = null;
          this.dataSource = null
          this.openSnackBar('No hay datos para mostrar');
        }
      });
  }


}
export interface consultaComprobantes {

  Numero_Referente: string,
  Numero_Comprobante: string,
  Referente: string,
  Fecha: string,
  Importe_Neto: number,
  Importe_Total: number,
  Tipo_Referente: string,
  Tipo_Operacion: string,
  Tipo_Comprobante: string,
  Id_Comprobante: string,
  Nombre_Comprobante: string,
  Letra: string,
  Observaciones_Comprobante: string,
  Impuesto: string,
  Modelo_Impuesto: string,
  Expediente: string,
  Reserva_Presupuestaria: string,
  Certificado: string,
  Estado: string,
  Saldo: number,
  estadocontable: number,
  estadoimpositivo: number,
  estadopresupuestario: number
}
