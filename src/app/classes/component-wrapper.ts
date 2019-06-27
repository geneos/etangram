import { Type } from '@angular/core';

export class ComponentWrapper {
  constructor(public component: Type<any>, public data: any) {}
}