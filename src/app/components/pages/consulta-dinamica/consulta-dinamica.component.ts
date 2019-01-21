import { Component, OnInit, ViewChild, Input, ComponentFactoryResolver, ViewChildren, ViewContainerRef, QueryList, AfterViewInit, ViewEncapsulation} from '@angular/core';
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
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { PermisosService } from 'src/app/services/i2t/permisos.service';


@Component({
  selector: 'app-consulta-dinamica',
  templateUrl: './consulta-dinamica.component.html',
  styleUrls: ['./consulta-dinamica.component.css'],
  // encapsulation: ViewEncapsulation.None, 
})
export class ConsultaDinamicaComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableDatos') table: MatTable<any>;

  selection = new SelectionModel(true, []);
  loading:boolean;
  token: string = "a";
  loginData: any;

  reportesAll: Reporte[] = [];
  nombreReporte: string;
  reporteSeleccionado : number;

  atributosAll: Atributo[];
  datosAll: any[];
  rData: any;
  pData: any;
  attData: any;
  consData: any;
  displayedColumns: string[] = [];
  columns: any[];
  columnasSeleccionadas: string;
  columnasSelectas: any;
  constDatos = new MatTableDataSource();
  irADetalle: boolean;
  inputParam: any;
  
  columnSelection: any;
  filtros: any;
  filtrosAnteriores: any;

  //permisos
  /* permiso_crear: boolean;
  permiso_editar: boolean;
  permiso_borrar: boolean;
  permiso_mostrar: boolean;
  permiso_exportar: boolean; */
  permisos = {
    permiso_crear: false,
    permiso_editar: false,
    permiso_borrar: false,
    permiso_mostrar: false,
    permiso_exportar: false
  }

  @Input() componentes: ComponentWrapper[];
  //anclas para componentes generados movidas a otros componentes
  /* @ViewChild(AnclaParaFiltrosDirective) contenedorFiltros: AnclaParaFiltrosDirective;
  @ViewChild(AnclaParaAvanzadosDirective) contenedorAvanzados: AnclaParaAvanzadosDirective; 
  @ViewChild(AnclaParaColumnasDirective) contenedorColumnas: AnclaParaColumnasDirective; */

  constructor(private _consultaDinamicaService: ConsultaDinamicaService,
              public snackBar: MatSnackBar,
              private route:ActivatedRoute,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private generadorDeComponentes: CompGenService,
              public ngxSmartModalService: NgxSmartModalService,
              private _permisosService: PermisosService) { 
    this.loading = true;

    this.route.params.subscribe( parametros=>{
      console.log('ruta actual: ',this.router.url)
      if (this.router.url.includes('/consulta/') == true)
      {
        this.nombreReporte = parametros['id'];
        this.buscarReportes();
      }
      else{
        this.nombreReporte = null;
      }
    });
    

  }

  ngOnInit() {
    /*
    //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    console.log('suscripcion propia');
    // suscribir a los datos del modal
    /* datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      // valores: any;
      // columnSelection: any
    } /
    //
    this.ngxSmartModalService.getModal('consDinModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('consDinModal');
      console.log('configuracion del modal de consulta din(suscripcion): ', this.inputParam);
      
      if (this.inputParam.permiteMultiples ==null)
      {
        this.inputParam = {permiteMultiples: true, selection: []};
      }
      //establecer modo (múltiple o simple), inicializar con lo establecido al llamar
      this.selection = new SelectionModel(this.inputParam.permiteMultiples, this.inputParam.selection);
      if (this.nombreReporte == null){
        this.nombreReporte = this.inputParam.consulta;
        this.buscarReportes();
      }
    });
    */
  }

  ngAfterViewInit(){    
    // this.habilitarAcciones();

    console.log('suscribiendo al modal de tabla')
    //suscribir a los cambios en los otros modales
    //modal de selección de columnas
    this.ngxSmartModalService.getModal('cdTablaModal').onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de tabla: ', modal);
      
      let datostemp = this.ngxSmartModalService.getModalData('cdTablaModal');
      console.log('temp: ', datostemp);
      console.log('temp.estado', datostemp.estado)
      console.log('test cancelado: ', (this.ngxSmartModalService.getModalData('cdTablaModal').estado !== 'cancelado'))

      if(this.ngxSmartModalService.getModalData('cdTablaModal').estado !== 'cancelado'){

        this.establecerColumnas();
      }
      // this.ngxSmartModalService.getModal(nombreModal).onClose.unsubscribe();
    });
    
    console.log('suscribiendo a filtros')
    //suscribir a los botones de los modales
    this.ngxSmartModalService.getModal('cdFiltrosModal').onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal: ', modal.getData());

      //si cambiaron los datos:
      let datostemp = this.ngxSmartModalService.getModalData('cdFiltrosModal');
      console.log('temp: ', datostemp);
      console.log('temp.estado', datostemp.estado)
      console.log('test cancelado: ', (this.ngxSmartModalService.getModalData('cdFiltrosModal').estado !== 'cancelado'))

      if(this.ngxSmartModalService.getModalData('cdFiltrosModal').estado !== 'cancelado'){

        this.filtrosAnteriores = null;
        console.log('reiniciado filtros anteriores', this.filtrosAnteriores);
        console.log('filtros actuales: ', this.filtros);
        this.filtrosAnteriores = this.filtros;
        console.log('copiado filtros actuales a filtros anteriores', this.filtrosAnteriores);
        this.filtros = this.ngxSmartModalService.getModalData('cdFiltrosModal');
        //comprobar que sea un mapa
        if (!(this.filtros instanceof Map)){
          this.filtros = this.filtros.valores;
        }
        console.log('traidos filtros nuevos', this.filtros);
        console.log('comparacion', (this.filtrosAnteriores !== this.filtros));
        
        // if(nuevo != anterior)
        if(this.filtrosAnteriores !== this.filtros)
        {
          this.buscarDatos();
        }
        //todo quitar else
        else{ console.log('no se filtra porque no hubo cambios  ')}
      }
      //todo quitar else
      else { console.log( 'cancelado filtrado')};
    });

    //suscripción a estado de lista de selección
    //todo borrar, manejado por evento de click en la tabla
    /* console.log('suscribiendo al estado de la lista de selección')
    this.selection.changed.subscribe( lista => {
      console.log('se registró un cambio en la selección de items');
      this.inputParam.selection= this.selection.selected;

    });
    this.selection.changed.subscribe( () => {
      console.log('se registró un cambio en la selección de items 2');
      this.inputParam.selection= this.selection.selected;

    });
    this.selection.onChange.subscribe( () => {
      console.log('se registró un cambio en la selección de items 3');
      this.inputParam.selection= this.selection.selected;

    }); */


    console.log('suscripcion propia');
    // suscribir a los datos del modal
    /* datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      // valores: any;
      // columnSelection: any
    } */
    //
    this.ngxSmartModalService.getModal('consDinModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('consDinModal');
      console.log('configuracion del modal de consulta din(suscripcion): ', this.inputParam);
      
      if (this.inputParam.permiteMultiples ==null)
      {
        this.inputParam = {permiteMultiples: true, selection: []};
      }
      //establecer modo (múltiple o simple), inicializar con lo establecido al llamar
      this.selection = new SelectionModel(this.inputParam.permiteMultiples, this.inputParam.selection);
      if (this.nombreReporte == null){
        this.nombreReporte = this.inputParam.consulta;
        
        this.buscarReportes();
      }
    });
  }
  
  selectionChanged(){
    console.log('llamado al cambio nuevo de items seleccionados');
    console.log(this.selection.selected);
    this.inputParam.selection= this.selection.selected;
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
      this.buscarReportes();
    }
    else{
      this.openSnackBar('Ya se está mostrando la lista seleccionada.');
    }
  }

  abrirModal(nombreModal: string){
    console.clear();
    let datosModal : {
      modal: string;
      datos: any;
      valores: any;
      columnSelection: any
    }
    datosModal = {
      modal: nombreModal,
      datos: this.atributosAll,
      valores: this.filtros,
      columnSelection: null,
    }
    
    console.log('enviando datosModal: ', datosModal);
    if (nombreModal != 'cdTablaModal'){
      this.ngxSmartModalService.resetModalData('cdFiltrosModal');
      this.ngxSmartModalService.setModalData(datosModal, 'cdFiltrosModal');
      this.ngxSmartModalService.open('cdFiltrosModal');
    }
    else{
      datosModal.columnSelection = this.columnSelection;
      this.ngxSmartModalService.resetModalData(nombreModal);
      this.ngxSmartModalService.setModalData(datosModal, nombreModal);
      this.ngxSmartModalService.open(nombreModal);
    }
    console.log('nombre modal usado: '+ nombreModal + ' ')
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
        this._permisosService.getPermiso( 'usuario1', 
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
                
                this.reporteSeleccionado = this.reportesAll.findIndex(reporte => reporte.name === this.nombreReporte);
                if (this.reporteSeleccionado != -1)
                {
                  this.habilitarAcciones();
                  
                  this.buscarAtributos();
                }
                else{
                  this.openSnackBar('No existe la consulta "' + this.nombreReporte + '"');
                  this.loading = false;
                }
                
                // this.buscarAtributos();

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.reportesAll = null;
                this.openSnackBar('No se pudo realizar la consulta "' + this.nombreReporte + '"');
                this.loading = false;
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
                
                
                this.loading = false;
                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.atributosAll = null;
                console.log('Lista de atributos vacía');
                this.openSnackBar('No se encontraron los atributos correspondientes a la consulta "' + this.nombreReporte + '"');
                this.loading = false;

              }
            }
      });
  }

  buscarDatos(){
    //
    console.log('Buscando datos con:');
    console.log(this.reportesAll[this.reporteSeleccionado].name);
    
    console.log('filtros a aplicar: ', this.filtros);
    //
    this._consultaDinamicaService.getDatos(this.reportesAll[this.reporteSeleccionado].name, this.filtros, this.token) 
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
                
                // this.constDatos = new MatTableDataSource(this.datosAll);
                this.constDatos = new MatTableDataSource();
                
                this.constDatos.sort = this.sort;
                this.constDatos.paginator = this.paginator;
                
                // this.constDatos.disconnect();
                // this.paginator.getNumberOfPages();
                // this.constDatos.sort = this.sort;
                // this.constDatos.paginator = this.paginator;
                console.log('Lista mostrada vacía');
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

    if (this.columnSelection == null){
      this.columnSelection = new SelectionModel(true, []);
      console.log('generada lista de columnas seleccionadas');

      // if (this.columnasSeleccionadas == null){
        console.log('lista traida del reporte: ');
        console.log(this.reportesAll[this.reporteSeleccionado].columnas);
        //todo quitar if y descomentar cuando arreglen los datos
        let listaColumnas : string[] = (this.reportesAll[this.reporteSeleccionado].columnas.split(','));
        
        let itemActual: string;
        console.log(listaColumnas.length)
        for (let index = 0; index < listaColumnas.length; index++) {
          itemActual = listaColumnas[index].trim();
 
          columnasAMostrar = columnasAMostrar.concat(itemActual, ',');
        }
        columnasAMostrar = columnasAMostrar.substr(0, columnasAMostrar.length-1);
        console.log('Lista rearmada: ');
        console.log(columnasAMostrar);
      // }
      
      //agregar las columnas por defecto a la lista de selección
      this.columnSelection = new SelectionModel(true, this.atributosAll.filter(tipo => tipo.grupo == 'Filtros')); 
    
    }
    else{
      console.log(this.columnSelection.selected);
      this.columnSelection.selected.forEach(atributo => {
        columnasAMostrar = columnasAMostrar.concat(atributo.atributo_bd, ',');
      });
      // columnasAMostrar = this.columnSelection
      columnasAMostrar = columnasAMostrar.substr(0, columnasAMostrar.length-1);
      console.log('el usuario seleccionó las columnas: ');
      console.log(columnasAMostrar);
    }
    
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
    

    console.log('columnas por defecto: ');
    console.log(this.columnSelection);
    console.log('todos:');
    console.log(this.atributosAll);
    console.log('filtrado: ');
    console.log(this.atributosAll.filter(tipo => tipo.grupo == 'Filtros'));

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
  
}
