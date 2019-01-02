import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint} from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { ConsultaCrdService } from "../../../services/i2t/consulta-crd.service";
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";


var auxArtiData:any;
var auxProvData:any;


@Component({
  selector: 'app-consulta-crd',
  templateUrl: './consulta-crd.component.html',
  styleUrls: ['./consulta-crd.component.css']
})
export class ConsultaCrdComponent implements OnInit {
  ProveedorData: any;
  CompraProveedor: CompraProveedor;
  ELEMENT_DATA: ConsultaCrd[] = [];
  RazonSocial:string;
  nroProveedor:number;
  displayedColumns: string[] = ['ncrd', 'fech', 'pexp', 'opub', 'ncomr', 'total'];
  dataSource = new MatTableDataSource<ConsultaCrd>(this.ELEMENT_DATA);
// ['ncrd', 'fech', 'npro', 'name', 'cuit_c', 'pexp', 'nexp', 'opub', 'tcom', 'ncomr', 'total']
  Controles: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  
  selection = new SelectionModel(true, []);

  constructor(private _ConsultaCrdService:ConsultaCrdService) {
    this.Controles = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
   })
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
  }
  loginData: any;
  token: string = "a";

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
  
  print() {
   const content = document.getElementById('tableCrd').innerHTML;
   const content2 = 'Proovedor: ' + this.nroProveedor + ' - ' + this.RazonSocial;
   const printWindow = window.open('', 'Print', 'height=745,width=1024');

   //printWindow.document.write('<html><head><title>Print</title>');
   //   printWindow.document.write('</head><body>');
   //   printWindow.document.write('<h1>QuotesWorld</h1>');
      printWindow.document.write(content2);
      printWindow.document.write(content);
     // printWindow.document.write('</body></html>');

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

  consultar(){
 //   console.log(this.Controles.controls['proveedor'].value)
    this._ConsultaCrdService.getProveedorCrd( this.Controles.controls['proveedor'].value, this.token )
      .subscribe( dataP => {
  //      console.log(dataP);
          this.ProveedorData = dataP;
          auxProvData = this.ProveedorData.dataset.length;
          if(this.ProveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            this.dataSource = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._ConsultaCrdService.login(jsonbody)
              .subscribe( dataL => {
 //               console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.consultar();
              });
            } else {
              if(this.ProveedorData.dataset.length>0){
                this.ELEMENT_DATA = this.ProveedorData.dataset;
 //               console.log(this.ELEMENT_DATA[1].name);
                this.RazonSocial = this.ELEMENT_DATA[0].name;
                this.nroProveedor = this.ELEMENT_DATA[0].npro;
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

              } else {
                this.ELEMENT_DATA = null;
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                this.RazonSocial = null;
                this.nroProveedor = null;
              }
            }
      });
  }

  
}
export interface ConsultaCrd {
    ncrd: number;
    fech: string;
    npro: number;
    name: string;
    cuit_c: string;
    pexp: number;
    nexp: number;
    opub: number;
    tcom: string;
    ncomr: number;
    total: number;
}


