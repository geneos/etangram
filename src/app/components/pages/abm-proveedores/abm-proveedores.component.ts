import { Component, OnInit, ViewChild, Inject, Injectable  } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { Proveedor } from "../../../interfaces/proveedor.interface";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

/*const PROVEEDORES:any[] = [
  {'codigo':0,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'codigo':1,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'codigo':2,'razonSocial':'Lunix S.R.L.','cuit':'30-987654321-0','posicionFiscal':'IVA Responsable Inscripto'},
];*/

@Injectable()

@Component({
  selector: 'app-abm-proveedores',
  templateUrl: './abm-proveedores.component.html',
  styleUrls: ['./abm-proveedores.component.css']
})
export class AbmProveedoresComponent implements OnInit {
  constProveedores = new MatTableDataSource();
  token: string;

  proveedoresAll:Proveedor[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selection = new SelectionModel(true, []);
  loading: boolean;
  prData: any;

  constructor(private _proveedoresService:ProveedoresService,
    @Inject(SESSION_STORAGE) private storage: StorageService
    ) { 
      console.log(this.storage.get(TOKEN) || 'Local storage is empty');
      this.token = this.storage.get(TOKEN);

      this.loading = true;
      this.buscarProveedores();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constProveedores.sort = this.sort;
    this.constProveedores.paginator = this.paginator;
  }

  buscarProveedores(){
    this._proveedoresService.getCProveedores( this.token )
      .subscribe( dataRC => {
        //console.log(dataRC);
          this.prData = dataRC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.prData.returnset[0].RCode=="-6003"){
            //token invalido
            this.proveedoresAll = null;
            console.log("token invalido");
            //let jsbody = {"usuario":"usuario1","pass":"password1"}
            //let jsonbody = JSON.stringify(jsbody);
            //this._refContablesService.login(jsonbody)
              //.subscribe( dataL => {
              // console.log(dataL);
              // this.loginData = dataL;
              // this.token = this.loginData.dataset[0].jwt;
              // this.buscarRefContable();
              //});
            } else {
              if(this.prData.dataset.length>0){
                this.proveedoresAll = this.prData.dataset;
                console.log(this.proveedoresAll);

                this.constProveedores = new MatTableDataSource(this.proveedoresAll);

                this.constProveedores.sort = this.sort;
                this.constProveedores.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

                this.loading = false;

              } else {
                this.proveedoresAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constProveedores.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constProveedores.data.forEach(row => this.selection.select(row));
  }

}
