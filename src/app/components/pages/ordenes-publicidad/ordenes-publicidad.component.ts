import { Component, OnInit, ViewChild,  ElementRef, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTable, MatSort, MatPaginator } from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from "@angular/router";

// key that is used to access the data in local storage
const TOKEN = '';
var auxProvData: any;

@Injectable()

@Component({
  selector: 'app-ordenes-publicidad',
  templateUrl: './ordenes-publicidad.component.html',
  styleUrls: ['./ordenes-publicidad.component.css']
})
export class OrdenesPublicidadComponent implements OnInit {
  loading: boolean = true;
  forma: FormGroup;
  @ViewChild(MatSort) sort: MatSort;

  compraProveedor: CompraProveedor;
  proveedorData: any;
  id: any;
  token: string;
  cuit: any;
  loginData: any;
  razonSocial: string;

  constructor(private route:ActivatedRoute,private router: Router,
              private _compraService: CompraService,
              @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.forma = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
   })
   this.token = this.storage.get(TOKEN);

   this.route.params.subscribe( parametros=>{
    this.id = parametros['id'];
    //this.token = parametros['token'];
    //this.Controles['proveedor'].setValue(this.id);
   // this.buscarProveedor();

    });

    
  } 
  
  
  ngOnInit() {
  }

  existeProveedor( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxProvData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  buscarProveedor(){
    this._compraService.getProveedor( this.id, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            console.log('Token invalido');
          //   this.compraProveedor = null;
          //  let jsbody = {"usuario":"usuario1","pass":"password1"}
          //  let jsonbody = JSON.stringify(jsbody);
          //  this._compraService.login(jsonbody)
          //    .subscribe( dataL => {
          //      console.log(dataL);
          //      this.loginData = dataL;
          //      this.token = this.loginData.dataset[0].jwt;
          //      this.buscarProveedor();
           //  });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.compraProveedor = this.proveedorData.dataset[0];
              this.loading = false;
              let icuit,mcuit,fcuit;
              if(this.compraProveedor.cuit!=null){
                icuit = this.compraProveedor.cuit.slice(0,2);
                mcuit = this.compraProveedor.cuit.slice(2,10);
                fcuit = this.compraProveedor.cuit.slice(10);
                this.cuit = icuit + '-' + mcuit + '-' + fcuit;
              } else {
                this.cuit = ' ';
              }

              this.razonSocial = this.compraProveedor.name
            } else {
              this.compraProveedor = null;
            }
          }
      });
  }

}
