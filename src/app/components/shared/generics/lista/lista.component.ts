import { Component, OnInit, Input } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements CompGen {
  @Input() data: any;
  constructor() { }

  /* 
  ngOnInit() {
  } */

}
