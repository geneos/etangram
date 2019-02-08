import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  urlImagen:string = "url vacia aun";
  adjunto: any;

  constructor() { }

  ngOnInit() {
  }

  subirFoto(){
    console.clear();
    this.urlImagen = "url sigue vacia"
  }

  cargar(attachment){
    this.adjunto = attachment.files[0];
  }

}
