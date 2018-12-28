import { Component, OnInit, Input } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements CompGen {
  // @Input() data: any;
  private _data: string;

    @Input() set data(value: any) {

       this._data = value;
       if (this._data != null) {
         console.log(this._data);
        console.log('llamado a armado de liosta desp con setter');
        this.construirLista();
       }

    }

    get data(): any {

        return this._data;

    }
  options : any[];
  constructor() { 
    
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
  }
  /* 
  ngOnInit() {
  } */

}

