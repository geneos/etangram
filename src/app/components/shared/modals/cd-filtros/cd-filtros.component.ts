import { Component, OnInit, AfterViewInit, ViewContainerRef, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { AnclaParaFiltrosDirective } from 'src/app/directives/ancla-para-filtros.directive';
import { AnclaParaAvanzadosDirective } from 'src/app/directives/ancla-para-avanzados.directive';
import { CompGenService } from 'src/app/services/i2t/comp-gen.service';
import { ComponentRef } from '@angular/core/src/render3';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';

@Component({
  selector: 'app-cd-filtros',
  templateUrl: './cd-filtros.component.html',
  styleUrls: ['./cd-filtros.component.css']
})
export class CdFiltrosComponent implements AfterViewInit, OnInit {
  inputParam: any;
  viewContainerRefFiltros: ViewContainerRef;
  viewContainerRefAvanzados: ViewContainerRef;
  componentesFiltros: ComponentRef<any>[];
  componentesAvanzados: ComponentRef<any>[];
  @Input() componentes: ComponentWrapper[];
  @ViewChild(AnclaParaFiltrosDirective) contenedorFiltros: AnclaParaFiltrosDirective;
  @ViewChild(AnclaParaAvanzadosDirective) contenedorAvanzados: AnclaParaAvanzadosDirective;

  datosFiltros: any;
  
  constructor(public ngxSmartModalService: NgxSmartModalService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private generadorDeComponentes: CompGenService,
              private consultaDinService: ConsultaDinamicaService) {
  }

  loading:boolean;
  selectedTab: number = 0;

  ngOnInit() {
    this.consultaDinService.datosFiltrosAct.subscribe(datos => this.datosFiltros = datos);
  }

  ngAfterViewInit() {
     // here, please receive a param that was sent by the caller.
    this.ngxSmartModalService.getModal('cdFiltrosModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('cdFiltrosModal');
      
      this.loading = true;
      this.generarFiltros();
      if(this.inputParam.modal == 'cdFiltrosModal'){
        this.selectedTab = 0;
      }
      // 'cdAvanzadoModal'
      else{
        this.selectedTab = 1;
      }
      console.log('Your param is:', this.inputParam);
      console.log('la pagina elegida es: ' + this.selectedTab);
      console.log('la pagina elegida es: ' + this.inputParam.modal);
      this.loading = false;
    });

  };

  generarFiltros(){
    //Crear filtros
    if (this.viewContainerRefFiltros == null){
      console.log(this.viewContainerRefFiltros);
      console.log(this.contenedorFiltros);
      // console.log(this.contenedorFiltros.viewContainerRef);
      // console.log(this.contenedorFiltros.first)
      this.viewContainerRefFiltros = this.contenedorFiltros.viewContainerRef;
      // this.viewContainerRefFiltros = this.contenedorFiltros.first;
      console.log('guardada referencia de filtros');
    }
    this.viewContainerRefFiltros.clear();
    this.componentesFiltros = [];
    
    //recorrer lista de atributos para filtros
    console.log('generando controles de filtrado para la lista: ');
    console.log(this.inputParam.datos);
    //
    let atributosFiltro = this.inputParam.datos.filter(atributoActual => atributoActual.grupo === 'Filtros');
    atributosFiltro.forEach(atributoActual => {
      
      let control = this.generadorDeComponentes.getComponent(atributoActual.tipo_dato, 
                                                              atributoActual.desc_atributo, 
                                                              'Esta es una prueba',
                                                              {valores: atributoActual.valores, 
                                                               columna: atributoActual.atributo_bd});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefFiltros.createComponent(componentFactory);
      this.componentesFiltros.push(componentRef.instance);
      (<CompGen>componentRef.instance).data = control.data;
      // (<CompGen>componentRef.instance).datosSalida;
      
      console.log('compa agregaaaaaaaaaaaaaaado: ');
      // console.log(componentRef.instance.datosSalida.subscribe(event => console.log('registrado evento en comp agregado: ', event));
      console.log(componentRef.instance);
      // console.log(componentRef.instance.datosSalida);
      console.log('---');
      // componentRef.instance.datosSalida.subscribe(v => {
      //   console.log('omg callback');
      //   console.log(v);
      // });
      componentRef.changeDetectorRef.detectChanges();
      // .subscribe(event => console.log('registrado evento en comp agregado: ', event));
      console.log('probando ver los valores de los filtros: ');
      console.log((<CompGen>componentRef.instance).data);
      
      console.log('probando ver los valores de los filtros v2: ');
      console.log(this.viewContainerRefFiltros);
      
      console.log('probando ver los valores de los filtros v3: ');
      console.log(componentRef.instance);
    });
    
    //Crear Avanzados
    if (this.viewContainerRefAvanzados == null){
      this.viewContainerRefAvanzados = this.contenedorAvanzados.viewContainerRef;
      console.log('guardada referencia de avanzadas');
    }
    this.viewContainerRefAvanzados.clear();
    this.componentesAvanzados = [];
    
    //recorrer lista de atributos para filtros
    console.log('generando controles avanzados para la lista: ');
    console.log(this.inputParam.datos);
    //
    let atributosAvanzados = this.inputParam.datos.filter(atributoActual => atributoActual.grupo === 'Avanzado');
    atributosAvanzados.forEach(atributoActual => {
      
      let control = this.generadorDeComponentes.getComponent(atributoActual.tipo_dato, 
                                                              atributoActual.desc_atributo, 
                                                              'Esta es una prueba',
                                                              {valores: atributoActual.valores, 
                                                               columna: atributoActual.atributo_bd});
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefAvanzados.createComponent(componentFactory);
      this.componentesAvanzados.push(componentRef.instance);
      (<CompGen>componentRef.instance).data = control.data;
    });

  }

  aplicar(){
    
    // console.log(this.viewContainerRefFiltros.get(0))//todo
    // console.log(this.componentesFiltros);
    this.viewContainerRefFiltros.get(0).detectChanges();
    // this.componentesFiltros.forEach(element => {
    //   console.log(<CompGen>element.instance);
    //   console.log(element.componentType);
    //   element.changeDetectorRef.detectChanges();
    // });
    console.log(this.datosFiltros);
    // console.log('---');    
    // console.log(this.componentesFiltros[0]);
    // console.log(this.componentesFiltros[0].instance);
    // console.log(this.componentesFiltros[0].instance.datosSalida);
    // console.log('---');
    // console.log(this.componentesAvanzados);
    // // console.log(componentRef.instance.datosSalida);
  }

}
