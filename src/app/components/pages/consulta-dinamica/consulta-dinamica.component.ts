import { Component, OnInit, ViewChild, Input, ComponentFactoryResolver} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatPaginator, MatTable, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Reporte, Atributo } from 'src/app/interfaces/consulta-din.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { CdkTableModule } from '@angular/cdk/table';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';
import { AnclaParaFiltrosDirective } from 'src/app/directives/ancla-para-filtros.directive';
import { CompGenService } from 'src/app/services/i2t/comp-gen.service';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { AnclaParaAvanzadosDirective } from 'src/app/directives/ancla-para-avanzados.directive';
import { AnclaParaColumnasDirective } from 'src/app/directives/ancla-para-columnas.directive';


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
  columns: any[];
  columnasSeleccionadas: string;
  columnasSelectas: any;
  constDatos = new MatTableDataSource();
  irADetalle: boolean;

  reporteSeleccionado : number;
  
  //para controles dinamicos
  estadoBasico = false;
  estadoAvanzado = false;
  estadoColumnas = false;

  @Input() componentes: ComponentWrapper[];
  @ViewChild(AnclaParaFiltrosDirective) contenedorFiltros: AnclaParaFiltrosDirective;
  @ViewChild(AnclaParaAvanzadosDirective) contenedorAvanzados: AnclaParaAvanzadosDirective;
  @ViewChild(AnclaParaColumnasDirective) contenedorColumnas: AnclaParaColumnasDirective;

  //
  constructor(private _consultaDinamicaService: ConsultaDinamicaService,
              public snackBar: MatSnackBar,
              private componentFactoryResolver: ComponentFactoryResolver,
              private generadorDeComponentes: CompGenService) { 
    this.loading = true;
    this.reporteSeleccionado=0;//todo elegir reporte inicial
    //todo: dialogo|modal: mostrar sólo el botón del reporte|objeto que corresponda
    this.buscarReportes();

    //todo dialogos|modals
    //mientras tanto en paneles

    //
  }

  ngOnInit() {
    //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

  }

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

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  menuClickHandler(nroReporte: number){
    if (this.reporteSeleccionado!==nroReporte){
      this.loading = true;
      this.reporteSeleccionado=nroReporte;
      this.establecerColumnas();
    }
    else{
      this.openSnackBar('Ya se está mostrando la lista seleccionada.');
    }
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
                
                this.buscarAtributos();

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.reportesAll = null;
              }
            }
      });
  }
  
  buscarAtributos(){
    //
    console.log('Buscando atributos con:');
    console.log(this.reportesAll[this.reporteSeleccionado].name);
    //
    //todo obtener el correcto/seleccionado
    this._consultaDinamicaService.getAtributos(this.reportesAll[this.reporteSeleccionado].name ,this.token) 
      .subscribe( dataAtt => {
        console.log(dataAtt);
          this.attData = dataAtt;
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
                
                //generar componentes para sección de filtros
                this.generarFiltros();
                //todo
                  //generar componentes para sección de filtros avanzados
                  //generar tabla de columnas
                
                this.loading = false;
                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.atributosAll = null;
                console.log('Lista de atributos vacía');
              }
            }
      });
  }

  buscarDatos(){
    //
    console.log('Buscando datos con:');
    console.log(this.reportesAll[this.reporteSeleccionado].name);
    //
    this._consultaDinamicaService.getDatos(this.reportesAll[this.reporteSeleccionado].name ,this.token) 
      .subscribe( dataCons => {
        console.log(dataCons);
          this.consData = dataCons;
          if(this.consData.returnset[0].RCode=="-6003"){
            //token invalido
            this.datosAll = null;
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
                //todo borrar, probando dinamico
                let objdin: Reporte;
                objdin = this.datosAll[0];
                console.log('estructura de Obj. dinamico: ');
                console.log(Object.keys(objdin));
                //
                this.loading = false;

                this.constDatos = new MatTableDataSource(this.datosAll);

                this.constDatos.sort = this.sort;
                this.constDatos.paginator = this.paginator;

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
    this.irADetalle = true;
  }

  establecerColumnas(){
    //asignar las seleccionadas, como "['select', 'opciones', 'codigo', 'nombre']"
    this.displayedColumns = [];
    let columnasAMostrar: string;
    columnasAMostrar = '';
    if (this.columnasSeleccionadas == null){
      console.log('lista traida del reporte: ');
      console.log(this.reportesAll[this.reporteSeleccionado].columnas);
      //todo quitar if y descomentar cuando arreglen los datos
      let listaColumnas : string[] = (this.reportesAll[this.reporteSeleccionado].columnas.split(','));
      
      /* let listaColumnas : string[] = [];
      if (this.reportesAll[this.reporteSeleccionado].name === 'c_proveedores'){
        listaColumnas = ['c_texto', 'c_numero', 'c_cuit'];
      }
      else{
        listaColumnas.push('name');
      } */
      let itemActual: string;
      console.log(listaColumnas.length)
      for (let index = 0; index < listaColumnas.length; index++) {
        itemActual = listaColumnas[index].trim();
        console.log(itemActual);
        console.log(index);
        columnasAMostrar = columnasAMostrar.concat(itemActual, ',');
      }
      columnasAMostrar = columnasAMostrar.substr(0, columnasAMostrar.length-1);
      console.log('Lista rearmada: ');
      console.log(columnasAMostrar);
    }
    else{
      columnasAMostrar = this.columnasSeleccionadas;
      console.log('el usuario seleccionó las columnas: ');
      console.log(columnasAMostrar);
    }
    //todo agregar las columnas que coincidan con las que ha que mostrar, comparando con (Object.keys(objeto))
    //todo agregar busqueda del texto del header en tg06_tg_atributos cuando se agreguen
    let listaColumnas : string[] = (columnasAMostrar.split(','));
    this.columns = [];
    //
    console.log('buscando metadatos de columnas: ');
    //
    listaColumnas.forEach(columna => {
      console.log('columna: ' + columna);
      let atributoActual = this.atributosAll.find(atributo => atributo.atributo_bd === columna );
      console.log(atributoActual);
      //todo revisar cuando corrijan las correspondencias entre apis
      if (atributoActual != null) {
      this.columns.push({ columnDef: columna, 
                          header: atributoActual.desc_atributo,    
                          cell: (item: any) => `${item[atributoActual.atributo_bd]}` 
      }
                        );}
      // this.columns.push({ columnDef: columna, header: columna,    cell: (item: any) => `${item[columna]}` });
    }); //item[columna] sirve para buscar el dato con el nombre de atributo
    
/*
      let columns = [
        { columnDef: 'select',    header: 'Select',   cell: (row: any) => ``      },
        { columnDef: 'opciones',    header: 'Opciones',   cell: (row: any) => ``      }
        //,{ columnDef: 'column.',    header: 'Codigo',   cell: (row: any) => `${row.codigo}`      }
      ];
    */    
   
    /** Column definitions in order */
    //this.displayedColumns = this.columns.map(c => c.columnDef);
    //this.displayedColumns = this.displayedColumns.push([{columnDef: 'select', header: '', cell: (item: any) => ''}, ]);

    /** columnas fijas */
    //todo: dialogo|modal: mostrar dependiendo de lo que se debería poder hacer en cada modal

    /* let columnasfijas = [
      { columnDef: 'select',    header: 'Select',   cell: (item: any) => ``      },
      { columnDef: 'opciones',    header: 'Opciones',   cell: (item: any) => ``      }]; */
    let columnasfijas = ['select', 'opciones'];

    
    //this.displayedColumns = this.displayedColumns.concat(columnasfijas, this.columns.map(c => c.columnDef));
    this.displayedColumns = [...columnasfijas, ...this.columns.map(c => c.columnDef)];
      
    this.buscarDatos();
    //
    console.log('lista de columnas: ');
    console.log(this.displayedColumns);
    //
    //
    let repo: Reporte;
    repo = this.reportesAll[this.reporteSeleccionado];
    console.log('estructura de Reporte: ');
    console.log(Object.keys(repo));
    //
  }

  handleRowClick(row: any){
    console.log('se clickeo: ');
    console.log(row);
    if (this.irADetalle === true){
      this.irADetalle = false;
      //todo agregar enrutamiento al objeto correspondiente
      console.log('Se intentará ir al objeto correspondiente de id: ');
      console.log(row['id']);
    }
  }

  generarFiltros(){
    //Crear filtros
    let viewContainerRef = this.contenedorFiltros.viewContainerRef;
    viewContainerRef.clear();
    
    //recorrer lista de atributos para filtros
    console.log('generando controles de filtrado para la lista: ');
    console.log(this.atributosAll);
    //
    let atributosFiltro = this.atributosAll.filter(atributoActual => atributoActual.grupo === 'Filtros');
    atributosFiltro.forEach(atributoActual => {
      
      let control = this.generadorDeComponentes.getComponent(atributoActual.tipo_dato, 
                                                             atributoActual.desc_atributo, 
                                                             'Esta es una prueba',
                                                             {valores: atributoActual.valores});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<CompGen>componentRef.instance).data = control.data;
      console.log('probando ver los valores de los filtros: ');
      console.log((<CompGen>componentRef.instance).data);
      
      console.log('probando ver los valores de los filtros v2: ');
      console.log(viewContainerRef);
      
      console.log('probando ver los valores de los filtros v3: ');
      console.log(componentRef.instance);
    });
    
    //Crear Avanzados
    viewContainerRef = this.contenedorAvanzados.viewContainerRef;
    viewContainerRef.clear();
    
    //recorrer lista de atributos para filtros
    console.log('generando controles avanzados para la lista: ');
    console.log(this.atributosAll);
    //
    let atributosAvanzados = this.atributosAll.filter(atributoActual => atributoActual.grupo === 'Avanzado');
    atributosAvanzados.forEach(atributoActual => {
      
      let control = this.generadorDeComponentes.getComponent(atributoActual.tipo_dato, 
                                                             atributoActual.desc_atributo, 
                                                             'Esta es una prueba',                                                             
                                                             {valores: atributoActual.valores});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<CompGen>componentRef.instance).data = control.data;
    });

    //Crear tabla con checkboxes de columnas
    this.columnasSelectas = new SelectionModel(true, []);
    
    viewContainerRef = this.contenedorColumnas.viewContainerRef;
    viewContainerRef.clear();

    let control = this.generadorDeComponentes.getComponent('Tabla', 
                  'Datos de la tabla', 
                  'Seleccione columnas a visualizar',                                                             
                   {datos: this.atributosAll, selection: this.columnasSelectas});
                  // {datos: {datos: this.atributosAll, selection: this.columnasSelectas}});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<CompGen>componentRef.instance).data = control.data;

    console.log('probando leer la lista de selección de las columnas:');
    console.log((<CompGen>componentRef.instance).data);
  }
/* 
  verSeleccionados(){
    console.log(this.selection);
    console.log(this.selection.selected); //any[]
  } */
}
