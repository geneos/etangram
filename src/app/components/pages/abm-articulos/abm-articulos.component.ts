import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Reporte, Atributo } from 'src/app/interfaces/consulta-din.interface';
import { PermisosService } from "../../../services/i2t/permisos.service";
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';


const TOKEN = '';
const ARTICULOS:any[] = [
  {'codigo':0,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40},
  {'codigo':1,'articulo':'Gomitas Mogul','unidadMedida':'Bolsa(s)','precioUnitario':35},
  {'codigo':2,'articulo':'Chupetines Mr. Pops','unidadMedida':'Bolsa(s)','precioUnitario':50},
  {'codigo':3,'articulo':'Alfajores Terrabusi','unidadMedida':'Caja(s)','precioUnitario':72},
  {'codigo':4,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40}
];

@Injectable()

@Component({
  selector: 'app-abm-articulos',
  templateUrl: './abm-articulos.component.html',
  styleUrls: ['./abm-articulos.component.css']
})
export class AbmArticulosComponent implements OnInit {
  token: string;

  reportesAll: Reporte[] = [];
  nombreReporte: string;
  reporteSeleccionado : number;
  reporteMostrado: number; 
  reporteCambiado: boolean= false;
  rData: any;
  pData: any;
  loginData: any;

  permisos = {
    permiso_crear: false,
    permiso_editar: false,
    permiso_borrar: false,
    permiso_mostrar: false,
    permiso_exportar: false
  }
  //constArticulos=ARTICULOS;
  constArticulos = new MatTableDataSource(ARTICULOS);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading: boolean;
  selection = new SelectionModel(true, []);

  constructor( private _permisosService: PermisosService,
              @Inject(SESSION_STORAGE) private storage: StorageService,
               private _consultaDinamicaService: ConsultaDinamicaService,
               public snackBar: MatSnackBar) { 
    console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem(TOKEN);
          
    this.loading = true;             
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constArticulos.sort = this.sort;
    this.constArticulos.paginator = this.paginator;
  }
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
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
    this._consultaDinamicaService.getReporte('c_articulos', this.token)
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
                  this.reporteSeleccionado = this.reportesAll.findIndex(reporte => reporte.name === 'c_articulos');
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constArticulos.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constArticulos.data.forEach(row => this.selection.select(row));
  }

}
