import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';

@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})
export class TextoComponent implements CompGen, OnInit, AfterViewInit, OnChanges {
  @Input() data: any;
  // @Output() datosSalida:string;
  // @Output() datosSalida=  new EventEmitter<string>();

  @ViewChild('datosUsuario') datosUsuario: ElementRef;
  datosInternos: string = '';
  datosInternosMap: Map<string, string> ;

  constructor(private  consultaDinService: ConsultaDinamicaService) {
    console.log('constructor de texto recibió: ', this.data);
    this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap.set('','');
    // console.log('datos recibidos por componente de texto: ');
    // console.log(this.data);
  }
  
  ngOnInit(){
    console.log('constructor de texto ngoninit: ', this.data);
    // this.datosInternos = 'test seteo literal';
    this.datosInternos = this.data.datos.valor;
    // this.datosInternos = this.data.valor;
  } 

  ngAfterViewInit() {
    // this.datosUsuario.nativeElement.value = 'test datos iniciales';
    console.log('constructor de texto afterviewinit: ', this.data);
    // this.datosInternos = 'test seteo literal';
  }

  cambio(){
    
    console.log('ejecutando cambio(keyup) texto', this.data);
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos);
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos);
  }

  ngOnChanges(){
    // this.datosSalida.emit(this.datosUsuario.nativeElement.value);
    this.consultaDinService.actualizarDatos(this.data);
    console.log('ejecutado cambios');
  }
  /* 
  ngOnInit() {
  } */

}

