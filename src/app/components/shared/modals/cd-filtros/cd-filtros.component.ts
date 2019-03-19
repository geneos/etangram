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
  datosFiltrosAplicados: any;
  
  constructor(public ngxSmartModalService: NgxSmartModalService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private generadorDeComponentes: CompGenService,
              private consultaDinService: ConsultaDinamicaService) {
  }

  loading:boolean;
  selectedTab: number = 0;

  ngOnInit() {
    //suscribir a los datos ingresados en filtros
    this.consultaDinService.datosFiltrosAct.subscribe(datos => this.datosFiltros = datos);
  }

  ngAfterViewInit() {
     // here, please receive a param that was sent by the caller.
      this.ngxSmartModalService.getModal('cdFiltrosModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('cdFiltrosModal');
      console.log('datos recibidos por modal de filtros: ', this.inputParam);
      this.loading = true;
      this.generarFiltros();
      if(this.inputParam.modal == 'cdFiltrosModal'){
        this.selectedTab = 0;
      }
      // 'cdAvanzadoModal'
      else{
        this.selectedTab = 1;
      }
      console.log('parametros para filtros:', this.inputParam);
      this.loading = false;
    });

  };

  reset(){
    this.datosFiltros = null;
    this.inputParam.valores = null;
    this.generarFiltros();
  }

  // generarFiltros(porDefecto?: boolean){
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
    console.log('tipos');
    console.log(this.inputParam.datos);
    console.log('valores');
    console.log(this.inputParam.valores);
    let temp = this.inputParam.valores as Map<string, string>;
    let valorAEnviar : any = null;
    //
    let atributosFiltro = this.inputParam.datos.filter(atributoActual => atributoActual.grupo === 'Filtros');
    atributosFiltro.forEach(atributoActual => {
      // console.log((Map<string, string>)this.inputParam.valores.get(atributoActual.atributo_bd));
      // if ((temp != null)&&(porDefecto!=true)){
      if (temp != null){
        console.log('valor para llenar ' +  atributoActual.atributo_bd + ': '+ temp.get(atributoActual.atributo_bd));
        valorAEnviar = temp.get(atributoActual.atributo_bd);
      }
      else{
        console.log('no hay valores para llenar el filtro actual');
        valorAEnviar = null;
      }

      let control = this.generadorDeComponentes.getComponent(atributoActual.tipo_dato, //tipo de componente
                                                              atributoActual.desc_atributo, //titulo
                                                              'Esta es una prueba',//placeholder
                                                              {valores: atributoActual.valores, //valores por defecto/ para armar listas desplegables
                                                               columna: atributoActual.atributo_bd,//columna correspondiente para armado de consultas
                                                               valor:   valorAEnviar});//valor ingresado previamente por el usuario
                                                              //  valor:   'test(buscar en diccionario)'});

      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefFiltros.createComponent(componentFactory);
      this.componentesFiltros.push(componentRef.instance);
      (<CompGen>componentRef.instance).data = control.data;
      // (<CompGen>componentRef.instance).datosSalida;
      
      // console.log('compa agregaaaaaaaaaaaaaaado: ');
      // console.log(componentRef.instance.datosSalida.subscribe(event => console.log('registrado evento en comp agregado: ', event));
      // console.log(componentRef.instance);
      // console.log(componentRef.instance.datosSalida);
      // console.log('---');
      // componentRef.instance.datosSalida.subscribe(v => {
      //   console.log('omg callback');
      //   console.log(v);
      // });
      // componentRef.changeDetectorRef.detectChanges();
      // .subscribe(event => console.log('registrado evento en comp agregado: ', event));
      // console.log('probando ver los valores de los filtros: ');
      // console.log((<CompGen>componentRef.instance).data);
      
      // console.log('probando ver los valores de los filtros v2: ');
      // console.log(this.viewContainerRefFiltros);
      
      // console.log('probando ver los valores de los filtros v3: ');
      // console.log(componentRef.instance);
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
    console.log('valores');
    console.log(this.inputParam.valores);
    let temp2 = this.inputParam.valores as Map<string, string>;
    let valorAEnviar2 : any = null;
    //
    let atributosAvanzados = this.inputParam.datos.filter(atributoActual => atributoActual.grupo === 'Avanzado');
    atributosAvanzados.forEach(atributoActual => {
      
      if (temp2 != null){
        console.log('valor para llenar ' +  atributoActual.atributo_bd + ': '+ temp2.get(atributoActual.atributo_bd));
        valorAEnviar2 = temp2.get(atributoActual.atributo_bd);
      }
      else{
        console.log('no hay valores para llenar el filtro actual');
        valorAEnviar2 = null;
      }

      let valores;
      if(atributoActual.tipo_dato == 'Consulta'){
        valores = atributoActual.consulta;
      }
      else{
        valores = atributoActual.valores
      }

      let control = this.generadorDeComponentes.getComponent( atributoActual.tipo_dato, 
                                                              atributoActual.desc_atributo, //titulo
                                                              'Esta es una prueba',//placeholder
                                                              // {valores: atributoActual.valores, //valores por defecto/ para armar listas desplegables                                                              
                                                              {valores: valores, //valores por defecto/ para armar listas desplegables
                                                               columna: atributoActual.atributo_bd,//columna correspondiente para armado de consultas
                                                               valor:   valorAEnviar2});//valor ingresado previamente por el usuario
                                                              //  valor:   'test(buscar en diccionario)'});

      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
      let componentRef = this.viewContainerRefAvanzados.createComponent(componentFactory);
      this.componentesAvanzados.push(componentRef.instance);
      (<CompGen>componentRef.instance).data = control.data;
    });

    //todo borrar (prueba de calendario)
    /* let control = this.generadorDeComponentes.getComponent( 'Fecha',
                                                            'FechaTest', //titulo
                                                            'Esta es una prueba de fecha',//placeholder
                                                            {valores: '2018-02-01', //valores por defecto/ para armar listas desplegables
                                                            columna: 'fechainicio',//columna correspondiente para armado de consultas
                                                            valor:   '2019-01-16'});//valor ingresado previamente por el usuario
                                                            //  valor:   'test(buscar en diccionario)'});

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(control.component);
    let componentRef = this.viewContainerRefAvanzados.createComponent(componentFactory);
    this.componentesAvanzados.push(componentRef.instance);
    (<CompGen>componentRef.instance).data = control.data; */
    //todo borrar ^
  }

  aplicar(){
    
    // console.log(this.viewContainerRefFiltros.get(0))//todo
    // console.log(this.componentesFiltros);
    // this.viewContainerRefFiltros.get(0).detectChanges();
    // this.componentesFiltros.forEach(element => {
    //   console.log(<CompGen>element.instance);
    //   console.log(element.componentType);
    //   element.changeDetectorRef.detectChanges();
    // });
    console.log('Estado de los filtros a aplicar: ', this.datosFiltros);
    // console.log('---');    
    // console.log(this.componentesFiltros[0]);
    // console.log(this.componentesFiltros[0].instance);
    // console.log(this.componentesFiltros[0].instance.datosSalida);
    // console.log('---');
    // console.log(this.componentesAvanzados);
    // // console.log(componentRef.instance.datosSalida);
    
    //actualizar los datos del modal base
    // this.ngxSmartModalService.resetModalData('consDinModal');
    // this.ngxSmartModalService.setModalData(this.datosFiltros, 'consDinModal');
    
    console.log('cerrando modal de filtros con el servicio y enviando datos')
    this.ngxSmartModalService.resetModalData('cdFiltrosModal');
    this.ngxSmartModalService.setModalData(this.datosFiltros, 'cdFiltrosModal');
    //cerrar modal
    this.ngxSmartModalService.close('cdFiltrosModal');
  }

  volver(){
    console.log('cerrando modal de filtros con el servicio')
    this.ngxSmartModalService.resetModalData('cdFiltrosModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'cdFiltrosModal');
    this.ngxSmartModalService.close('cdFiltrosModal');
    // cdFiltrosModal.close()
  }

}
