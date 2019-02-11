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
    this.newAttachment(this.adjunto);
  }

  cargar(attachment){
    this.adjunto = attachment.files[0];
  }

  newAttachment(attachment) {
    let formData:FormData = new FormData();
    formData.append('file', this.adjunto, this.adjunto.name);
    console.log(formData);
  
    
   // return this.http.post(this.endpoint + '/cards/' + idCard + '/attachments?' + this.credentials, formData);
}

}
