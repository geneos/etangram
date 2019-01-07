import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})
export class TextoComponent implements CompGen, AfterViewInit {
  @Input() data: any;
  // @Output() datosSalida:string;
  @Output() datosSalida=  new EventEmitter<string>();
  @ViewChild('datosUsuario') datosUsuario: ElementRef;

  constructor() {
    console.log('datos recibidos por componente de texto: ');
    console.log(this.data);
   }

  ngAfterViewInit() {
    this.datosUsuario.nativeElement.value = 'test datos iniciales';
  }
  /* 
  ngOnInit() {
  } */

}

