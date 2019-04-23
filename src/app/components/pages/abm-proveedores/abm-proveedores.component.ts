import { Component, OnInit, ViewChild, Inject, Injectable  } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { Proveedor } from "../../../interfaces/proveedor.interface";
import { Reporte, Atributo } from 'src/app/interfaces/consulta-din.interface';
import { PermisosService } from "../../../services/i2t/permisos.service";
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
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
  logueado: boolean = true;
  proveedoresAll:Proveedor[];

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selection = new SelectionModel(true, []);
  loading: boolean;
  prData: any;

  constructor(private _proveedoresService:ProveedoresService,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              private _permisosService: PermisosService,
              private _consultaDinamicaService: ConsultaDinamicaService,
              public snackBar: MatSnackBar,
    ) { 
      console.log(this.storage.get('TOKEN') || 'Local storage is empty');
      this.token = this.storage.get('TOKEN');

      if (localStorage.length == 0){
        this.loading = true;
        setTimeout(() => {
          this.logueado = false;     
       //   this.openSnackBar('No ha iniciado sesión')
        }, 1000);  //2s
      } else {
        this.loading = false;
      } 

      this.buscarProveedores();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constProveedores.sort = this.sort;
    this.constProveedores.paginator = this.paginator;
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
    this._consultaDinamicaService.getReporte('c_proveedores', this.token)
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
                  this.reporteSeleccionado = this.reportesAll.findIndex(reporte => reporte.name === 'c_proveedores');
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
