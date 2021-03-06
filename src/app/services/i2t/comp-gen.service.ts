import { Injectable } from '@angular/core';
import { TextoComponent } from 'src/app/components/shared/generics/texto/texto.component';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';
import { ListaComponent } from 'src/app/components/shared/generics/lista/lista.component';
import { ConsultaComponent } from 'src/app/components/shared/generics/consulta/consulta.component';
import { TablaComponent } from 'src/app/components/shared/generics/tabla/tabla.component';
import { NumeroComponent } from 'src/app/components/shared/generics/numero/numero.component';
import { FechaComponent } from 'src/app/components/shared/generics/fecha/fecha.component';

@Injectable({
  providedIn: 'root'
})
export class CompGenService {
  getComponent(componentType: string, title: string, placeholder: string, datos: any){
    let nuevoComponent : any;
    //todo: quitar hardcodeo de placeholder
    let place: string;
    console.log('datos en generador: ', datos)
    switch (componentType) {
      case 'Entero':
          // todo agregar tipo numero
          nuevoComponent = NumeroComponent;
          place = 'Ingrese un número entero';
        break;
      case 'Texto':
        nuevoComponent = TextoComponent;
        place = 'Ingrese texto';
        break;
      case 'Lista':
        nuevoComponent = ListaComponent;
        place = 'Seleccione una opción';
        break;
      case 'Consulta':
        nuevoComponent = ConsultaComponent;
        place = 'Ingrese una consulta';
        break;
      case 'Tabla':
        nuevoComponent = TablaComponent;
        place = 'Selecciones Columnas';
        break;
      case 'Fecha':
        nuevoComponent = FechaComponent;
        place = 'Ingrese o seleccione una fecha';
        break;
      default:
        nuevoComponent = TextoComponent;
        break;
    }
    placeholder = place;
    //todo usar placeholder correcto
    // return new ComponentWrapper(nuevoComponent, {title, placeholder});
    return new ComponentWrapper(nuevoComponent, {title, placeholder, datos});
  }
}
