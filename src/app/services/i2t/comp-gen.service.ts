import { Injectable } from '@angular/core';
import { TextoComponent } from 'src/app/components/shared/generics/texto/texto.component';
import { ComponentWrapper } from 'src/app/classes/component-wrapper';

@Injectable({
  providedIn: 'root'
})
export class CompGenService {
  getComponent(componentType: string, title: string, placeholder: string){
    //todo: agregar seleccion de tipo de componente (componentType)
    return new ComponentWrapper(TextoComponent, {title, placeholder});
  }
}
