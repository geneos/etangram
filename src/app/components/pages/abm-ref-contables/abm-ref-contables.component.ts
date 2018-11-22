import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { RefContablesService } from "../../../services/i2t/ref-contables.service";
import { RefContable } from "../../../interfaces/ref-contable.interface";

@Component({
  selector: 'app-abm-ref-contables',
  templateUrl: './abm-ref-contables.component.html',
  styleUrls: ['./abm-ref-contables.component.css']
})
export class AbmRefContablesComponent implements OnInit {

  token: string = "a";
  auxRC:any;
  loginData: any;
  rcData:any;

  refContablesAll:RefContable[];
  loading:boolean;
  constRefContables = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableRefContables') table: MatTable<any>;

  selection = new SelectionModel(true, []);

  constructor(private _refContablesService:RefContablesService) {
    this.loading = true;
    this.buscarRefContable();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
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
                console.log(this.refContablesAll);
                this.loading = false;

                this.constRefContables = new MatTableDataSource(this.refContablesAll);

                this.constRefContables.sort = this.sort;
                this.constRefContables.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.refContablesAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  }
