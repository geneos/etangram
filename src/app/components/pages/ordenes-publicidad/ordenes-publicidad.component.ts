import { Component, OnInit, ViewChild,  ElementRef, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { OrdPublicidad } from "../../../interfaces/ord-publicidad.interface";
import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { OrdPublicidadService } from "../../../services/i2t/ord-publicidad.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from "@angular/router";
import { supportsScrollBehavior } from '@angular/cdk/platform';

// key that is used to access the data in local storage
const TOKEN = '';
var auxProvData: any;

@Injectable()

@Component({
  selector: 'app-ordenes-publicidad',
  templateUrl: './ordenes-publicidad.component.html',
  styleUrls: ['./ordenes-publicidad.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdenesPublicidadComponent implements OnInit {
  loading: boolean = true;
  forma: FormGroup;
  @ViewChild(MatSort) sort: MatSort;

  //datos para impresion
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];
  //fin datos para impresion

  datosOrdPublicidad: any;
  aEjecutar: OrdPublicidad[] = [];
  pendienteRendicion: OrdPublicidad[] = [];
  enProcesoLiquidacion: OrdPublicidad[] = [];
  expandedElement: OrdPublicidad | null;
  columnsToDisplay  = ['numero', 'mes', 'medio', 'expediente', 'importe', 'acciones'];

  compraProveedor: CompraProveedor;
  proveedorData: any;
  id: any;
  token: string;
  cuit: any;
  loginData: any;
  razonSocial: string;

  constructor(private route:ActivatedRoute,private router: Router,
              private _compraService: CompraService,
              private _ImpresionCompService:ImpresionCompService,
              private _ordPublicidadService: OrdPublicidadService,
              @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.forma = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
   })
   this.token = this.storage.get(TOKEN);

   this.loading = true;
   this.route.params.subscribe( parametros=>{
    this.id = parametros['id'];
    //this.token = parametros['token'];
    //this.Controles['proveedor'].setValue(this.id);
    this.buscarProveedor();

    });

    
  } 
  
  ngOnInit() {
    this.mostrarDatos();
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

  print(nint: string) {
    // window.open('http://devjasper.i2tsa.com.ar/Ejecutar_Reportes2.php?ruta_reporte=/E_Tangram/Reports/Compras/ET_ReferenciasContables&formato=PDF&param_param_nint=213334');
     this._ImpresionCompService.getBaseDatos( this.token )
     .subscribe ( dataP => {
       console.log(dataP)
       this.proveedorData = dataP;
       this.baseUrl = this.proveedorData.dataset
       this.urlBaseDatos = this.baseUrl[0].jasperserver + this.baseUrl[0].app
       if(this.proveedorData.dataset.length>0){
         this._ImpresionCompService.getInfromes('ETG_ordenpublicidad', this.token)
         .subscribe ( dataP => {
           console.log(dataP)
           this.proveedorData = dataP;
           this.informes = this.proveedorData.dataset
           this.urlInforme = this.urlBaseDatos + this.informes[0].url
           console.log(this.urlInforme + nint)
           if(this.proveedorData.dataset.length>0){
             window.open(this.urlInforme + nint)
           }
         })
       }
     })
   }

   mostrarDatos(){
     let jsbodydatos10 = {
      "Id_Prov": this.id,
      "opc": 10
     }
     let jsonbodydatos10 = JSON.stringify(jsbodydatos10);

     this._ordPublicidadService.postDatos(jsonbodydatos10, this.token)
      .subscribe ( dataD => {
        console.log(dataD);
        this.datosOrdPublicidad = dataD;
        this.aEjecutar = this.datosOrdPublicidad.dataset
        // this.aEjecutar = new MatTableDataSource(this.datosOrdPublicidad);
        // console.log(this.aEjecutar);
      })

    let jsbodydatos20 = {
      "Id_Prov": this.id,
      "opc": 20
     }
     let jsonbodydatos20 = JSON.stringify(jsbodydatos20);

     this._ordPublicidadService.postDatos(jsonbodydatos20, this.token)
      .subscribe ( dataD => {
        console.log(dataD);
        this.datosOrdPublicidad = dataD;
        this.pendienteRendicion = this.datosOrdPublicidad.dataset
        // this.aEjecutar = new MatTableDataSource(this.datosOrdPublicidad);
        // console.log(this.aEjecutar);
      })

    let jsbodydatos30 = {
      "Id_Prov": this.id,
      "opc": 30
      }
      let jsonbodydatos30 = JSON.stringify(jsbodydatos30);
  
      this._ordPublicidadService.postDatos(jsonbodydatos30, this.token)
        .subscribe ( dataD => {
          console.log(dataD);
          this.datosOrdPublicidad = dataD;
          this.enProcesoLiquidacion = this.datosOrdPublicidad.dataset
          // this.aEjecutar = new MatTableDataSource(this.datosOrdPublicidad);
          // console.log(this.aEjecutar);
        }) 
   }
}
