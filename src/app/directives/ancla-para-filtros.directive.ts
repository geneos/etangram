import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[AnclaParaFiltros]'
})
export class AnclaParaFiltrosDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
