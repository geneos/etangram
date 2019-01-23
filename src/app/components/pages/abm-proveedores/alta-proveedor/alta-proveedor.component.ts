import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { formatDate } from '@angular/common';
import { TiposDocumentoService } from '../../../../services/i2t/tipos-documento.service';

const PROVEEDORES:any[] = [
  {'numero':0,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':1,'razonSocial':'Deux IT SRL','cuit':'30-123456789-9','posicionFiscal':'IVA Responsable Inscripto'},
  {'numero':2,'razonSocial':'Lunix S.R.L.','cuit':'30-987654321-0','posicionFiscal':'IVA Responsable Inscripto'},
];

@Component({
  selector: 'app-alta-proveedor',
  templateUrl: './alta-proveedor.component.html',
  styleUrls: ['./alta-proveedor.component.css']
})
export class AltaProveedorComponent implements OnInit {

  token: string = "a";

  impuestosData: any[] = [];
  addingImpuesto:boolean = false;

  stockData: any[] = [];
  addingStock:boolean = false;

  cuentasBanc:any[]=[{'nroCuenta':0},];
  impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  formularios:any[]=[{'nroFormulario':0},];
  articulosStock:any[]=[{'nroArticulosStock':0},];

  constProveedores = PROVEEDORES;

  forma:FormGroup;
  formaImpuesto:FormGroup;
  formaStock:FormGroup;
  id:any;

  existe:boolean;

   @ViewChild('tableImpuestos') table: MatTable<any>;
   @ViewChild('tableStock') table2: MatTable<any>;
  today: Date;
  tcData: any;
  tiposDocumentoAll:any[];
  loginData: any;

  constructor( private route:ActivatedRoute, private _tiposDocumentoService:TiposDocumentoService ) {
    this.forma = new FormGroup({
      //FILIATORIOS Y GEOGRÁFICOS
      //'tipoReferente': new FormControl('',Validators.required),
      'numero': new FormControl('',Validators.required),
      'razonSocial': new FormControl('',Validators.required),
      'nombreFantasia': new FormControl('',Validators.required),
      'tipoDocumento': new FormControl('',Validators.required),
      'nroDocumento': new FormControl('',Validators.required),
      'facCalle': new FormControl('',Validators.required),
      'facCiudad': new FormControl('',Validators.required),
      'facProvincia': new FormControl('',Validators.required),
      'facCodigoPostal': new FormControl('',Validators.required),
      'facPais': new FormControl('',Validators.required),
      'envCalle': new FormControl(),
      'envCiudad': new FormControl(),
      'envProvincia': new FormControl(),
      'envCodigoPostal': new FormControl(),
      'envPais': new FormControl(),
      'telefono1': new FormControl('',Validators.required),
      'telefono2': new FormControl(),
      'telefono3': new FormControl(),
      'email': new FormControl('',Validators.required),
      'observaciones': new FormControl(),
      //RELACION COMERCIAL
      'rcCbu': new FormControl(),
      'rcCuentaBancaria': new FormControl(),
      'rcCodigoSucursal': new FormControl(),
      //IMPUESTOS
      'cuit': new FormControl(),
      'cai': new FormControl(),
      'fechaVtoCai': new FormControl(),
    });

    this.formaImpuesto = new FormGroup({
      'tipo': new FormControl(),
      'modelo': new FormControl(),
      'situacion': new FormControl(),
      'codInscripcion': new FormControl(),
      'fechaInscripcion': new FormControl(),
      'exenciones': new FormControl()
    });

    
    this.forma.controls['facCiudad'].disable();
    this.forma.controls['facProvincia'].disable();
    this.forma.controls['facPais'].disable();
    this.forma.controls['envCiudad'].disable();
    this.forma.controls['envProvincia'].disable();
    this.forma.controls['envPais'].disable();

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constProveedores ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['numero'].setValue(this.id);
            this.forma.controls['razonSocial'].setValue(this.constProveedores[this.id].razonSocial);
            this.forma.controls['cuit'].setValue(this.constProveedores[this.id].cuit);
            this.forma.controls['posicionFiscal'].setValue(this.constProveedores[this.id].posicionFiscal);
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['numero'].disable();
          this.forma.controls['razonSocial'].disable();
          this.forma.controls['cuit'].disable();
          this.forma.controls['posicionFiscal'].disable();
        }
      }

    });

  }

  ngOnInit() {
    /*for(var i = 0; i < this.impuestos[0].exenciones.length; i++){
      console.log(this.impuestos[0].exenciones[i]);
    }*/
    this.buscarTiposDocumento();
  }

  copiarDireccion(){
    this.forma.controls['envCalle'].setValue(this.forma.controls['facCalle'].value);
    this.forma.controls['envCodigoPostal'].setValue(this.forma.controls['facCodigoPostal'].value);
  }

//impuestos:any[]=[{'nroImpuesto':0,'exenciones':[{'nroExencion':0},]},];
  addImpuesto(){
    this.impuestos.push({'nroImpuesto':(this.impuestos.length),'exenciones':[{'nroExencion':0},]});
    console.log(this.impuestos)
  }
  deleteImpuesto(ind){this.impuestos.splice(ind, 1);}

  addExencion(ind){
    this.impuestos[ind].exenciones.push({'nroExencion':this.impuestos[ind].exenciones.length});
    //for(var i = 0; i < this.impuestos[0].exenciones.length; i++){console.log(this.impuestos[0].exenciones[i]);}
    //console.log(this.impuestos[ind].exenciones)
  }
  deleteExencion(indi,inde){this.impuestos[indi].exenciones.splice(inde, 1);}

  addFormulario(){this.formularios.push({'nroFormulario':(this.formularios.length)});}
  deleteFormulario(ind){this.formularios.splice(ind, 1);}

  addArticulosStock(){this.articulosStock.push({'nroArticulosStock':(this.articulosStock.length)});}
  deleteArticulosStock(ind){this.articulosStock.splice(ind, 1);}

  addCuentaBanc(){this.cuentasBanc.push({'nroCuenta':(this.cuentasBanc.length)});}
  deleteCuentasBanc(ind){this.cuentasBanc.splice(ind, 1);}

  buscarTiposDocumento(){
    this._tiposDocumentoService.getTiposDocumento( this.token )
      .subscribe( data => {
        //console.log(dataRC);
          this.tcData = data;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.tcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.tiposDocumentoAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._tiposDocumentoService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarTiposDocumento();
              });
            } else {
              if(this.tcData.dataset.length>0){
                this.tiposDocumentoAll = this.tcData.dataset;
                console.log(this.tiposDocumentoAll);
                //this.loading = false;

              } else {
                this.tiposDocumentoAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  /*getdatetime(){
    this.today = new Date();
    return formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'en-US', '-0300');
  }*/

  guardarProveedor(){
    if( this.id == "nuevo" ){
      // insertando
      let auxRid; //viene en la response del primer post

      let jsbody = {
        "p_tipo_referente":	"P",
        "prov_codigo": this.forma.controls['numero'].value, //Código del campo “Número”
        "p_name": this.forma.controls['razonSocial'].value, //Razón social
        "p_nombre_fantasia_c": this.forma.controls['nombreFantasia'].value, //Nombre de fantasía
        "p_tipo_doc": this.forma.controls['tipoDocumento'].value, //Id de la consulta a la tabla tg01_tipodocumento
        "p_nro_doc": this.forma.controls['nroDocumento'].value,
        "p_fac_calle": this.forma.controls['facCalle'].value,
        "p_fac_ciudad": "Lopez", //Id de la consulta dinámica a la tabla tg01_localidades
        "p_fac_prov": "Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
        "p_fac_cp": this.forma.controls['facCodigoPostal'].value,
        "p_fac_pais": "Argentina", //Id de la consulta dinámica a la tabla tg01_paises
        "p_env_calle": this.forma.controls['envCalle'].value,
        "p_env_ciudad": "Santa Fe", //Id de la consulta dinámica a la tabla tg01_localidades
        "p_env_prov": "Santa Fe", //Id de la consulta dinámica a la tabla tg01_provincias
        "p_env_cp": this.forma.controls['envCodigoPostal'].value,
        "p_env_pais":  "Argentina", //Id de la consulta dinámica a la tabla tg01_paises
        "p_tel_1": this.forma.controls['telefono1'].value,
        "p_tel_2": this.forma.controls['telefono2'].value,
        "p_tel_3": this.forma.controls['telefono3'].value,
        "p_email": this.forma.controls['email'].value,
        "p_obs": this.forma.controls['observaciones'].value,
        "p_categoria": "1", //id de consulta dinámica a tabla tg01_categoriareferente
        "p_zona": "", //id de consulta dinámica a tabla tg01_zonas
        "p_vendedor": "", //id de consulta dinámica a tabla tg01_vendedor
        "p_cobrador": "", //id de consulta dinámica a tabla tg01_vendedor
        "p_lim_cred": 18.0,
        "p_lista_precio": "", //id de consulta dinámica a tabla tglp_tg_listasprecios
        "p_cond_comercializacion": "1",  //id de consulta dinámica a tabla tg01_condicioncomercial
        "p_partida_pres_default": "1", //id de consulta dinámica a tabla tg05_partidas_presupuestaria
        "p_ref_contable_default": "1", //id de consulta dinámica a tabla tg01_referenciascontables
        "p_situacion_iva":"1", //id de consulta dinámica a tabla tg01_categoriasiva
        "p_cuit_c": this.forma.controls['cuit'].value,
        "p_cai"	: this.forma.controls['cai'].value, //CAI
        "p_fecha_vto_cai" : this.forma.controls['fechaVtoCai'].value,
        "p_cuit_exterior" :"",
        "p_id_impositivo" :"" //id de consulta dinámica a tabla tg01_impuestos
      }
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);

      //RELACION COMERCIAL
      let jsbodyRC = {
        "prov_codigo": auxRid, //Rid devuelto en el alta de proveedor
        "p_cbu": this.forma.controls['rcCbu'].value,
        "p_cuentabancaria": this.forma.controls['rcCuentaBancaria'].value,
        "p_codigo_sucursal": this.forma.controls['rcCodigoSucursal'].value
      }
      let jsonbodyRC= JSON.stringify(jsbodyRC);
      console.log(jsonbodyRC);

      //IMPUESTOS
      let jsbodyImp = {
        "Id_Proveedor": auxRid, //"b16c0362-fee6-11e8-9ad0-d050990fe081",
        "p_imp_tipo" : "1", // id de tabla tg01_impuestos
        "p_imp_modelo" : "1", // id de tabla  tg01_modeloimpuestos
        "p_imp_situacion" : this.formaImpuesto.controls['situacion'].value,
        "p_imp_codigo" : this.formaImpuesto.controls['codInscripcion'].value,//"1",
        "p_imp_fecha_insc" : this.formaImpuesto.controls['fechaInscripcion'].value,//"1997-05-05",
        "p_imp_excenciones" : this.formaImpuesto.controls['exenciones'].value,//"false",
        "p_imp_fecha_comienzo_excencion" : "", // → si es true
        "p_imp_fecha_caducidad_excencion" : "",//  → si es true
        "p_imp_obs" : ""

      }
      let jsonbodyImp = JSON.stringify(jsbodyImp);
    }else{
      //actualizando
    }
  }

  /*addImpuesto(){
    this.addingImpuesto = true;
  }*/

  /*addStock(){
    this.addingStock = true;
  }*/

  /*cancelarImpItem(){
    this.addingImpuesto = false;
  }*/

  /*cancelarStockItem(){
    this.addingStock = false;
  }*/

  /*guardarImpuesto(){
    console.log(this.formaImpuesto.controls);
  this.impuestosData.push(this.formaImpuesto.controls);
  this.table.renderRows();
}*/

  /*guardarStock(){
    console.log(this.formaStock.controls);
  this.stockData.push(this.formaStock.controls);
  this.table2.renderRows();
}*/

  /*eliminarStock(ind:number){
    this.stockData.splice(ind, 1);
    this.table2.renderRows();
  };*/

  /*eliminarImpuesto(ind:number){
    this.impuestosData.splice(ind, 1);
    this.table.renderRows();
  };*/

}
