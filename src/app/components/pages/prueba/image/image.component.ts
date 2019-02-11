import { Component, OnInit } from '@angular/core';
import { ImageService } from "../../../../services/i2t/image.service";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  urlImagen:string = "url vacia aun";
  adjunto: any;

  constructor( private _imageService:ImageService ) { }

  ngOnInit() {
  }

  subirFoto(){
    console.clear();
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
       });
   }

  cargar(attachment){
    this.adjunto = attachment.files[0];
  }

}
