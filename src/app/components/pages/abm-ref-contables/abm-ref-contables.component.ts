import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Reporte, Atributo } from 'src/app/interfaces/consulta-din.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { RefContablesService } from "../../../services/i2t/ref-contables.service";
import { RefContable } from "../../../interfaces/ref-contable.interface";
import { PermisosService } from "../../../services/i2t/permisos.service";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-abm-ref-contables',
  templateUrl: './abm-ref-contables.component.html',
  styleUrls: ['./abm-ref-contables.component.css']
})
export class AbmRefContablesComponent implements OnInit {

  token: string;
  auxRC:any;
  loginData: any;
  rcData:any;
  rData: any;
  pData: any;
  reportesAll: Reporte[] = [];
  nombreReporte: string;
  reporteSeleccionado : number;
  reporteMostrado: number; 
  reporteCambiado: boolean= false;

  permisos = {
    permiso_crear: false,
    permiso_editar: false,
    permiso_borrar: false,
    permiso_mostrar: false,
    permiso_exportar: false
  }
  
  refContablesAll:RefContable[];
  loading:boolean;
  constRefContables = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableRefContables') table: MatTable<any>;

  selection = new SelectionModel(true, []);

  constructor(private _refContablesService:RefContablesService,
              private _permisosService: PermisosService,
              private _consultaDinamicaService: ConsultaDinamicaService,
              public snackBar: MatSnackBar,
              @Inject(SESSION_STORAGE) private storage: StorageService
              ) {

                console.log(this.storage.get(TOKEN) || 'Local storage is empty');
                this.token = localStorage.getItem(TOKEN)
              //  this.token = this.storage.get(TOKEN);

    this.loading = true;
    this.buscarRefContable();
    this.buscarReportes();
  }
  

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
  
  }
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
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
  
  habilitarAcciones(){
    /* this.permiso_crear	=;
    this.permiso_editar	=;
    this.permiso_borrar	=;
    this.permiso_mostrar	=;
    this.permiso_exportar=; */
    Object.keys(this.permisos).forEach(permiso => {
      // console.log(permiso, this.reportesAll[this.reporteSeleccionado][permiso]);
      if (this.reportesAll[this.reporteSeleccionado][permiso] == ''){
        this.permisos[permiso] = true;
        console.log('permiso ' + permiso + ' habilitado por vacio');
      }
      else{
        //todo cambiar por usuario real (tal vez traido por parametros)
        //this._permisosService.getPermiso( this.usuario,
        console.log(this.reportesAll[this.reporteSeleccionado][permiso])
        this._permisosService.getPermiso( 'usuario2',
                                          this.reportesAll[this.reporteSeleccionado][permiso],
                                          this.token)
        .subscribe( dataP => {
          //console.log(dataR);
          this.pData = dataP;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.pData.returnset[0].RCode=="-6003"){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._consultaDinamicaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.habilitarAcciones();
              });
            } else {
              console.log('respuesta===> ', this.pData.returnset[0])
              if(this.pData.returnset[0].RCode=="200"){
                this.permisos[permiso] = true;
              }
              //this.pData.returnset[0].RCode=="-501" => no existe o usuario incorrecto
              else {
                this.permisos[permiso] = false;
                console.log('permiso ' + permiso + ' deshabilitado por respuesta de error: '+ this.pData.returnset[0].RTxt);
              }
            }
      });
      }

    });
    console.log(this.reportesAll[this.reporteSeleccionado]);
  }

  buscarReportes(){
    this._consultaDinamicaService.getReporte('tg01_referenciascontables', this.token)
      .subscribe( dataR => {
        console.log(dataR);
          this.rData = dataR;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.rData.returnset[0].RCode=="-6003"){
            //token invalido
            this.reportesAll = null;
            // let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsonbody = JSON.stringify(jsbody);
            // this._consultaDinamicaService.login(jsonbody)
            //   .subscribe( dataL => {
            //     console.log(dataL);
            //     this.loginData = dataL;
            //     this.token = this.loginData.dataset[0].jwt;
            //     this.buscarReportes();
            //   });
            } else {
              if(this.rData.dataset.length>0){
                this.reportesAll = this.rData.dataset;
                console.log(this.reportesAll);
                if (this.rData.dataset.length >0)
                {
                  this.reporteSeleccionado = this.reportesAll.findIndex(reporte => reporte.name === 'tg01_referenciascontables');
                  if (this.reporteSeleccionado != -1)
                {
                  if (this.reporteSeleccionado != this.reporteMostrado){
                    this.reporteMostrado = this.reporteSeleccionado;
                    this.reporteCambiado = true;
                  }
                  this.habilitarAcciones();
                }
                else{
                  this.openSnackBar('No existe la consulta "' + this.nombreReporte + '"');
                  this.loading = false;
                }
                }
                else{
                  this.openSnackBar('No existe la consulta "' + this.nombreReporte + '"');
              //    this.limpiarDatos();
                  this.loading = false;
                }

                // this.buscarAtributos();

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.reportesAll = null;
              }
            }
      });

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
