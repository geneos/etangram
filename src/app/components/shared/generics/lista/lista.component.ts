import { Component, OnInit, Input } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements CompGen {
  // @Input() data: any;
  private _data: string;
  datosInternos: number;
  datosInternosMap: Map<string, string> ;

    @Input() set data(value: any) {

      this._data = value;
      console.log('datos recibidos por componente numerico: ', this._data);
      
      if (this._data != null) {
        console.log(this._data);
        console.log('llamado a armado de liosta desp con setter');
        this.construirLista();
      }

       
      this.datosInternosMap=  new Map<string, string>();

    }

    get data(): any {

        return this._data;

    }
  options : any[];
  constructor( private  consultaDinService: ConsultaDinamicaService) { 
    
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

  selected(value: number){
    console.log('seleccionado: '+value);
    this.datosInternos = value;

    
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos.toString());
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    console.log('ejecutado cambio(click|enter)', this.data);
    
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos);
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