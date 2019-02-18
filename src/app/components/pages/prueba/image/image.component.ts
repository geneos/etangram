import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { ImageService } from "../../../../services/i2t/image.service";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnInit {

  urlImagen:string = "url vacia aun";
  adjunto: any;
  token: string = "a";

  constructor( private _imageService:ImageService, @Inject(SESSION_STORAGE) private storage: StorageService ) {
    console.log(this.storage.get(TOKEN) || 'Local storage is empty');
    this.token = this.storage.get(TOKEN);
  }

  ngOnInit() {
  }

  subirFoto(){
    console.clear();
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
       });
   }

  cargar(attachment){
    this.adjunto = attachment.files[0];
  }

}
