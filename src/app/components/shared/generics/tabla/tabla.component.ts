import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { MatSort, MatPaginator, MatTable, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements CompGen {
  // @Input() data: any;
  //private _data: string;

  displayedColumns: string[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  private constDatos = new MatTableDataSource();
  private selection = new SelectionModel(true, []);
  // @Input() data: any;
  private _data: any;

  @Input() set data(value: any) {

    this._data = value;
    if (this._data != null) {
      /* console.log('Datos recibidos en componente tabla: ');
      console.log('-- data --');
      console.log(this._data);
      console.log('-- datos --');
      console.log(this._data.datos);
      console.log('-- datos.datos --');
      console.log(this._data.datos.datos);
      console.log('-- datos.valores --');
      console.log(this._data.datos.valores);
      // this.constDatos = this._data.datos;

      console.log('fin datos recibidos'); */

      //
      /* var transpose = this._data.datos.datos.reduce(function(arr, obj) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            arr[key] = arr[key] || []
            arr[key].push(obj[key])
          }
        }
        return arr
      }, {})
      console.log('Datos transpuestos: ');
      console.log(transpose)
      console.log('fin datos transpuestos')
      let constDatos2 = new MatTableDataSource(transpose);
      console.log(transpose.atributo);
      console.log(constDatos2); */
      //
      // this.displayedColumns= ['select', 'columna', 'tipo', 'longitud'];
      // let displayed= ['select', 'columna'];
      let displayed = ['select', 'titulo'];
      // this.displayedColumns = [...displayed, ...transpose.atributo];
      this.displayedColumns = [...displayed];

      /*
      this.constDatos = new MatTableDataSource(this._data.datos.datos);
      */
    //  console.log('datos (no va) ', this._data.datos.datos)
      // let datos = this._data.datos.valores.map(valor => valor.title);
      /* this._data.datos.valores.forEach(valor => {
        
      }); */
      // console.log('array para tabla de columnas: ', datos)
      // this.constDatos = new MatTableDataSource(this._data.datos.valores.map(valor => valor.title))
      this.constDatos = new MatTableDataSource(this._data.datos.valores);
      // console.log('mattabledatasource: ', this.constDatos);
      
      this.constDatos.sort = this.sort;
      this.constDatos.paginator = this.paginator;
      // console.log('seleccionado inicial: ', this._data.datos.selection)
      this.selection  = this._data.datos.selection;

      
    }

  }

  get data(): any {

    this._data.datos = this.constDatos;
    this._data.selection  = this.selection;
    return this._data;

  }


/*
  @Input() set data(value: any) {
    console.log('Datos recibidos en componente tabla: ');
    console.log(this.data);
    this.constDatos = value.datos;
    this.selection  = value.selection;

  }

  get data(): any {

      return this._data;

  }
  */
  options : any[];
  constructor() { 

  }
  //ngOnChanges no funcionó como esperado.
  /* 
  ngOnChanges(changes: SimpleChanges){
  console.log('cambio detectado en lista desplegable');
  this.construirLista();
  } */

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constDatos.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constDatos.data.forEach(row => this.selection.select(row));
  }

  construirLista(){
  //formato: "0:Activo,1:Inactivo,2:Baja,9:Pendiente"
  let listaOpciones : string[] = (this.data.datos.valores.split(','));
  this.options= [];
  listaOpciones.forEach(opcion => {
    console.log(opcion);
    let p1 = opcion.substr(0, opcion.indexOf(':'));
    let p2 = opcion.substr(opcion.indexOf(':')+1);
    this.options.push({key: p1, value: p2});
  });
  // console.log('Lista armada en control: ');
  // console.log(this.options);
  }

  // ngOnInit() {}


}