import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-imputar-comprobantes',
  templateUrl: './imputar-comprobantes.component.html',
  styleUrls: ['./imputar-comprobantes.component.css']
})
export class ImputarComprobantesComponent implements OnInit {

  loading: boolean = false;
  forma: FormGroup;
  constructor() { 
    this.forma = new FormGroup({
      'tipo': new FormControl(),
      'fecDesde': new FormControl(),
      'fecHasta': new FormControl(),
      'categoria': new FormControl(),
      'nombre': new FormControl()

    })
  }

  ngOnInit() {
  }

}
