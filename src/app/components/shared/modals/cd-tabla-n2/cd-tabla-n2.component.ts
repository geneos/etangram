import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { AnclaParaColumnasDirective } from 'src/app/directives/ancla-para-columnas.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { CompGenService } from 'src/app/services/i2t/comp-gen.service';


@Component({
  selector: 'app-cd-tabla-n2',
  templateUrl: './cd-tabla-n2.component.html',
  styleUrls: ['./cd-tabla-n2.component.css']
})
export class CdTablaN2Component implements AfterViewInit {
  inputParam:  {
    modal: string;
    datos: any;
    valores: any;
    defaults: any;
    columnSelection: any
  }
  _inputParam: {
    modal: string;
    datos: any;
    valores: any;
    defaults: any;
    columnSelection: any
  }
  modal: string;
  datos: any;
  valores: any;
  columnSelection : any;
  
  listaSeleccionada: any;
  listaRecibida: any;

  @Input() componentes: ComponentWrapper[];
  viewContainerRefColumnas: ViewContainerRef; 
  @ViewChild(AnclaParaColumnasDirective) contenedorColumnas: AnclaParaColumnasDirective;
  constructor(public ngxSmartModalService: NgxSmartModalService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private generadorDeComponentes: CompGenService) {
  }

  loading:boolean;

  ngAfterViewInit() {
    // here, please receive a param that was sent by the caller.
   this.ngxSmartModalService.getModal('cdTablaModalN2').onOpen.subscribe(() => {
     this.inputParam = this.ngxSmartModalService.getModalData('cdTablaModalN2');
    //  this._inputParam = angular.copy(this.inputParam);
    console.log('asignando a var privada')
    /* this._inputParam = {
      modal: '',
      datos: null,
      columnSelection : null
    }; */
    this._inputParam = {modal: '', datos: {}, valores: {}, defaults: {}, columnSelection: []};
    // this._inputParam.modal = '';
    // this._inputParam.columnSelection = [];
    // this._inputParam.datos = {};

    //  Object.assign(this._inputParam, this.inputParam);
    // this._inputParam = Object.assign({}, this.inputParam);
    
    // this._inputParam = JSON.parse(JSON.stringify(this.inputParam));
    // console.log('asignando: ',this.inputParam);
    this.modal = this.inputParam.modal;
    this.datos = [...this.inputParam.datos];
    this.valores = [...this.inputParam.valores]
    this.columnSelection = [this.inputParam.columnSelection];
    /* this.modal = JSON.parse(JSON.stringify(this.inputParam.modal));
    this.datos = JSON.parse(JSON.stringify(this.inputParam.datos));
    this.columnSelection = JSON.parse(JSON.stringify(this.inputParam.columnSelection)); */

    //lista recibida backup
    // this.listaRecibida = new SelectionModel(true, this.inputParam.columnSelection);

     this.listaSeleccionada = this.inputParam.columnSelection;
    //  Object.freeze(this._inputParam);

     this.loading = true;
     this.generarTabla();
     
    //  this.loading = false;
   });

  };

  limpiarLista(listaSucia: string){
    let ListaLimpia: string = '';
    let listaColumnas : string[] = (listaSucia.split(','));

    let itemActual: string;
    // console.log('Cantidad de columnas: ' + listaColumnas.length)
    for (let index = 0; index < listaColumnas.length; index++) {
      itemActual = listaColumnas[index].trim();

      ListaLimpia = ListaLimpia.concat(itemActual, ',');
    }
    ListaLimpia = ListaLimpia.substr(0, ListaLimpia.length-1);
    // console.log('Lista rearmada: ');
    // console.log(ListaLimpia);
    return ListaLimpia;
  }

  reset(){
    this.loading = true;
    // this.inputParam.valores = this.inputParam.defaults;
    console.log('seleccionados antes de reseteo: ', this.inputParam.columnSelection)
    let listaLimpia = this.limpiarLista(this.inputParam.defaults);
    console.log('lista a armar (string): ', listaLimpia)
    this.inputParam.columnSelection = new SelectionModel(true, this.valores
      .filter(columnaDisponible =>
        listaLimpia.includes(columnaDisponible.name) == true
        ));
    this.columnSelection = null;
    this.columnSelection = [this.inputParam.columnSelection];
    console.log('seleccionados después de reseteo: ', this.inputParam.columnSelection)
    this.generarTabla();
  }

  generarTabla(){
   //Crear tabla con checkboxes de columnas
    // this.columnasSelectas = new SelectionModel(true, []);
    
    if (this.viewContainerRefColumnas == null){
      this.viewContainerRefColumnas = this.contenedorColumnas.viewContainerRef;
      console.log('guardada referencia de columnas');
    }
    this.viewContainerRefColumnas.clear();

    let control = this.generadorDeComponentes.getComponent('Tabla', 
                  'Datos de la tabla', 
                  'Seleccione columnas a visualizar',                                                             
                   {datos: this.inputParam.datos, valores: this.inputParam.valores, selection: this.inputParam.columnSelection});
                  // {datos: {datos: this.atributosAll, selection: this.columnasSelectas}});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefColumnas.createComponent(componentFactory);
      (<CompGen>componentRef.instance).data = control.data;

    // console.log('probando leer la lista de selección de las columnas:');
    // console.log((<CompGen>componentRef.instance).data);
    
    this.loading = false;
  }
 
  aplicar(){
    console.log('aplicando seleccion de columnas');
    console.log('seleccionado al aplicar: ', this.inputParam.columnSelection);
    console.log('this.inputParam.columnSelection: ', this.inputParam.columnSelection)
    console.log('this.columnSelection: ', this.columnSelection)
    this.inputParam.modal = this.modal;
    this.inputParam.datos = [...this.datos];
    this.inputParam.columnSelection = [...this.columnSelection];

    setTimeout(() => {
      this.ngxSmartModalService.setModalData(this.inputParam, 'cdTablaModalN2');
      console.log('datos en modal:' ,this.ngxSmartModalService.getModalData('cdTablaModalN2'));
      this.ngxSmartModalService.close('cdTablaModalN2');
    });
 }

 cancelar(){
  this.ngxSmartModalService.resetModalData('cdTablaModalN2');
  this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'cdTablaModalN2');
  this.ngxSmartModalService.close('cdTablaModalN2');
 }
  
}
