import { Component, OnInit, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { Reporte, Atributo } from 'src/app/interfaces/consulta-din.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
@Component({
  selector: 'app-consulta-dinamica',
  templateUrl: './consulta-dinamica.component.html',
  styleUrls: ['./consulta-dinamica.component.css']
})
export class ConsultaDinamicaComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableDatos') table: MatTable<any>;

  selection = new SelectionModel(true, []);
  loading:boolean;
  token: string = "a";
  loginData: any;
  reportesAll: Reporte[];
  atributosAll: Atributo[];
  datosAll: any[];
  rData: any;
  attData: any;
  consData: any;
  displayedColumns: string[] = [];
  constDatos = new MatTableDataSource();
  
  constructor(private _consultaDinamicaService: ConsultaDinamicaService) { 
    this.loading = true;
    this.buscarReportes();
  }

  ngOnInit() {
    //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

    //

    //
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //const numSelected = this.selection.selected.length;
    // const numRows = this.constRefContables.data.length;
    // return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    /* this.isAllSelected() ?
        this.selection.clear() :
        this.constRefContables.data.forEach(row => this.selection.select(row)); */
  }

  buscarReportes(){
    this._consultaDinamicaService.getReportes(this.token)
      .subscribe( dataR => {
        //console.log(dataR);
          this.rData = dataR;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.rData.returnset[0].RCode=="-6003"){
            //token invalido
            this.reportesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._consultaDinamicaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarReportes();
              });
            } else {
              if(this.rData.dataset.length>0){
                this.reportesAll = this.rData.dataset;
                console.log(this.reportesAll);
                this.loading = false;
                //
                this.buscarAtributos();
/*
                this.constRefContables = new MatTableDataSource(this.reportesAll);

                this.constRefContables.sort = this.sort;
                this.constRefContables.paginator = this.paginator;
*/
                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.reportesAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }
  
  buscarAtributos(){
    console.log('Buscando atributos con:');
    console.log(this.reportesAll[0].name);
    //todo obtener el correcto/seleccionado
    this._consultaDinamicaService.getAtributos(this.reportesAll[0].name ,this.token) 
      .subscribe( dataAtt => {
        console.log(dataAtt);
          this.attData = dataAtt;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.attData.returnset[0].RCode=="-6003"){
            //token invalido
            this.reportesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._consultaDinamicaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarAtributos();
              });
            } else {
              if(this.attData.dataset.length>0){
                this.atributosAll = this.attData.dataset;
                console.log('Lista de atributos');
                console.log(this.atributosAll);
                this.establecerColumnas();
                this.loading = false;
/*
                this.constRefContables = new MatTableDataSource(this.reportesAll);

                this.constRefContables.sort = this.sort;
                this.constRefContables.paginator = this.paginator;
*/
                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.atributosAll = null;
                console.log('Lista de vacía');
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  buscarDatos(){
    console.log('Buscando datos con:');
    console.log(this.reportesAll[0].name);
    //todo obtener el correcto/seleccionado
    this._consultaDinamicaService.getDatos(this.reportesAll[0].name ,this.token) 
      .subscribe( dataCons => {
        console.log(dataCons);
          this.consData = dataCons;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.consData.returnset[0].RCode=="-6003"){
            //token invalido
            this.reportesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._consultaDinamicaService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarDatos();
              });
            } else {
              if(this.consData.dataset.length>0){
                this.datosAll = this.consData.dataset;
                console.log('Lista de datos: ');
                console.log(this.datosAll);
                this.loading = false;

                this.constDatos = new MatTableDataSource(this.datosAll);

                this.constDatos.sort = this.sort;
                this.constDatos.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.datosAll = null;
                console.log('Lista de vacía');
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  irDetalle(id:any){
    console.log('se intentó ir a: '||id);
  }

  establecerColumnas(){
    //asignar las seleccionadas, como "['select', 'opciones', 'codigo', 'nombre']"
    this.displayedColumns = [];
    this.displayedColumns.push('select', 'opciones');
    let listaColumnas : string[] = this.reportesAll[0].columnas.split(',');
    let primerVuelta = true;
    /*
    if (listaColumnas.length > 0) {
      
      console.log('lista obtenida del reporte: ');
      console.log(listaColumnas);
      
      listaColumnas.forEach(
        columna => {
          console.log('agregando la columna: ');
          console.log(columna);
          if (primerVuelta == true){
            console.log('transformando')
            console.log("'"||columna.trim()||"'");
            console.log(columna.trim());
            this.displayedColumns = "'"||columna.trim()||"'";
            primerVuelta = false;
            console.log('primera vuelta');
            console.log(this.displayedColumns);
          }
          else{
            this.displayedColumns = this.displayedColumns||','||"'"||columna.trim()||"'";
            
            console.log('vuelta');
            console.log(this.displayedColumns);
          }
        }
      );


      this.displayedColumns = "["||this.displayedColumns||"]";
    }
    else{
      this.displayedColumns = '[]';
    }
    */

    //todo  descomentar
    //todo probar poniendo codigo como columna
    /*listaColumnas.forEach(
      columna => {
        this.displayedColumns.push(columna.trim());
      }
    );*/
      this.displayedColumns = ['opciones', 'select', 'codigo'];
    this.buscarDatos();

    console.log('lista de columnas: ');
    console.log(this.displayedColumns);
    
  }
}
