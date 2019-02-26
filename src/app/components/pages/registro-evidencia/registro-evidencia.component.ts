import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EvidenciasService } from "src/app/services/i2t/evidencias.service"
import { MatTable, MatHint, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from "@angular/router";
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
  token: any;
  forma: FormGroup;
  loading: boolean = false;
  nuevo: boolean = false;
  suscripcionConsDin: Subscription;
  itemDeConsulta: any;
  id: any;

  constructor(public ngxSmartModalService: NgxSmartModalService,
              private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar,
              @Inject(SESSION_STORAGE) private storage: StorageService,
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

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  agregarEvidencia(){
    this.nuevo = true;
    
    this.mostrarEvidencias();
  }
  guardarEvidencia(){
    this.nuevo = false;
    let jsbody = {
      "id_op": "002df6c8-5c12-11e7-afc8-005056b65e14",
	    "name_evidencia": "Evidencia ff",
	    "url_evidencia": "https://google.com/",
	    "user_evidencia": "FaustoID"
    }
    let jsonbody = JSON.stringify(jsbody)
    this._evidenciasService.registrarEvidencia( jsonbody, this.token)
      .subscribe(dataE => {
        console.log(dataE);
      })

  }

  mostrarEvidencias(){
    let jsbodyevid = {
      "user_evidencia": "1191"
    }
    let jsonbodyevid = JSON.stringify(jsbodyevid)
    this._evidenciasService.getEvidencias( jsonbodyevid, this.token)
      .subscribe(dataEv => {
        console.log(dataEv);
      })
  }
}
