import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EvidenciasService } from "src/app/services/i2t/evidencias.service"
import { MatTable, MatHint, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from "@angular/router";
import { ImageService } from "src/app/services/i2t/image.service";
import { ImpresionCompService } from "src/app/services/i2t/impresion-comp.service";
import { OrdPublicidadService } from 'src/app/services/i2t/ord-publicidad.service'
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Services } from '@angular/core/src/view';

const TOKEN = '';
var auxProvData: any, urlBase:any;

@Injectable()

@Component({
  selector: 'app-registro-evidencia',
  templateUrl: './registro-evidencia.component.html',
  styleUrls: ['./registro-evidencia.component.css']
})
export class RegistroEvidenciaComponent implements OnInit {

  suscripcionesModal: Subscription[] = [];
  suscripcionImg: Subscription;
  inputParam: any;
  adjunto: any;
  urlImagen:string = "";
  urlImg: any[];
  datos: any;

  token: any;
  forma: FormGroup;
  loading: boolean = false;
  nuevo: boolean = false;
  suscripcionConsDin: Subscription;
  itemDeConsulta: any;
  id: any;
  fechaActual: Date = new Date();
  evidencias: any;
  descripcion: string;
  evidenciasdata: evidenciasdata[] = [];
  evidenciaId: any;

  dataSource = new MatTableDataSource<evidenciasdata>(this.evidencias);
  constructor(public ngxSmartModalService: NgxSmartModalService,
              private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              private _imageService: ImageService,
              private _evidenciasService: EvidenciasService,
              private _ordPublicidadService: OrdPublicidadService,
              private _impresionCompService: ImpresionCompService) { 

    this.forma = new FormGroup({
      'fecha': new FormControl(),
      'descripcion': new FormControl(),
      'image': new FormControl(),
      'btn': new FormControl()
    })
    this.token = localStorage.getItem('TOKEN')
  //  this.token = this.storage.get(TOKEN);

    this.loading = true;
    this.route.params.subscribe( parametros=>{
     this.id = parametros['id'];
     //this.token = parametros['token'];
     //this.Controles['proveedor'].setValue(this.id);
 
     });
  }

  ngAfterViewInit(){
   
    this.ngxSmartModalService.getModal('evidenciasModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('evidenciasModal');
      console.log('datos recibidos por modal de evidencias: ', this.inputParam);
      this.nuevo = this.inputParam.nuevo;
      this.mostrarEvidencias();
    });
  }

  ngOnInit() {
    this.fechaActual.setDate(this.fechaActual.getDate());
    this.forma.controls['fecha'].setValue(this.fechaActual);
    
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
          console.log('png','jpg');
        }
      }
    }
    if(this.adjunto.size > 1000000){
      console.log('Tamaño superado')
    }
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
         this._impresionCompService.getBaseDatos( this.token )
         .subscribe ( dataP => {
           console.log(dataP)
          this.datos = dataP
          this.urlImagen = this.datos.dataset[0].imagenes+this.urlImagen;
          console.log(this.urlImagen)
        })
      //   this.inputParam.url = this.urlImagen
       });
    //   this.guardar();
  }

  agregarEvidencia(){
    this.nuevo = true;
    this.forma.controls['descripcion'].setValue("")
    this.urlImagen = "";
   // this.mostrarEvidencias();
  }
  guardarEvidencia(){
    if(this.urlImagen === ""){
      this.openSnackBar('No se selecionó ninguna imagen')
    } else if(this.forma.controls['descripcion'].value === ""){
      this.openSnackBar('El campo descripción no puede estar vació');
    } else {
    this.nuevo = false;
    
    let jsbody = {
      "id_op": this.inputParam.ordPublicidadId,
	    "name_evidencia": this.forma.controls['descripcion'].value,
	    "url_evidencia": this.urlImagen,
	    "id_proveedor": this.inputParam.proveedorId
    }
    let jsonbody = JSON.stringify(jsbody)
    this._evidenciasService.registrarEvidencia( jsonbody, this.token)
      .subscribe(dataE => {
        console.log(dataE);
      })
      this.forma.controls['descripcion'].setValue('')
      this.mostrarEvidencias();
      this.openSnackBar('Evidencia Guardada');
      this.actualizaOrden();
    }
  }

  actualizaOrden(){
    let jsbodyUpdOrd = {
      "id_op": this.inputParam.ordPublicidadId,
	    "user_id": "1",
    	"estado_op": 45
    }
    console.log('armado de json upd de orden')
    let jsonbodyUpdOrd = JSON.stringify(jsbodyUpdOrd);
    this._ordPublicidadService.updOrden( jsonbodyUpdOrd, this.token)
      .subscribe( respUpd => {
        console.log(respUpd)
      })
  }

  mostrarEvidencias(){
    let jsbodyevid = {
      "id_proveedor": this.inputParam.proveedorId,
      "id_op": this.inputParam.ordPublicidadId
    }
    let jsonbodyevid = JSON.stringify(jsbodyevid)
    this._evidenciasService.getEvidencias( jsonbodyevid, this.token)
      .subscribe(dataEv => {
        console.log(dataEv);
        this.evidencias = dataEv;
        this.evidenciasdata = this.evidencias.dataset;
        this.dataSource = new MatTableDataSource(this.evidenciasdata) 
      })
  }

  eliminarEvidencia(id,url:string){
    let jsbodyEvDel = {
      "id_op": this.inputParam.ordPublicidadId,
      "id_evidencia": id
    }
   
    this.urlImg = url.split('/')
   
    console.log(this.urlImg[this.urlImg.length-1])
    console.log(url)
    let jsonbodyEvDel = JSON.stringify(jsbodyEvDel)
    this._imageService.delImage(this.urlImg[this.urlImg.length-1], this.token)
      .subscribe(evUrl => {
        console.log(evUrl)
      }) 
    this._evidenciasService.delEvidencia( jsonbodyEvDel, this.token)
      .subscribe(dataEv => {
        console.log(dataEv);
        this.mostrarEvidencias();
      })
  }

  verImagen(urlImagen: string){
    let datosModal : {
      url: string;
      permiteMultiples: boolean;
      selection: any;
      modal: string;
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      url: urlImagen,
      permiteMultiples: false,
      selection: null,
      modal: 'imgModal'
    }
  
    console.log('enviando datosModal: ');
    console.log(datosModal);
    
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionImg = this.ngxSmartModalService.getModal(datosModal.modal).onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de img: ', modal.getData());

      let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);
      console.log('Respuesta del modal: ', respuesta);

      if (respuesta.estado === 'cancelado'){
        
      }
      else{
        this.ngxSmartModalService.resetModalData('imgModal');
        // this.forma.controls[control].setValue(respuesta.selection[0].cpostal);
        // this.buscarProveedor();
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionImg.unsubscribe();
      console.log('se desuscribió al modal de imagenes');
    });
    this.ngxSmartModalService.open(datosModal.modal);
  }

  cancelar(){
    this.ngxSmartModalService.resetModalData('evidenciasModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado', nuevo: false}, 'evidenciasModal');
    this.ngxSmartModalService.close('evidenciasModal');
  }
}
export interface evidenciasdata{
  id_evidencia: string,
  descripcion: string,
  fecha: string,
  url_imagen: string,
  name_imagen: string
}
