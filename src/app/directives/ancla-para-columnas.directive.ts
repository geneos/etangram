import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[AnclaParaColumnas]'
})
export class AnclaParaColumnasDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
