import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatCellDef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsultaCrdService } from "../../../services/i2t/consulta-crd.service";
import { ConsultaCrdItem } from "../../../interfaces/consulta-crd.interface";


var auxArtiData:any;
var auxProvData:any;


@Component({
  selector: 'app-consulta-crd',
  templateUrl: './consulta-crd.component.html',
  styleUrls: ['./consulta-crd.component.css']
})
export class ConsultaCrdComponent implements OnInit {

  ELEMENT_DATA: any; //ConsultaCrd[] = [];
  displayedColumns: string[] = ['ncrd', 'fecha', 'npro', 'name', 'cuit_c', 'pexp', 'nexp', 'opub', 'tcom', 'ncomr', 'total'];
  dataSource = new MatTableDataSource<ConsultaCrd>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _ConsultaCrdService:ConsultaCrdService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  loginData: any;
  token: string = "a";
  buscarProveedorCrd(){
    this._ConsultaCrdService.getProveedor( 23/* this.Controles.controls['prov'].value*/, this.token )
      .subscribe( dataP => {
        console.log(dataP);
          this.ELEMENT_DATA = dataP;
          auxProvData = this.ELEMENT_DATA.dataset.length;
          if(this.ELEMENT_DATA.returnset[0].RCode=="-6003"){
            //token invalido
            this.dataSource = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._ConsultaCrdService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProveedorCrd();
              });
            } else {
              if(this.ELEMENT_DATA.dataset.length>0){
                this.ELEMENT_DATA = this.ELEMENT_DATA.dataset[0];
              } else {
                this.ELEMENT_DATA = null;
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


