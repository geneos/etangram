import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraArticulo,CompraProveedor } from "../../../interfaces/compra.interface";

export interface Certificados {
  certificado: number;
  fecha: string ;
  expediente: string;
  opublicidad: string;
  comprobante: string;
  importe: number;
}
var auxArtiData:any;
var auxProvData:any;

const constCertificados: Certificados[] = [
  {certificado: 123456789, fecha: '01/01/2018', expediente: '200-4567895-456', opublicidad: 'aaaaa', comprobante: 'FC12-446548977', importe: 1000}
];

@Component({
  selector: 'app-consulta-crd',
  templateUrl: './consulta-crd.component.html',
  styleUrls: ['./consulta-crd.component.css']
})
export class ConsultaCrdComponent implements OnInit {
  constCertificados = new MatTableDataSource(constCertificados);

  
  proveedorData:any
  loginData: any;
  token: string = "a";
  compraArticulo: CompraArticulo;
  compraProveedor: CompraProveedor;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['certificado', 'fecha', 'expediente', 'opublicidad', 'comprobante', 'importe'];
  dataSource = new MatTableDataSource<Certificados>(constCertificados);
  selection = new SelectionModel<Certificados>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
 /* isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }*/

  /** Selects all rows if they are not all selected; otherwise clear selection. */
 /* masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  */
  forma:FormGroup;

  constructor(public dialogArt: MatDialog, private _compraService:CompraService) { 
    this.forma = new FormGroup({
        'proveedor': new FormControl('',Validators.required,this.existeProveedor),
        'razonSocial': new FormControl('',Validators.required),
    })
    
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.constCertificados.sort = this.sort;
    this.constCertificados.paginator = this.paginator;
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

}
