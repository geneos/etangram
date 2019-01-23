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

  @Input() nivel: number;

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
  columnasDisponibles: {id: number, name: string, title: string, order: number}[] = [];
  columns: any[];
  columnasSeleccionadas: string;
  columnasSelectas: any;
  constDatos = new MatTableDataSource();
  irADetalle: boolean;
  inputParam: any;
  
  columnSelection: any;
  filtros: any;
  filtrosAnteriores: any;
  // nivelConsulta: number;

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
    
    if (this.nivel == null){
      this.nivel = 1;
    }
    console.log('nivel de generación: ', this.nivel);

    this.route.params.subscribe( parametros=>{
      console.log('ruta actual: ',this.router.url)
      if (this.router.url.includes('/consulta/') == true)
      {
        //todo ver si cambiar por parametros para consulta n1
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
    let nombreModalActual: string;
    if (this.nivel == 1){
      nombreModalActual = 'consDinModal';
    }
    else{
      nombreModalActual = 'consDinModalN' + this.nivel.toString();
    }
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
      console.log('estado de las colecciones: ', this.datosAll, this.atributosAll, this.reportesAll)
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
    
    this.ngxSmartModalService.getModal(nombreModalActual).onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData(nombreModalActual);
      console.log('configuracion del modal de consulta din(suscripcion) n' + this.nivel +': ', this.inputParam);
      // this.openSnackBar('Preparando consulta n' + this.nivel +': ' + this.inputParam)
      if (this.inputParam.permiteMultiples ==null)
      {
        this.inputParam = {permiteMultiples: true, selection: []};
      }
      //establecer modo (múltiple o simple), inicializar con lo establecido al llamar
      this.selection = new SelectionModel(this.inputParam.permiteMultiples, this.inputParam.selection);
      console.log('reporte a usar: ', this.nombreReporte)
      if ((this.nombreReporte == null)||(this.nombreReporte != this.inputParam.consulta)){
        this.nombreReporte = this.inputParam.consulta;
        
      }
      this.buscarReportes();
    });
    
    
    
    
    /* if(this.nombreReporte == null){
      this.ngxSmartModalService.getModal('consDinModal').onOpen.subscribe(() => {
        this.inputParam = this.ngxSmartModalService.getModalData('consDinModal');
        console.log('configuracion del modal de consulta din(suscripcion): ', this.inputParam.consulta);
        
        if (this.inputParam.permiteMultiples ==null)
        {
          this.inputParam = {permiteMultiples: true, selection: []};
        }
        //establecer modo (múltiple o simple), inicializar con lo establecido al llamar
        this.selection = new SelectionModel(this.inputParam.permiteMultiples, this.inputParam.selection);
        if (this.nombreReporte == null){
          this.nombreReporte = this.inputParam.consulta;
          
        }
        this.buscarReportes();
      });

      
    }
    
    console.log('lista de modales antes de suscribir a cons din n2: ', this.ngxSmartModalService.getModalStack());
    
    this.ngxSmartModalService.getModal('consDinModalN2').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('consDinModalN2');
      console.log('configuracion del modal de consulta din(suscripcion) n2: ', this.inputParam);
      this.openSnackBar('Preparando consulta n2: ' + this.inputParam)
      if (this.inputParam.permiteMultiples ==null)
      {
        this.inputParam = {permiteMultiples: true, selection: []};
      }
      //establecer modo (múltiple o simple), inicializar con lo establecido al llamar
      this.selection = new SelectionModel(this.inputParam.permiteMultiples, this.inputParam.selection);
      console.log('reporte a usar: ', this.nombreReporte)
      if (this.nombreReporte == null){
        this.nombreReporte = this.inputParam.consulta;
        
      }
      this.buscarReportes();
    }); */
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

/*   menuClickHandler(nroReporte: number){
    if (this.reporteSeleccionado!==nroReporte){
      this.loading = true;
      this.reporteSeleccionado=nroReporte;
      this.buscarReportes();
    }
    else{
      this.openSnackBar('Ya se está mostrando la lista seleccionada.');
    }
  } */

  abrirModal(nombreModal: string){
    console.clear();
    let nombreModalCorregido: string;
    if (this.nivel != 1){
      nombreModalCorregido = nombreModal + 'N' + this.nivel.toString();
    }
    else{
      nombreModalCorregido = nombreModal;
    }

    let datosModal : {
      modal: string;
      datos: any;
      valores: any;
      columnSelection: any;
      nivel: number
    }
    datosModal = {
      modal: nombreModalCorregido,
      datos: this.atributosAll,
      valores: this.filtros,
      columnSelection: null,
      nivel: this.nivel//todo obtener
    }

    console.log('enviando datosModal: ', datosModal);
    // if (nombreModal != 'cdTablaModal'){
    if (!(nombreModalCorregido.includes('cdTablaModal'))){    
      // this.ngxSmartModalService.resetModalData('cdFiltrosModal');
      // this.ngxSmartModalService.setModalData(datosModal, 'cdFiltrosModal');
      // this.ngxSmartModalService.open('cdFiltrosModal');
      nombreModalCorregido = nombreModalCorregido.replace('Avanzado', 'Filtros');
      this.ngxSmartModalService.resetModalData(nombreModalCorregido);
      this.ngxSmartModalService.setModalData(datosModal, nombreModalCorregido);
      this.ngxSmartModalService.open(nombreModalCorregido);
    }
    else{
      datosModal.columnSelection = this.columnSelection;
      //todo agregar if en caso de que no haya datos
      // datosModal.valores = Object.keys(this.datosAll[0]);
      if(this.datosAll == null){
        this.openSnackBar('Error al obtener las columnas')
      }
      else{
        /*
        let columnas : [{id: number, name: string, title: string}] = [];
        let indice: number = 0;
        Object.keys(this.datosAll[0]).forEach(column => {
          let descripcion: string;
          let resultado = this.atributosAll.find(atributo => atributo.atributo_bd === column);

          if (resultado == null){
            descripcion = column;
          }
          else{
            descripcion = resultado.desc_atributo;
          }
          columnas.push({id: indice, name: column, title: descripcion});
          indice = indice + 1;
        });
        */
        // datosModal.valores = columnas;
        datosModal.valores = this.columnasDisponibles;
        this.ngxSmartModalService.resetModalData(nombreModalCorregido);
        this.ngxSmartModalService.setModalData(datosModal, nombreModalCorregido);
        this.ngxSmartModalService.open(nombreModalCorregido);
      }
    }
    console.log('nombre modal usado: '+ nombreModalCorregido + ' ')
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
                // this.establecerColumnas();
                this.buscarDatos();
                
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
    //todo ver por qué está vacío al momento de volver del modal siguiente
    console.log(this.reportesAll)
    console.log(this.reporteSeleccionado)
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
                
                this.constDatos = new MatTableDataSource(this.datosAll);
                
                this.constDatos.sort = this.sort;
                this.constDatos.paginator = this.paginator;

                this.establecerColumnas();
                this.loading = false;

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

  //de https://stackoverflow.com/a/4760279
  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }
/*
  dynamicSortMultiple(argumentos: any) {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     *
    var props = argumentos;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         *
        while(result === 0 && i < numberOfProperties) {
            console.log(props, i, obj1, obj2)
            // result = this.dynamicSort(props[i])(obj1, obj2);
            result = this.columnSelection.selected.sort(this.dynamicSort(props[i])(obj1, obj2));

            
            i++;
        }
        return result;
    }
  }
*/
  establecerColumnas(){
    //asignar las seleccionadas, como "['select', 'opciones', 'codigo', 'nombre']"
    this.displayedColumns = [];
    let columnasAMostrar: string;
    columnasAMostrar = '';

    if (this.columnSelection == null){

      //armar lista de columnas disponibles
      let indice: number = 0;
      Object.keys(this.datosAll[0]).forEach(column => {
        let descripcion: string;
        let orden: number;
        let resultado = this.atributosAll.find(atributo => atributo.atributo_bd === column);

        if (resultado == null){
          descripcion = column;
          orden = -1;
        }
        else{
          descripcion = resultado.desc_atributo;
          orden= resultado.orden;
        }
        this.columnasDisponibles.push({id: indice, name: column, title: descripcion, order: orden});
        indice = indice + 1;

      });

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
      // this.columnSelection = new SelectionModel(true, this.atributosAll.filter(tipo => tipo.grupo == 'Filtros')); 
      this.columnSelection = new SelectionModel(true, this.columnasDisponibles
        .filter(columnaDisponible =>
          columnasAMostrar.includes(columnaDisponible.name) == true
          ));
      console.log('column selection inicial armado: ', this.columnSelection);
    }
    else{
      console.log('Selección de columnas: ', this.columnSelection.selected);
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

    //extraer los que vienen con orden valido, y ordenarlos
    let listaColumnasOrdenada = this.columnSelection.selected.filter(column => column.order != -1)
                                .sort(this.dynamicSort('order'));
    console.log('orden parcial por order: ', listaColumnasOrdenada)
    //extraer los que vienen sin orden y ordenarlos por nombre
    let listaColumnasOrdenadaP2 = this.columnSelection.selected.filter(column => column.order == -1)
                                  .sort(this.dynamicSort('name'));
    console.log('orden parcial por name: ', listaColumnasOrdenadaP2)
    //agregar la segunda parte al final de los que venían ordenados
    listaColumnasOrdenada.push(listaColumnasOrdenadaP2);
    console.log('lista ordenada de columnas: ', listaColumnasOrdenada);

    this.columnSelection.selected.forEach(column => {
      this.columns.push({ columnDef: column.name, //columna, 
        header: column.title,    
        // header: atributoActual.desc_atributo,    
        cell: (item: any) => `${item[column.name]}` 
    }
    )});//item[columna] sirve para buscar el dato con el nombre de atributo

    //forma anterior al cambio
    /*
    listaColumnas.forEach(columna => {
      console.log('columna: ' + columna);
      let textoCabecera:string;
      //buscar y mostrar descripción de columna
      let atributoActual = this.atributosAll.find(atributo => atributo.atributo_bd === columna );
      if (atributoActual != null){
        //mostrar descripción
        textoCabecera = atributoActual.desc_atributo;
      }
      else{
        //mostrar nombre de columna
        textoCabecera = columna;
      }
      console.log(atributoActual);
      //todo revisar cuando corrijan las correspondencias entre apis
      if (atributoActual != null) {
      this.columns.push({ columnDef: columna, 
                          header: textoCabecera,    
                          // header: atributoActual.desc_atributo,    
                          cell: (item: any) => `${item[atributoActual.atributo_bd]}` 
      }
                        );}
      // this.columns.push({ columnDef: columna, header: columna,    cell: (item: any) => `${item[columna]}` });
    }); 
    
*/

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

    // this.buscarDatos();
    //
    console.log('lista de columnas: ');
    console.log(this.displayedColumns);
    //
    //
    let repo: Reporte;
    repo = this.reportesAll[this.reporteSeleccionado];
    console.log('estructura de Reporte: ');
    // console.log(Object.keys(repo));
    //obtener lista de atributos y tipos reales de la entidad
    // Object.keys(repo).forEach(att => console.log(att, typeof repo[att]));
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
