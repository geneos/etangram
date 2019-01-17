import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements CompGen {
  // @Input() data: any;
  private _data: string;
  datosInternos: number;
  opcionElegida: any;
  datosInternosMap: Map<string, string> ;
  forma: FormGroup;
  @ViewChild('lista') lista;

    @Input() set data(value: any) {

      this._data = value;
      console.log('datos recibidos por componente lista: ', this._data);
      
      if (this._data != null) {
        console.log(this._data);
        console.log('llamado a armado de lista desp con setter');
        this.construirLista();
      }

       
      this.datosInternosMap=  new Map<string, string>();

    }

    get data(): any {

        return this._data;

    }
  options : any[];
  constructor( private  consultaDinService: ConsultaDinamicaService) { 
    this.forma = new FormGroup({
      'listaDin': new FormControl()
    });
  }
  //ngOnChanges no funcionó como esperado.
  /* 
  ngOnChanges(changes: SimpleChanges){
    console.log('cambio detectado en lista desplegable');
    this.construirLista();
  } */

  construirLista(){
    //formato: "0:Activo,1:Inactivo,2:Baja,9:Pendiente"
    let listaOpciones : string[] = (this.data.datos.valores.split(','));
    this.options= [];
    listaOpciones.forEach(opcion => {
      console.log(opcion);
      let p1 = opcion.substr(0, opcion.indexOf(':'));
      let p2 = opcion.substr(opcion.indexOf(':')+1);
      this.options.push({key: p1, value: p2});
    });
    console.log('Lista armada en control: ');
    console.log(this.options);
    console.log('opcion traida a componente lista: ', this.data.datos.valor);
    this.datosInternos = this.data.datos.valor;
    //
    // this.lista.select(this.data.datos.valor);
    // this.forma.controls['listaDin'].setValue(this.data.datos.valor);
    this.opcionElegida = this.options.find(option => option.key === this.datosInternos);
    this.forma = new FormGroup({
      // 'listaDin': new FormControl([this.datosInternos])
      'listaDin': new FormControl([this.options.find(option => option.key === this.datosInternos)])

    });
    //
    console.log('opcion obtenida: ', this.options.find(option => option.key === this.datosInternos))
    this.forma.controls['listaDin'].setValue(this.options.find(option => option.key === this.datosInternos));


    console.log('opcion seteada: ', this.datosInternos, this.data.datos.valor);

  }
  /* 
  ngOnInit() {
  } */

  // selected(value: number){
  selected(value: any){
    console.log('seleccionado: '+value.key, value);
    this.datosInternos = value;

    
    // this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());
    // this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());
    // this.datosInternosMap.set(this.data.datos.columna,this.forma.controls['listaDin'].value.toString());
    this.datosInternosMap.set(this.data.datos.columna,value);

    // this.consultaDinService.actualizarDatos(this.datosInternos);
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    console.log('ejecutado cambio(click|enter)', this.data);
    
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos);
  }

  // compareOptions(object1: any, object2: any) {
  compareOptions(object1: {key: string, value: string}, object2: {key: string, value: string}) {
    console.log('ejecutado comparador: ', object1, object2);
    return object1 && object2 && object1.key == object2.key;
  }

}


/* 
    console.log(this.datosUsuario);
    console.log(this.datosUsuario.nativeElement.value);
    this.datosInternos = this.datosUsuario.nativeElement.value;
    console.log('ejecutando cambio(keyup) numero', this.data);
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos); */