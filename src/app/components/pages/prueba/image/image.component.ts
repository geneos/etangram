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
     let formData:FormData = new FormData();
    formData.append('file', this.adjunto, this.adjunto.name);
    console.log(formData.getAll('file'));
   }

  cargar(attachment){
    this.adjunto = attachment.files[0];
  }

}
