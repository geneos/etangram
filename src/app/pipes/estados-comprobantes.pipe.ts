import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'estadosComprobantes'})
export class EstadosComprobantesPipe implements PipeTransform {
  transform(value: number): string {
    value = Number(value);
    switch (value) {
      case 0:
        return "PTE"
      case 1:
        return "OK"
    }
  }
}