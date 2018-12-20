import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[AnclaParaComps]'
})
export class AnclaParaCompsDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
