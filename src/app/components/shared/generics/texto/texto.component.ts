import { Component, OnInit, Input } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';

@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})
export class TextoComponent implements CompGen {
  @Input() data: any;
  constructor() {
    console.log('datos recibidos por componente de texto: ');
    console.log(this.data);
   }

  /* 
  ngOnInit() {
  } */

}

