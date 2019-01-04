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
  inputParam: any;
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
  
}
