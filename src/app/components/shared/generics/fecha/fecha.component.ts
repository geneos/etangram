import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.component.html',
  styleUrls: ['./fecha.component.css']
})
export class FechaComponent implements CompGen, OnInit, AfterViewInit, OnChanges {

  @Input() data: any;
  // @Output() datosSalida:string;
  // @Output() datosSalida=  new EventEmitter<string>();

  @ViewChild('datosUsuario') datosUsuario: ElementRef;
  datosInternos: string = '';
  datosInternosMap: Map<string, string> ;
  forma: FormGroup;

  constructor(private  consultaDinService: ConsultaDinamicaService) {
    console.log('constructor de componente fecha recibió: ', this.data);
    this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap.set('','');
    // console.log('datos recibidos por componente de texto: ');
    // console.log(this.data);
    this.forma = new FormGroup({
      'fecha': new FormControl('')
    });
  }

  ngOnInit(){
    console.log('constructor de fecha ngoninit: ', this.data);
    // this.datosInternos = 'test seteo literal';
    if (this.data.datos.valor == null){
      this.datosInternos = this.data.datos.valores;
    }
    else{
      this.datosInternos = this.data.datos.valor;
    }

    // this.datosInternos = this.data.valor;
    let fecha = new Date(this.datosInternos);
    // fecha.setMinutes(fecha.getMinutes() + -180);
    fecha.setDate(fecha.getDate() + 1);
    this.forma.controls['fecha'].setValue(fecha);
  } 

  ngAfterViewInit() {
    // this.datosUsuario.nativeElement.value = 'test datos iniciales';
    console.log('constructor de texto afterviewinit: ', this.data);
    // this.datosInternos = 'test seteo literal';
  }

  updateDate(tipo: string, event: MatDatepickerInputEvent<Date>){
    
    console.log('ejecutando' + tipo + ' en datepicker', this.data, event.value);
    //convertir formato de fecha a string
    console.log(event.value.toDateString())
    console.log(event.value.toLocaleDateString());
    let fecha: string;
    fecha = event.value.getFullYear().toString() + '-' + 
            (event.value.getMonth()+1).toString().padStart(2, '0') + '-' + 
            event.value.getDate().toString().padStart(2,'0');
    console.log(fecha);
    // this.datosInternosMap.set(this.data.datos.columna,this.datosInternos);
    this.datosInternosMap.set(this.data.datos.columna,fecha);

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
}
