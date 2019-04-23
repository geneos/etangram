import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CompraService } from "../../../services/i2t/compra.service";
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';
import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { ConsultaOrdPagosService } from "../../../services/i2t/consulta-ord-pagos.service";
import { Router, ActivatedRoute } from "@angular/router";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

var auxProvData: any;

@Injectable()

@Component({
  selector: 'app-consulta-ord-pagos',
  templateUrl: './consulta-ord-pagos.component.html',
  styleUrls: ['./consulta-ord-pagos.component.css'],
  providers: [
    { provide: 'Window',  useValue: window },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ConsultaOrdPagosComponent implements OnInit {

  paginatorIntl = new MatPaginatorIntl();
  consultaOrdPago: consultaOrdPago[] = [];
  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
  logueado:boolean = true;
  token: string = "a";
  proveedorData: any;
  ProveedorData: any;
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];
  CompraProveedor: CompraProveedor;
  RazonSocial:string;
  cuitc:string;
  cuit:any;
  nroProveedor:number;
  respCabecera: any;
  cabeceraId: string;

  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();
  tabla: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tableCompr') table: MatTable<any>;

  displayedColumns: string[] = ['fecha', 'comprobante', 'expediente', 'observaciones', 'importe', 'accion'];
  dataSource = new MatTableDataSource<consultaOrdPago>(this.consultaOrdPago);
  selection = new SelectionModel(true, []);
  id: any;
  loading: boolean = true;
  filtrada:boolean = false;

  constructor( private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar,
              public dialogArt: MatDialog, private _compraService:CompraService,
              private _ConsultaOrdPagosService: ConsultaOrdPagosService,
              private _ImpresionCompService: ImpresionCompService,
              @Inject(SESSION_STORAGE) private storage: StorageService
          ) {

      console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    //  this.token = this.storage.get(TOKEN);
      this.token = localStorage.getItem('TOKEN')

    this.forma = new FormGroup({
      'proveedor': new FormControl(this.existeProveedor),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(),
      'expediente': new FormControl(''),
    })
    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      
      if (localStorage.length == 0){
        this.loading = true;
        setTimeout(() => {
          this.logueado = false;     
       //   this.openSnackBar('No ha iniciado sesión')
        }, 1000);  //2s
      } else {
        this.loading = false;
      };

      this.buscarProveedor();
    });
   }

  ngOnInit() {
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
            // //token invalido
            // this.compraProveedor = null;
            // let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsonbody = JSON.stringify(jsbody);
            // this._compraService.login(jsonbody)
            //   .subscribe( dataL => {
            //     console.log(dataL);
            //     this.loginData = dataL;
            //     this.token = this.loginData.dataset[0].jwt;
            //     this.buscarProveedor();
            //   });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.loading = false;
              this.compraProveedor = this.proveedorData.dataset[0]

              let icuit = this.compraProveedor.cuit.slice(0,2)
              let mcuit = this.compraProveedor.cuit.slice(2,10)
              let fcuit = this.compraProveedor.cuit.slice(10)

              this.cuit = icuit + '-' + mcuit + '-' + fcuit;

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
        "FechaDesde": auxfechadesde,
        "FechaHasta": auxfechahasta,
        "TipoReferente": "P",
        "TipoOperacion": "CAJ",
        "TipoComprobante": "OP",
        "Expendiente":this.forma.controls['expediente'].value,
        "ReservaPresup":" ",
        "Certificado":" ",
        "param_limite": 10,
        "param_offset": 0
    };

    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._ConsultaOrdPagosService.getComprobante( jsonbody,this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respCabecera = resp;
        this.cabeceraId = this.respCabecera.returnset[0].RId;
        console.log(this.respCabecera.dataset[0])
        if(this.respCabecera.dataset.length>0){
          this.filtrada = true;
          this.consultaOrdPago = this.respCabecera.dataset;
          this.dataSource = new MatTableDataSource(this.consultaOrdPago)
        } else {
          this.consultaOrdPago = null;
          this.dataSource = null
          this.openSnackBar('No hay datos para mostrar');
        }
      });
  }

  print = (nint: string) => {

    this._ImpresionCompService.getBaseDatos( this.token )
    .subscribe ( dataP => {
      console.log(dataP)
      this.ProveedorData = dataP;
      this.baseUrl = this.ProveedorData.dataset
      this.urlBaseDatos = this.baseUrl[0].jasperserver + this.baseUrl[0].app
      if(this.ProveedorData.dataset.length>0){
        this._ImpresionCompService.getInfromes('ETG_ordenpago', this.token)
        .subscribe ( dataP => {
          console.log(dataP)
          this.ProveedorData = dataP;
          this.informes = this.ProveedorData.dataset
          this.urlInforme = this.urlBaseDatos + this.informes[0].url
          console.log(this.urlInforme)
          if(this.ProveedorData.dataset.length>0){
            console.log(nint)
            window.open(this.urlInforme + nint)
          }
        })
      }
    })
    // let doc = new jsPDF();
    // doc.autoTable({
    //   head: [['Fecha', 'Comprobante', 'Expediente', 'Certificado', 'Importe Total', 'Saldo', 'Estado']]

    // })
    // for (let index = 0; index < this.dataSource.data.length; index++) {
    //   // itemActual[index] = dataSource.trim();
    //   // console.log(itemActual[index].toString);
    //   doc.autoTable({
    //     body: [[,this.dataSource.data[index].Fecha, this.dataSource.data[index].Numero_Comprobante,
    //     this.dataSource.data[index].Expediente, this.dataSource.data[index].Certificado, this.dataSource.data[index].Importe_Total,
    //     this.dataSource.data[index].Saldo, this.dataSource.data[index].Estado]]

    //   });
    //   console.log(this.dataSource.data[index])
    //   console.log(index);
    // }

    // doc.save('table.pdf')
  }
}
export interface consultaOrdPago {

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
  Saldo: number
}
