import { Component, OnInit, ViewChild, ElementRef, Inject  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable,MatTableDataSource, MatDialog, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { ConsultaComprobantesService } from 'src/app/services/i2t/consulta-comprobantes.service';
import { CdkTableModule } from '@angular/cdk/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as jsPDF from 'jspdf-autotable'

/*var jsPDF = require('jspdf');
require('jspdf-autotable');*/
declare var jsPDF: any;

var auxProvData: any;
let itemActual:any;


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
    { provide: 'Window',  useValue: window }
  ]
})


export class ConsultaComprobantesComponent implements OnInit {
  
  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
  token: string = "a";
  proveedorData: any;
  consultaComprobantes: consultaComprobantes[] = [];
  respCabecera: any;
  cabeceraId: string;
  loading:boolean; 
  public fechaActual: Date = new Date();
  public fechaDesde: Date = new Date();
  tabla: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('tablaDatos') tablaDatos: ElementRef;



print = () => {
  let doc = new jsPDF(); 
  

  var res = doc.autoTableHtmlToJson(document.getElementById("tablaDatos"));
  doc.autoTable({
    head: [['Fecha', 'Comprobante', 'Expediente', 'Certificado', 'Importe Total', 'Saldo', 'Estado']]
    
  })
  for (let index = 0; index < this.dataSource.data.length; index++) {
    // itemActual[index] = dataSource.trim();
    // console.log(itemActual[index].toString);
    doc.autoTable({
      body: [[this.dataSource.data[index].Fecha, this.dataSource.data[index].Numero_Comprobante,
      this.dataSource.data[index].Expediente, this.dataSource.data[index].Certificado, this.dataSource.data[index].Importe_Total,
      this.dataSource.data[index].Saldo, this.dataSource.data[index].Estado]] 
   
    });
    console.log(this.dataSource.data[index])
    console.log(index);
  }
  
  doc.save('table.pdf')
}
  columnsToDisplay  = ['Fecha', 'Tipo_Comprobante', 'Expediente', 'Certificado', 'Importe_Total', 'Saldo', 'Estado'];
  dataSource = new MatTableDataSource<consultaComprobantes>(this.consultaComprobantes);
  expandedElement: consultaComprobantes | null;
  
  selection = new SelectionModel(true, []);

  constructor( @Inject('Window') private window: Window,
  public snackBar: MatSnackBar, 
              public dialogArt: MatDialog, 
              private _compraService:CompraService, 
              private _consultaComprobantesServices:ConsultaComprobantesService) {
    this.loading = true;
    
  
    this.forma = new FormGroup({
      'proveedor': new FormControl('',Validators.required,this.existeProveedor),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'tipcomp': new FormControl(),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(new Date()),
      'expediente': new FormControl(),
      'certificado': new FormControl()
    })
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.fechaDesde.setDate(this.fechaActual.getDate() - 60).toString
    
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
    this._compraService.getProveedor( this.forma.controls['proveedor'].value, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            this.compraProveedor = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._compraService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProveedor();
              });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.compraProveedor = this.proveedorData.dataset[0];
            } else {
              this.compraProveedor = null; 
            }
          }
      });
  }

  getComprobantes(){

    let jsbody = {
      "IdCliente":this.forma.controls['proveedor'].value,
      "FechaDesde":"2018-06-01",//hardcoded
      "FechaHasta":"2018-07-03",//hardcoded
      "TipoReferente":"OP",//hardcoded
      "TipoOperacion": "INT",//hardcoded
      "TipoComprobante":"Contable",//hardcoded
      "Expendiente":"",//hardcoded
      "ReservaPresup":"",//hardcoded
      "Certificado":"",//hardcoded
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
        if(this.respCabecera.dataset.length>0){
          this.consultaComprobantes = this.respCabecera.dataset;
          this.dataSource = new MatTableDataSource(this.consultaComprobantes)
          
        } else {
          this.consultaComprobantes = null;
          this.dataSource = null
          this.openSnackBar('No hay datos para mostrar');
        }
      });
  }
  mostrar(){
    for (let index = 0; index < this.dataSource.data.length; index++) {
      // itemActual[index] = dataSource.trim();
      // console.log(itemActual[index].toString);
      console.log(this.dataSource.data[index])
      console.log(index);
    }
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
  Saldo: number
}