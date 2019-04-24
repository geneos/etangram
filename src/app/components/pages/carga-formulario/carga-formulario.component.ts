import { Component, OnInit, Injectable, Inject, ViewChild } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Router, ActivatedRoute } from "@angular/router";
import { FormulariosService} from 'src/app/services/i2t/formularios.service';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ImageService } from "src/app/services/i2t/image.service";
import { ProveedorCabecera, RelacionComercial, Impuesto, Formulario, ArticuloProv } from 'src/app/interfaces/proveedor.interface';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { ImpresionCompService } from "src/app/services/i2t/impresion-comp.service";

const TOKEN = '';
@Injectable()

@Component({
  selector: 'app-carga-formulario',
  templateUrl: './carga-formulario.component.html',
  styleUrls: ['./carga-formulario.component.css']
})
export class CargaFormularioComponent implements OnInit {

  @ViewChild('attachment') file: any;
  urlImagen:string = "";
  adjunto: any;
  token: string = "a";
  datos: any;

  fechaActual: Date = new Date();
  fechaVenci: Date = new Date();

  respData:any; //respuestas de servicio proveedores
  formulariosAll:any[];
  formulariosProvAll:Formulario[];
  formTipo: any;
  formData: formDatos[] = [];
  id:any;
  forma: FormGroup;
  inputParam: any;
  fechaPresenta: string;
  fechaVencimiento: Date = new Date();
  urlAnterior: string;
  

  constructor(private route:ActivatedRoute,
              private _imageService:ImageService,
              public ngxSmartModalService: NgxSmartModalService,
              private _formulariosService: FormulariosService,
              private _proveedoresService: ProveedoresService,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              public snackBar: MatSnackBar,
              private _impresionCompService: ImpresionCompService) {
    
                this.token = localStorage.getItem('TOKEN')
   // this.token = this.storage.get(TOKEN);

    this.route.params.subscribe( parametros=>{
    this.id = parametros['id'];
    })

    this.forma = new FormGroup({
      'fechPresenta': new FormControl(),
      'fechVenci': new FormControl(),
      'url': new FormControl(),
    })
    
  }

  ngOnInit() {
    this.fechaActual.setDate(this.fechaActual.getDate());
  //  console.log(this.fechaActual)
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
      this.urlAnterior = this.inputParam.url;
      this.file.nativeElement.value = "";
      this.buscaForm()
      
    });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  cargar(attachment){
    this.adjunto = attachment.files[0];
    console.clear();
    if(this.adjunto.type !== "image/png"){
      if(this.adjunto.type !== "image/jpg"){
        if(this.adjunto.type !== "application/pdf"){
          this.openSnackBar('El archivo debe ser .jpg, .png o .pdf')
        }
      }
    }
    if(this.adjunto.size > 1000000){
      this.openSnackBar('El tamaño de la imagen no puede superar 1 Mb')
    }
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
         console.log(this.urlImagen.slice(24))
         this._impresionCompService.getBaseDatos( this.token )
         .subscribe ( dataP => {
           console.log(dataP)
          this.datos = dataP
          this.urlImagen = this.datos.dataset[0].imagenes+this.urlImagen;
          console.log(this.urlImagen)
        })
       });
  }

  guardar(){
  if(this.urlImagen === ""){
    this.openSnackBar('No se selecionó ninguna imagen')
  } else {
    if(this.formData[0].periodicidad === "M"){
      this.fechaVenci.setMonth(this.fechaVenci.getMonth() + this.formData[0].periodo)
      console.log(this.fechaVenci.toString())
      this.fechaVencimiento = this.fechaVenci; 
    } else if(this.formData[0].periodicidad === "A"){
      this.fechaVenci.setFullYear(this.fechaVenci.getFullYear() + this.formData[0].periodo)
      console.log(this.fechaVenci.toString())
      this.fechaVencimiento = this.fechaVenci; 
    } else if(this.formData[0].periodicidad === "D"){
      this.fechaVenci.setDate(this.fechaVenci.getDate() + this.formData[0].periodo)
      console.log(this.fechaVenci.toString())
      this.fechaVencimiento = this.fechaVenci; 
    }
    
    let jsbody = {
      "Id_Proveedor": this.inputParam.provId,
      "Id_FormularioCte"	:	this.inputParam.form,
      "p_form_fecha_pres"	:	this.fechaActual,
      "p_form_fecha_vto"	:	this.fechaVencimiento,
      "url": this.urlImagen,
      "form_descripcion": this.inputParam.descripcion
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
      this.ngxSmartModalService.resetModalData('formulariosModal');
      this.ngxSmartModalService.setModalData({estado: 'guardado'}, 'formulariosModal');
      this.ngxSmartModalService.close('formulariosModal');
    }

      
  }
  cancelar(){
    this.ngxSmartModalService.resetModalData('formulariosModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'formulariosModal');
    this.ngxSmartModalService.close('formulariosModal');
  }
  buscaForm(){
    this._formulariosService.getFormulario(this.inputParam.formNombre, this.token)
      .subscribe(dataF => {
        console.log(dataF)
        this.formTipo = dataF;
        this.formData = this.formTipo.dataset

      })
  }
}
export interface formDatos{
  "id": string,
  "name": string,
  "deleted": number,
  "codigo": number,
  "fechavigencia": string,
  "periodicidad": string,
  "periodo": number
}