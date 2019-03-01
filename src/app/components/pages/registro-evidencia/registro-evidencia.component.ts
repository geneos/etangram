import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EvidenciasService } from "src/app/services/i2t/evidencias.service"
import { MatTable, MatHint, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from "@angular/router";
import { ImageService } from "src/app/services/i2t/image.service";
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

const TOKEN = '';
var auxProvData: any;

@Injectable()

@Component({
  selector: 'app-registro-evidencia',
  templateUrl: './registro-evidencia.component.html',
  styleUrls: ['./registro-evidencia.component.css']
})
export class RegistroEvidenciaComponent implements OnInit {

  suscripcionesModal: Subscription[] = [];
  inputParam: any;
  adjunto: any;
  urlImagen:string = "";

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
              private _evidenciasService: EvidenciasService) { 

    this.forma = new FormGroup({
      'fecha': new FormControl(),
      'descripcion': new FormControl(),
      'image': new FormControl(),
      'btn': new FormControl()
    })
    this.token = this.storage.get(TOKEN);

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
    //this.urlImagen = "url sigue vacia"
     //console.log(formData.getAll('file'));
     //console.log(formData);
     this._imageService.postImage( this.adjunto, this.token )
       .subscribe( resp => {
         console.log(resp);
         this.urlImagen = resp.toString();
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
      this.openSnackBar('Evidencia Guardada')
    }
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

  eliminarEvidencia(id){
    let jsbodyEvDel = {
      "id_op": this.inputParam.ordPublicidadId,
      "id_evidencia": id
    }
    let jsonbodyEvDel = JSON.stringify(jsbodyEvDel)
    this._evidenciasService.delEvidencia( jsonbodyEvDel, this.token)
      .subscribe(dataEv => {
        console.log(dataEv);
        this.mostrarEvidencias();
      })
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
  url_imagen: string
}
