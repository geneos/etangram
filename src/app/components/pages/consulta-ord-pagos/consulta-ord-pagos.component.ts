import { Component, OnInit, ViewChild } from '@angular/core';
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CompraService } from "../../../services/i2t/compra.service";
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatIcon} from '@angular/material';
import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router";

var auxProvData: any;
@Component({
  selector: 'app-consulta-ord-pagos',
  templateUrl: './consulta-ord-pagos.component.html',
  styleUrls: ['./consulta-ord-pagos.component.css']
})
export class ConsultaOrdPagosComponent implements OnInit {
  consultaOrdPago: consultaOrdPago[] = [];
  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
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
  nroProveedor:number;

  public fechaActual: Date = new Date();
  public fechaDesde: Date = new Date();
  tabla: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['fecha', 'comprobante', 'expediente', 'observaciones', 'importe', 'accion'];
  dataSource = new MatTableDataSource<consultaOrdPago>(this.consultaOrdPago);
  selection = new SelectionModel(true, []);
  id: any;
  loading: boolean = true;

  constructor( private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar, 
              public dialogArt: MatDialog, private _compraService:CompraService,
              private _ImpresionCompService: ImpresionCompService) {
    
  
    this.forma = new FormGroup({
      'proveedor': new FormControl('',Validators.required,this.existeProveedor),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(new Date()),
      'expediente': new FormControl(),
    })
    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      //this.Controles['proveedor'].setValue(this.id);
      this.buscarProveedor();
    });
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  //  this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.fechaDesde.setDate(this.fechaActual.getDate() - 60).toString
    console.log(this.fechaDesde)
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
              this.loading = false;
              this.compraProveedor = this.proveedorData.dataset[0]
            } else {
              this.compraProveedor = null; 

            }
          }
      });
  }


  print = (nint: number) => {
    
    this._ImpresionCompService.getBaseDatos( this.token )
    .subscribe ( dataP => {
      console.log(dataP)
      this.ProveedorData = dataP;
      this.baseUrl = this.ProveedorData.dataset
      this.urlBaseDatos = this.baseUrl[0].jasperserver + this.baseUrl[0].app
      if(this.ProveedorData.dataset.length>0){
        this._ImpresionCompService.getInfromes('ETG_retencion_crd', this.token)
        .subscribe ( dataP => {
          console.log(dataP)
          this.ProveedorData = dataP;
          this.informes = this.ProveedorData.dataset
          this.urlInforme = this.urlBaseDatos + this.informes[0].url
          console.log(this.urlInforme)
          if(this.ProveedorData.dataset.length>0){
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
