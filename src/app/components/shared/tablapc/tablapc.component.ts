import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { PlanCuentasService } from "../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../interfaces/plan-cuenta.interface";
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-tablapc',
  templateUrl: './tablapc.component.html',
  styleUrls: ['./tablapc.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TablapcComponent implements OnInit {

  expandedElement: PlanCuenta | null;

  @Input() token: string = "a";
  auxRC:any;
  loginData: any;
  pcData:any;

  planesDeCuotasAll:PlanCuenta[];
  loading:boolean;

  constPlanesCuentas = new MatTableDataSource();

  @ViewChild('compHija') compHija:TablapcComponent;
  @Input() padreId:string = "";
  test:string = "test";

  @ViewChild('tablePlanesCuentas') table: MatTable<any>;

  selection = new SelectionModel(false, []);

  constructor(private _planCuentasService:PlanCuentasService) {
    this.loading = true;
    this.buscarPlanCuentas();
  }

  ngOnInit() {
    console.log(this.padreId);
  }

  buscarPlanCuentas(){

    this._planCuentasService.getPlanesDeCuentasPadre( this.token,this.padreId )
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

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.planesDeCuotasAll = null;
              }
            }
            //console.log(this.planesDeCuotasAll);
      });

    }

}