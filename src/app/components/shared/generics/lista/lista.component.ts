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
  public opcionElegida: any;
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
  public options : any[];
  constructor( private  consultaDinService: ConsultaDinamicaService) { 

  }

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
    
    this.opcionElegida = this.options.find(option => option.key === this.datosInternos);
    console.log('opcion obtenida: ', this.opcionElegida)

    console.log('opcion seteada: ', this.datosInternos, this.data.datos.valor);

  }

  selected(value: any){
    console.log('seleccionado: '+value.key, value);
    // this.datosInternos = value;
    this.datosInternos = value.key;    
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());

    
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    
    console.log('ejecutado cambio(click|enter)', this.data);
    
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos);
  }

  // compareOptions(object1: any, object2: any) {
  /* compareOptions(object1: {key: string, value: string}, object2: {key: string, value: string}) {
    console.log('ejecutado comparador: ', object1, object2);
    return object1 && object2 && object1.key == object2.key;
  } */

}
