import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatIcon} from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { CdkTableModule } from '@angular/cdk/table';
import { ConsultaCrdService } from "../../../services/i2t/consulta-crd.service";
//import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";
import { Router, ActivatedRoute } from "@angular/router";


var auxArtiData:any;
var auxProvData:any;


@Component({
  selector: 'app-consulta-crd',
  templateUrl: './consulta-crd.component.html',
  styleUrls: ['./consulta-crd.component.css']
})

export class ConsultaCrdComponent implements OnInit {
  ProveedorData: any;
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];
  CompraProveedor: CompraProveedor;
  ELEMENT_DATA: ConsultaCrd[] = [];
  RazonSocial:string;
  nroInterno:number;
  cuitc:string;
  cuit:string;
  nroProveedor:number;

  displayedColumns: string[] = ['accion', 'ncrd', 'fech', 'pexp', 'opub', 'ncomr', 'total'];
  columnsToDisplay = ['accion', 'ncrd', 'fech', 'pexp', 'opub', 'ncomr', 'total'];
  dataSource = new MatTableDataSource<ConsultaCrd>(this.ELEMENT_DATA);
// ['ncrd', 'fech', 'npro', 'name', 'cuit_c', 'pexp', 'nexp', 'opub', 'tcom', 'ncomr', 'total']
  Controles: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  selection = new SelectionModel(true, []);
  id: any;
  loading: boolean = true;

  constructor(private route:ActivatedRoute,private router: Router,
              private _ConsultaCrdService:ConsultaCrdService,
              private _ImpresionCompService:ImpresionCompService,
              public snackBar: MatSnackBar)
    {
    this.Controles = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
   })

   this.route.params.subscribe( parametros=>{
     this.id = parametros['id'];
     //this.Controles['proveedor'].setValue(this.id);
     this.consultar();
   });

  }

  ngOnInit() {
    /*this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
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

  print(nint: number) {
   // window.open('http://devjasper.i2tsa.com.ar/Ejecutar_Reportes2.php?ruta_reporte=/E_Tangram/Reports/Compras/ET_ReferenciasContables&formato=PDF&param_param_nint=213334');
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
  /* const content = document.getElementById('tableCrd').innerHTML;
   const content2 = 'Proovedor: ' + this.nroProveedor + ' - ' + this.RazonSocial;
   const printWindow = window.open('', 'Print', 'height=745,width=1024');
    printWindow.document.write(content2);
    printWindow.document.write(content);

    printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();*/
    }

  consultar(){
 //   console.log(this.Controles.controls['proveedor'].value)
    this._ConsultaCrdService.getProveedorCrd( this.id, this.token )
      .subscribe( dataP => {
        console.log(dataP);
          this.ProveedorData = dataP;
          auxProvData = this.ProveedorData.dataset.length;
          if(this.ProveedorData.returnset[0].RCode=="-6003"){
            //token invalido
//             this.dataSource = null;
//             let jsbody = {"usuario":"usuario1","pass":"password1"}
//             let jsonbody = JSON.stringify(jsbody);
//             this._ConsultaCrdService.login(jsonbody)
//               .subscribe( dataL => {
//  //               console.log(dataL);
//                 this.loginData = dataL;
//                 this.token = this.loginData.dataset[0].jwt;
//                 this.consultar();
//               });
            } else {
              if(this.ProveedorData.dataset.length>0){
                this.ELEMENT_DATA = this.ProveedorData.dataset;
 //               console.log(this.ELEMENT_DATA[1].name);
                this.RazonSocial = this.ELEMENT_DATA[0].name;
                this.nroProveedor = this.ELEMENT_DATA[0].npro;
                this.cuitc = this.ELEMENT_DATA[0].cuit_c;
                this.nroInterno = this.ELEMENT_DATA[0].nint;
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                this.loading = false;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                let icuit = this.ELEMENT_DATA[0].cuit_c.slice(0,2)
              let mcuit = this.ELEMENT_DATA[0].cuit_c.slice(2,10)
              let fcuit = this.ELEMENT_DATA[0].cuit_c.slice(10)

              this.cuitc = icuit + '-' + mcuit + '-' + fcuit;
              } else {
                this.ELEMENT_DATA = null;
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                this.RazonSocial = null;
                this.cuitc = null;
                this.nroInterno = null;
                this.nroProveedor = null;

              }
            }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
export interface ConsultaCrd {
    nint: number;
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
