import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Router, ActivatedRoute } from "@angular/router";
import { FormulariosService} from 'src/app/services/i2t/formularios.service';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { ProveedorCabecera, RelacionComercial, Impuesto, Formulario, ArticuloProv } from 'src/app/interfaces/proveedor.interface';

const TOKEN = '';
@Injectable()
@Component({
  selector: 'app-carga-formulario',
  templateUrl: './carga-formulario.component.html',
  styleUrls: ['./carga-formulario.component.css']
})
export class CargaFormularioComponent implements OnInit {
  
  token: string;
  respData:any; //respuestas de servicio proveedores
  formulariosAll:any[];
  formulariosProvAll:Formulario[];
  id:any;

  constructor(private route:ActivatedRoute,
              public ngxSmartModalService: NgxSmartModalService,
              private _formulariosService: FormulariosService,
              private _proveedoresService: ProveedoresService,
              @Inject(SESSION_STORAGE) private storage: StorageService) {
  
    this.token = this.storage.get(TOKEN);

    this.route.params.subscribe( parametros=>{
    this.id = parametros['id'];

    this.cargaFormulario();
    console.log(this.id)
    })

    
  }

  ngOnInit() {
  }

  cargaFormulario(){
    let jsbody = {

      "id_proveedor": '4081'
    } 
     let jsonbody = JSON.stringify(jsbody);
    
    this._proveedoresService.getFormularios( jsonbody , this.token )
    .subscribe( data => {
      console.log(data);
        this.respData = data;
        // auxArticulo = this.aData.dataset.length;
        if(this.respData.returnset[0].RCode=="-6003"){
          //token invalido
          this.formulariosProvAll = null;
        //  this.forma.disable();
        } else {
          console.log('respuesta consulta de formulario asociadas: ', this.respData)
        }
      });
  }
}

