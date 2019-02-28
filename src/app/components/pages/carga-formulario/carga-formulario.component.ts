import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Router, ActivatedRoute } from "@angular/router";
import { FormulariosService} from 'src/app/services/i2t/formularios.service';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ImageService } from "src/app/services/i2t/image.service";
import { ProveedorCabecera, RelacionComercial, Impuesto, Formulario, ArticuloProv } from 'src/app/interfaces/proveedor.interface';
import { FormGroup, FormControl } from '@angular/forms';

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

  fechaActual: Date = new Date();

  respData:any; //respuestas de servicio proveedores
  formulariosAll:any[];
  formulariosProvAll:Formulario[];
  id:any;
  forma: FormGroup;
  inputParam: any;
  fechaPresenta: string;
  fechaVencimiento: Date = new Date();

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

    this.forma = new FormGroup({
      'fechPresenta': new FormControl(),
      'fechVenci': new FormControl(),
      'url': new FormControl()
    })
    
  }

  ngOnInit() {
    this.fechaActual.setDate(this.fechaActual.getDate());
    
  }

  ngAfterViewInit(){
    this.ngxSmartModalService.getModal('formulariosModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('formulariosModal');
      console.log('datos recibidos por modal de formularios: ', this.inputParam);
      this.fechaPresenta = this.inputParam.fechaPresen;
      this.fechaVencimiento = this.inputParam.fechaVenci;
      // this.forma.controls['fechPresenta'].setValue(this.inputParam.fechaPresen);
      // this.forma.controls['fechVenci'].setValue(this.inputParam.fechaVenci);
      this.forma.controls['url'].setValue(this.inputParam.url)
     // let fechaVenci = this.fechaActual.getDate() + 60
   // console.log(fechaVenci)
   if(this.inputParam.formNombre = "1dfffdda-bb81-a81d-aa45-5c35080aafd5"){
  //   this.fechaVencimiento.setDate(this.fechaActual.getDate() + 12 )
   
   }
    });
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

  guardar(){

    console.clear();
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
       });
    
       this.fechaVencimiento.setMonth(this.fechaActual.getMonth() + 12);
       console.log(this.fechaVencimiento.toString())
    let jsbody = {
      "Id_Proveedor": this.inputParam.provId,
      "Id_FormularioCte"	:	this.inputParam.form,
      "p_form_fecha_pres"	:	this.fechaActual,
      "p_form_fecha_vto"	:	this.fechaVencimiento,
      "url": this.urlImagen
    }
    let jsonbody = JSON.stringify(jsbody)
    this._proveedoresService.updateFormulario(jsonbody, this.token )
      .subscribe( data => {
          this.respData = data;
          console.log('respuesta update formulario: ', this.respData);
          if(this.respData.returnset[0].RCode=="-6003"){
            console.log('error')
        //    this.forma.disable();
        //    this.openSnackBar('Token invalido modificando Formulario')
          } else {
            if (this.respData.returnset[0].RCode != 1){
        //      this.openSnackBar('Error al modificar Formulario: ' + this.respData.returnset[0].RTxt);
            }
            else{
              console.log('Formulario ID (update): ' + this.respData.returnset[0].RId);
            //  this.forma.controls['fechPresenta'].setValue(this.fechaActual)
            }
          }
      });
  }
}

