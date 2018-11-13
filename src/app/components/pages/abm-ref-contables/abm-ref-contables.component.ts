import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { RefContablesService } from "../../../services/i2t/ref-contables.service";

const REFCONTABLES:any[] = [
  {'codigo':0,'nombre':'TEST.REF.CONTABLE'},
  {'codigo':1,'nombre':'REMUNER.PLANTA.PERMANENTE'}
];

@Component({
  selector: 'app-abm-ref-contables',
  templateUrl: './abm-ref-contables.component.html',
  styleUrls: ['./abm-ref-contables.component.css']
})
export class AbmRefContablesComponent implements OnInit {
  constRefContables2 = new MatTableDataSource(REFCONTABLES);

  token: string = "a";
  auxRC:any;
  loginData: any;
  rcData:any;

  refContablesAll:any[];
  constRefContables = new MatTableDataSource(this.refContablesAll);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableRefContables') table: MatTable<any>;

  selection = new SelectionModel(true, []);

  constructor(private _refContablesService:RefContablesService) { }

  ngOnInit() {
    this.buscarRefContable();
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constRefContables.sort = this.sort;
    this.constRefContables.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constRefContables.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constRefContables.data.forEach(row => this.selection.select(row));
  }

  buscarRefContable(){
    this._refContablesService.getRefContables( this.token )
    //this._compraService.getProveedores()
      .subscribe( dataRC => {
        //console.log(dataRC);
          this.rcData = dataRC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContablesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContable();
              });
            } else {
              if(this.rcData.dataset.length>0){
                this.refContablesAll = this.rcData.dataset;
              } else {
                this.refContablesAll = null;
              }
            }
            //console.log(this.refContablesAll);
            this.constRefContables = new MatTableDataSource(this.refContablesAll);
            this.table.renderRows();
      });
  }

  }
