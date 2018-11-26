import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { PlanCuentasService } from "../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../interfaces/plan-cuenta.interface";

@Component({
  selector: 'app-abm-plan-de-cuentas',
  templateUrl: './abm-plan-de-cuentas.component.html',
  styleUrls: ['./abm-plan-de-cuentas.component.css']
})
export class AbmPlanDeCuentasComponent implements OnInit {

  token: string = "a";
  auxRC:any;
  loginData: any;
  pcData:any;

  planesDeCuotasAll:PlanCuenta[];
  loading:boolean;
  constPlanesCuentas = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tablePlanesCuentas') table: MatTable<any>;

  selection = new SelectionModel(true, []);

  constructor(private _planCuentasService:PlanCuentasService) {
    this.loading = true;
    this.buscarPlanCuentas();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
  }
/* 
  ngAfterViewInit() {
    this.constPlanesCuentas.paginator = this.paginator;
  } */

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constPlanesCuentas.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constPlanesCuentas.data.forEach(row => this.selection.select(row));
  }

  buscarPlanCuentas(){
    /*
    this._planCuentasService.getPlanesDeCuentas( this.token )
      .subscribe( dataPC => {
        //console.log(dataPC);
          this.pcData = dataPC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.planesDeCuotasAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._planCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPlanCuentas();
              });
            } else {
              if(this.pcData.dataset.length>0){
                this.planesDeCuotasAll = this.pcData.dataset;
                console.log(this.planesDeCuotasAll);
                this.loading = false;

                this.constPlanesCuentas = new MatTableDataSource(this.planesDeCuotasAll);

                this.constPlanesCuentas.sort = this.sort;
                this.constPlanesCuentas.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.planesDeCuotasAll = null;
              }
            }
            //console.log(this.planesDeCuotasAll);
      });
      */
    this.pcData = this._planCuentasService.getPlanesDeCuentas( this.token );
    /* this.pcData = [{
      id: '1',
      nombre: 'Activo Corriente',
      cuenta_contable: '1.11.0.0.0000',
      nomenclador:'1.11',
      nomenclador_padre:'1',
      orden:'0',
      estado:1,
      imputable:1,
      patrimonial:0
    }]; */

    //if(this.pcData.length>0){
      this.planesDeCuotasAll = this.pcData;
      console.log(this.planesDeCuotasAll);
      this.loading = false;

      this.constPlanesCuentas = new MatTableDataSource(this.planesDeCuotasAll);
      console.log(this.constPlanesCuentas);
      this.constPlanesCuentas.sort = this.sort;
      this.constPlanesCuentas.paginator = this.paginator;

      
    //}
      //this.table.renderRows();
      //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    /*
      .subscribe( dataPC => {
        //console.log(dataPC);
          this.pcData = dataPC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.planesDeCuotasAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._planCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPlanCuentas();
              });
            } else {
              if(this.pcData.dataset.length>0){
                this.planesDeCuotasAll = this.pcData.dataset;
                console.log(this.planesDeCuotasAll);
                this.loading = false;

                this.constPlanesCuentas = new MatTableDataSource(this.planesDeCuotasAll);

                this.constPlanesCuentas.sort = this.sort;
                this.constPlanesCuentas.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.planesDeCuotasAll = null;
              }
            }
            //console.log(this.planesDeCuotasAll);
      });
*/
    }

  }

