import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { AnclaParaColumnasDirective } from 'src/app/directives/ancla-para-columnas.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { CompGenService } from 'src/app/services/i2t/comp-gen.service';


@Component({
  selector: 'app-cd-tabla',
  templateUrl: './cd-tabla.component.html',
  styleUrls: ['./cd-tabla.component.css']
})
export class CdTablaComponent implements AfterViewInit {
  inputParam:  {
    modal: string;
    datos: any;
    columnSelection: any
  }
  _inputParam: {
    modal: string;
    datos: any;
    columnSelection: any
  }
  modal: string;
  datos: any;
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
   this.ngxSmartModalService.getModal('cdTablaModal').onOpen.subscribe(() => {
     this.inputParam = this.ngxSmartModalService.getModalData('cdTablaModal');
    //  this._inputParam = angular.copy(this.inputParam);
    console.log('asignando a var privada')
    /* this._inputParam = {
      modal: '',
      datos: null,
      columnSelection : null
    }; */
    this._inputParam = {modal: '', datos: {}, columnSelection: []};
    // this._inputParam.modal = '';
    // this._inputParam.columnSelection = [];
    // this._inputParam.datos = {};

    //  Object.assign(this._inputParam, this.inputParam);
    // this._inputParam = Object.assign({}, this.inputParam);
    
    // this._inputParam = JSON.parse(JSON.stringify(this.inputParam));
    console.log('asignando: ',this.inputParam);
    this.modal = this.inputParam.modal;
    this.datos = [...this.inputParam.datos];
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
     
     console.log('Your param is:', this.inputParam);
     this.loading = false;
   });

 };

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
                   {datos: this.inputParam.datos, selection: this.inputParam.columnSelection});
                  // {datos: {datos: this.atributosAll, selection: this.columnasSelectas}});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefColumnas.createComponent(componentFactory);
      (<CompGen>componentRef.instance).data = control.data;

    console.log('probando leer la lista de selección de las columnas:');
    console.log((<CompGen>componentRef.instance).data);
 }
 
 aplicar(){
    console.log('aplicando seleccion de columnas');
    console.log('seleccionado al aplicar: ', this.inputParam.columnSelection);
    this.inputParam.modal = this.modal;
    this.inputParam.datos = [...this.datos];
    this.inputParam.columnSelection = [...this.columnSelection];

    
    this.ngxSmartModalService.setModalData(this.inputParam, 'cdTablaModal');
    console.log('datos en modal:' ,this.ngxSmartModalService.getModalData('cdTablaModal'));
    this.ngxSmartModalService.close('cdTablaModal');
 }

 cancelar(){
   /*
    //reiniciar valores
    console.log('cancelado')
    console.log('era ', this.inputParam)
    // this.inputParam = this._inputParam; 
    // Object.assign(this.inputParam, this._inputParam);
    // this.inputParam = Object.assign({}, this._inputParam);
    
    // this.inputParam = JSON.parse(JSON.stringify(this._inputParam));

    this.inputParam.modal = this.modal;
    this.inputParam.datos = [...this.datos];
    this.inputParam.columnSelection = [...this.columnSelection];
    /* this.inputParam.modal = JSON.parse(JSON.stringify(this.modal));
    this.inputParam.datos = JSON.parse(JSON.stringify(this.modal));
    this.inputParam.columnSelection = JSON.parse(JSON.stringify(this.modal)); *

    //restaurar lista recibida 
    // this.inputParam.columnSelection = new SelectionModel(true, this.listaRecibida);
    // this.columnSelection = new SelectionModel(true, this.listaRecibida);

    console.log('es ahora ', this.modal, this.datos, this.columnSelection)
    // console.log('es ahora: ', this.listaSeleccionada);
    // this.inputParam.columnSelection = this.listaSeleccionada;
    this.ngxSmartModalService.setModalData(this.inputParam, 'cdTablaModal');
    console.log('datos en modal:' ,this.ngxSmartModalService.getModalData('cdTablaModal'));
    this.ngxSmartModalService.close('cdTablaModal');

*/

  this.ngxSmartModalService.resetModalData('cdTablaModal');
  this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'cdTablaModal');
  this.ngxSmartModalService.close('cdTablaModal');
 }
  
}
