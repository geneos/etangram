import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable,MatTableDataSource, MatDialog, MatPaginator, MatSort} from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { ConsultaComprobantesService } from 'src/app/services/i2t/consulta-comprobantes.service';
import { CdkTableModule } from '@angular/cdk/table';


var auxProvData: any;

@Component({
  selector: 'app-consulta-comprobantes',
  templateUrl: './consulta-comprobantes.component.html',
  styleUrls: ['./consulta-comprobantes.component.css']
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Fecha', 'Tipo_Comprobante', 'Expediente', 'Certificado', 'Importe_Total', 'Saldo', 'Estado', 'Observaciones_Comprobante'];
  dataSource = new MatTableDataSource<consultaComprobantes>(this.consultaComprobantes);

  selection = new SelectionModel(true, []);

  constructor(public dialogArt: MatDialog, private _compraService:CompraService, private _consultaComprobantesServices:ConsultaComprobantesService) {
    this.forma = new FormGroup({
      'proveedor': new FormControl('',Validators.required,this.existeProveedor),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'tipcomp': new FormControl(),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl()
    })
   }

  ngOnInit() {
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
              if(this.forma.controls['proveedor'].value == 0){
                 this.dataSource = null}
              else{
              this.getComprobantes();
            }
          }
      });
  }

  getComprobantes(){
    console.log('hola')

    let jsbody = {
      "IdCliente":this.forma.controls['proveedor'].value,
      "FechaDesde":"2018-06-01",//hardcoded
      "FechaHasta":"2018-07-03",
      "TipoReferente":"OP",
      "TipoOperacion": "INT",
      "TipoComprobante":"Contable",
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
  Saldo: number
}