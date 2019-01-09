import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { EventEmitter } from '@angular/core';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';

@Component({
  selector: 'app-numero',
  templateUrl: './numero.component.html',
  styleUrls: ['./numero.component.css']
})
export class NumeroComponent implements CompGen, AfterViewInit, OnChanges {
  @Input() data: any;
  // @Output() datosSalida:string;
  // @Output() datosSalida=  new EventEmitter<string>();

  @ViewChild('datosUsuario') datosUsuario: ElementRef;
  datosInternos: number = null;
  // datosInternos: string = '';
  datosInternosMap: Map<string, string> ;

  constructor(private  consultaDinService: ConsultaDinamicaService) {
    console.log('datos recibidos por componente numerico: ', this.data);
    this.datosInternosMap=  new Map<string, string>();
   }

  ngAfterViewInit() {
    this.datosUsuario.nativeElement.value = '999';
    console.log('constructor de numero afterviewinit: ', this.data);
  }

  cambio(){
    console.log(this.datosUsuario);
    console.log(this.datosUsuario.nativeElement.value);
    this.datosInternos = this.datosUsuario.nativeElement.value;
    console.log('ejecutando cambio(keyup) numero', this.data);
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());
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