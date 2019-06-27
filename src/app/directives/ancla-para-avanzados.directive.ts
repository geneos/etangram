import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[AnclaParaAvanzados]'
})
export class AnclaParaAvanzadosDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
