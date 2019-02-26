import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Router, ActivatedRoute } from "@angular/router";
import { FormulariosService} from 'src/app/services/i2t/formularios.service';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ImageService } from "src/app/services/i2t/image.service";
import { ProveedorCabecera, RelacionComercial, Impuesto, Formulario, ArticuloProv } from 'src/app/interfaces/proveedor.interface';

const TOKEN = '';
@Injectable()
@Component({
  selector: 'app-carga-formulario',
  templateUrl: './carga-formulario.component.html',
  styleUrls: ['./carga-formulario.component.css']
})
export class CargaFormularioComponent implements OnInit {

  urlImagen:string = "url vacia aun";
  adjunto: any;
  token: string = "a";

  respData:any; //respuestas de servicio proveedores
  formulariosAll:any[];
  formulariosProvAll:Formulario[];
  id:any;

  constructor(private route:ActivatedRoute,
              private _imageService:ImageService,
              public ngxSmartModalService: NgxSmartModalService,
              private _formulariosService: FormulariosService,
              private _proveedoresService: ProveedoresService,
              @Inject(SESSION_STORAGE) private storage: StorageService) {
  
    this.token = this.storage.get(TOKEN);

    this.route.params.subscribe( parametros=>{
    this.id = parametros['id'];

    })

    
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

