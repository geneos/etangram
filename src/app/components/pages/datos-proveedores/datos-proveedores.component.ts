import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { DatosProveedorService } from 'src/app/services/i2t/datos-proveedor.service';
import { MatTable, MatSort, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Router, ActivatedRoute } from "@angular/router";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { UsuariosService } from 'src/app/services/i2t/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-datos-proveedores',
  templateUrl: './datos-proveedores.component.html',
  styleUrls: ['./datos-proveedores.component.css']
})
export class DatosProveedoresComponent implements OnInit {

  respCabecera: any;
  respUpdCabecera: any;
  respImpuesto: any;
  respFormulario: any;
  datosCabecera: datosCabecera[] = [];
  datosImpuesto : datosImpuesto[] = [];
  datosFormularios: datosFormularios[] = [];
  token: string = 'a';
  loginData: any;
  loading: boolean = true;
  direccionFac: string;
  direccionEnv: string;
  telefonos: string;
  url: string;
  forma: FormGroup;

  usuario: Usuario;
  auxUserId: any;
  auxresp: any;
  idProv:string = null;

  modificando:boolean = false;

  dataSource = new MatTableDataSource<datosImpuesto>(this.datosImpuesto);
  dataSource2 = new MatTableDataSource<datosFormularios>(this.datosFormularios);
  columnsToDisplay = ['descripcion', 'presentacion', 'vencimiento'];
  constructor(
    private _DatosProveedorService: DatosProveedorService,
    private _usuariosService: UsuariosService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private route:ActivatedRoute,
    public snackBar: MatSnackBar)
    {

      console.log(this.storage.get(TOKEN) || 'Local storage is empty');
      this.token = this.storage.get(TOKEN);

      this.route.params.subscribe( parametros=>{
        this.idProv = parametros['id'];
      });

    this.forma = new FormGroup({
      'calleFac': new FormControl(),
      'codPostalFac': new FormControl(),
      'provinciaFac': new FormControl(),
      'calleEnv': new FormControl(),
      'codPostalEnv': new FormControl(),
      'provinciaEnv': new FormControl(),
      'telefono1': new FormControl(),
      'telefono2': new FormControl(),
      'telefono3': new FormControl(),
      'email': new FormControl()
    })
  }
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }
  ngOnInit() {
    this.getCabecera()
    this.forma.controls['calleFac'].disable();
    this.forma.controls['codPostalFac'].disable();
    this.forma.controls['provinciaFac'].disable();
    this.forma.controls['calleEnv'].disable();
    this.forma.controls['codPostalEnv'].disable();
    this.forma.controls['provinciaEnv'].disable();
    this.forma.controls['telefono1'].disable();
    this.forma.controls['telefono2'].disable();
    this.forma.controls['telefono3'].disable();
    this.forma.controls['email'].disable();
    this.obtenerIDUsuario();
  }

  modificar(){
    
    this.modificando = true;
    this.forma.controls['calleFac'].disable();
    this.forma.controls['codPostalFac'].disable();
    this.forma.controls['provinciaFac'].disable();
    this.forma.controls['calleEnv'].enable();
    this.forma.controls['codPostalEnv'].enable();
    this.forma.controls['provinciaEnv'].enable();
    this.forma.controls['telefono1'].enable();
    this.forma.controls['telefono2'].enable();
    this.forma.controls['telefono3'].enable();
    
    this.forma.controls['email'].enable();
    this.forma.controls['email'].setValue(this.datosCabecera[0].Email);
    this.forma.controls['calleEnv'].setValue(this.datosCabecera[0].Domicilio_envio);
    this.forma.controls['telefono1'].setValue(this.datosCabecera[0].Telefono_Oficina);
    this.forma.controls['telefono2'].setValue(this.datosCabecera[0].Telefono_Movil);
    this.forma.controls['telefono3'].setValue(this.datosCabecera[0].Telefono_Fax);
  }

  actualizar(){
    this.modificando = false;
    

    let jsbodyupd = {

      "ID_Proveedor": this.idProv,
      "ID_User": this.auxUserId,        
      "Email": this.forma.controls['email'].value,        
      "Domicilio_envio":this.forma.controls['calleEnv'].value,       
      "ID_Localidad_envio": this.datosCabecera[0].ID_Localidad,       
      "Telefono_Oficina":this.forma.controls['telefono1'].value,       
      "Telefono_Alternativo":this.forma.controls['telefono2'].value,       
      "Telefono_Fax":this.forma.controls['telefono3'].value
      }
      
     let jsonbodyupd = JSON.stringify(jsbodyupd);

     this._DatosProveedorService.updCabecera( jsonbodyupd, this.token )
     .subscribe( dataP => {
     console.log(dataP);
     this.respUpdCabecera = dataP;
    })

    this.forma.controls['calleFac'].disable();
    this.forma.controls['codPostalFac'].disable();
    this.forma.controls['provinciaFac'].disable();
    this.forma.controls['calleEnv'].disable();
    this.forma.controls['codPostalEnv'].disable();
    this.forma.controls['provinciaEnv'].disable();
    this.forma.controls['telefono1'].disable();
    this.forma.controls['telefono2'].disable();
    this.forma.controls['telefono3'].disable();
    this.forma.controls['email'].disable();

  }

  getCabecera(){
    let jsbodyCab = {
      "Id_Proveedor": this.idProv//"4081"
    }
    let jsonbodyCab= JSON.stringify(jsbodyCab);

    this._DatosProveedorService.datosCabecera( jsonbodyCab, this.token )
      .subscribe( dataP => {
        console.log(dataP);
          this.respCabecera = dataP;
          if(this.respCabecera.returnset[0].RCode== "-6003" ){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._DatosProveedorService.login(jsonbody)
              .subscribe( dataL => {
 //               console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.getCabecera();
              });
            } else {
              if(this.respCabecera.dataset.length>0){
                this.datosCabecera = this.respCabecera.dataset;
                this.loading = false;
                if(this.datosCabecera[0].Domicilio == null){
                  this.direccionFac = null;
                } else{

                }
                if(this.datosCabecera[0].Domicilio_envio == "") {
                  this.direccionEnv = null;
                } else {
                this.direccionEnv = this.datosCabecera[0].Domicilio_envio +', '+'('+this.datosCabecera[0].Codigo_Postal_envio+')'+', '+this.datosCabecera[0].Ciudad_envio;
                }
                this.telefonos = this.datosCabecera[0].Telefono_Oficina + ' - ' + this.datosCabecera[0].Telefono_Movil;

                //TRAE IMPUESTOS
                this._DatosProveedorService.getImpuesto( jsonbodyCab, this.token)
                .subscribe(dataI => {
                  console.log(dataI);
                  this.respImpuesto = dataI;
                  if(this.respImpuesto.dataset.length>0){
                    this.datosImpuesto = this.respImpuesto.dataset;
                    this.dataSource = new MatTableDataSource(this.datosImpuesto);
                  }
                })
                //TRAE FORMULARIOS
                this._DatosProveedorService.getFormulario( jsonbodyCab, this.token)
                .subscribe(dataF => {
                  console.log(dataF);
                  this.respFormulario = dataF;
                  if(this.respFormulario.dataset.length>0){
                    this.datosFormularios = this.respFormulario.dataset;
                    this.dataSource2 = new MatTableDataSource(this.datosFormularios);
                  }
                })
              } else {
                this.datosCabecera = null;

              }

            }
      });

  }

  obtenerIDUsuario(){
    //todo: traer usuario de login, ahora no tienen relación en la base
    this._usuariosService.getUsuarioPorUsername('usuario1', this.token)
    .subscribe( resp => {
      //console.log(resp);
      this.auxresp = resp;
      console.log(this.auxresp);
      if(this.auxresp.returnset[0].RCode=="-6003"){
        //token invalido
        console.log('token invalido');
        //this.refContable = null;
        /*let jsbody = {"usuario":"usuario1","pass":"password1"}
        let jsonbody = JSON.stringify(jsbody);
        this._refContablesService.login(jsonbody)
          .subscribe( dataL => {
            console.log(dataL);
            this.loginData = dataL;
            this.token = this.loginData.dataset[0].jwt;
            this.obtenerIDUsuario();
          });*/
        } else {
          if (this.auxresp.returnset[0].RCode=="1"){
            //obtenido ok
            console.log('obtenido: ');
            console.log(this.auxresp.dataset[0]);
            this.usuario = this.auxresp.dataset[0];
            this.auxUserId = this.usuario.id;
          } else {
            //error al obtener el id de usuario
            this.openSnackBar("Error. No se pudo obtener el id de usuario.");
          }
      }
    });

    return this.usuario;
  }

}
export interface datosCabecera {
  'Razon_Social': string,
  'CUIT': string,
  'Email': string,
  'Estado': string,
  'Estado_Afip': string,
  'Domicilio': any,
  'Ciudad': string,
  'Codigo_Postal': string,
  'Domicilio_envio': string,
  'Ciudad_envio': string,
  'ID_Localidad': string,
  'Codigo_Postal_envio': string,
  'Telefono_Oficina': string,
  'Telefono_Movil': string,
  'Telefono_Fax': string
}

export interface datosImpuesto {
  "Exenciones": number,
  "Fecha_Desde_Exenciones": string,
  "Fecha_Hasta_Exenciones": string,
  "Fecha_inscripcion": string,
  "ID_Impuestos": string,
  "ID_Modelo_impuestos": string,
  "Impuesto": string,
  "Situacion": string
}
export interface datosFormularios{
  "Descripcion": string,
  "Fecha_presentacion": string,
  "Fecha_vencimiento": string,
  "Url": string
}
