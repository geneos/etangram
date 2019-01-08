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
  datosInternos: string = '';

  constructor(private  consultaDinService: ConsultaDinamicaService) {
    console.log('datos recibidos por componente numerico: ');
    console.log(this.data);
   }

  ngAfterViewInit() {
    this.datosUsuario.nativeElement.value = '999';
  }

  cambio(){
    
    this.consultaDinService.actualizarDatos(this.datosInternos);
    console.log('ejecutado cambio(keyup)', this.data);
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