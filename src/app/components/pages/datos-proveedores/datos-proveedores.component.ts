import { Component, OnInit, Injectable, Inject, ViewChild } from '@angular/core';
import { DatosProveedorService } from 'src/app/services/i2t/datos-proveedor.service';
import { MatTable, MatHint, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValueTransformer } from '@angular/compiler/src/util';
import { LocalidadesService } from 'src/app/services/i2t/localidades.service';
import { Localidad } from 'src/app/interfaces/localidades.interface';
import { Router, ActivatedRoute } from "@angular/router";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { UsuariosService } from 'src/app/services/i2t/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

// key that is used to access the data in local storage
const TOKEN = '';
var auxLocData: any, auxSituacion: any;
@Injectable()

@Component({
  selector: 'app-datos-proveedores',
  templateUrl: './datos-proveedores.component.html',
  styleUrls: ['./datos-proveedores.component.css'],
  providers: [
    { provide: 'Window',  useValue: window },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DatosProveedoresComponent implements OnInit {

  suscripcionConsDin: Subscription;
  itemDeConsulta: any;
  @ViewChild('envCodPostal') elEnvCodigoPostal: any;
  suscripcionFormularios: Subscription;
  suscripcionImg: Subscription;

  formDescripcion: any;
  respCabecera: any;
  respUpdCabecera: any;
  respImpuesto: any;
  respFormulario: any;
  datosCabecera: datosCabecera[] = [];
  datosImpuesto : datosImpuesto[] = [];
  datosFormularios: datosFormularios[] = [];
  localidades: Localidad[] = [];
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
  respLocalidad: any;
  idLocalidad: any;
  modificando:boolean = false;
  logueado:boolean = true;

  dataSource = new MatTableDataSource<datosImpuesto>(this.datosImpuesto);
  dataSource2 = new MatTableDataSource<datosFormularios>(this.datosFormularios);
  columnsToDisplay = ['descripcion', 'presentacion', 'vencimiento'];
  constructor(
    private _DatosProveedorService: DatosProveedorService,
    private _usuariosService: UsuariosService,
    private _localidadesService: LocalidadesService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private route:ActivatedRoute,
    public ngxSmartModalService: NgxSmartModalService,
    public snackBar: MatSnackBar)
    {
      console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    //  this.token = this.storage.get(TOKEN);
      this.token = localStorage.getItem('TOKEN')

      this.route.params.subscribe( parametros=>{
        this.idProv = parametros['id'];
      });
      if (localStorage.length == 0){
        this.loading = true;
        setTimeout(() => {
          this.logueado = false;     
       //   this.openSnackBar('No ha iniciado sesión')
        }, 1000);  //2s
      } else {
        this.loading = false;
      };

    this.forma = new FormGroup({
      'calleFac': new FormControl(),
      'codPostalFac': new FormControl(),
      'provinciaFac': new FormControl(),
      'calleEnv': new FormControl(),
      'codPostalEnv': new FormControl('',[],this.existeLocalidad),
      'provinciaEnv': new FormControl(),
      'telefono1': new FormControl(),
      'telefono2': new FormControl(),
      'telefono3': new FormControl(),
      'email': new FormControl()
    })

    this.forma.controls['codPostalEnv'].valueChanges.subscribe(() => {
      setTimeout(() => {
        console.log('hubo un cambio')
        console.log('estado después de timeout ',this['provinciaEnv'])  
        this.elEnvCodigoPostal.nativeElement.dispatchEvent(new Event('keyup'));
      })
    });

  }
  
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  existeLocalidad( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxLocData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
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

  
  
  buscarLocalidad(){
    this._localidadesService.getLocalidades(this.forma.controls['codPostalEnv'].value, this.token)
     .subscribe(dataL => {
      console.log(dataL);
      this.respLocalidad = dataL;
      auxLocData = this.respLocalidad.dataset.length;
       if(this.respLocalidad.dataset.length>0){
        this.localidades = this.respLocalidad.dataset;
        this.idLocalidad = this.localidades[0].id;
        this.forma.controls['provinciaEnv'].setValue(this.localidades[0].name)       
       } else {
        this.localidades = null;
        this.idLocalidad = null;
        this.forma.controls['provinciaEnv'].setValue(null)  
       }
     })
  }

  abrirConsulta(consulta: string, control: string){
    this.itemDeConsulta = null;
    console.clear();
    let datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      modal: string;
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null,
      modal: 'consDinModal'
    }
    
    let atributoAUsar: string;
    switch (consulta) {
      case 'tg01_localidades':
        atributoAUsar = 'cpostal';
        break;
      case 'tg01_categoriasiva':
        atributoAUsar = 'idcategoria';
      default:
        break;
    }

    console.log('enviando datosModal: ');
    console.log(datosModal);
    
    // datosModal.columnSelection = this.columnSelection;
    console.log('Lista de modales declarados: ', this.ngxSmartModalService.modalStack);
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionConsDin = this.ngxSmartModalService.getModal(datosModal.modal).onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de consulta dinamica: ', modal.getData());

      let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);
      console.log('Respuesta del modal: ', respuesta);

      if (respuesta.estado === 'cancelado'){
        this.openSnackBar('Se canceló la selección');
      }
      else{
        this.forma.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
        this.itemDeConsulta = respuesta.selection[0];
        // this.forma.controls[control].setValue(respuesta.selection[0].cpostal);
        // this.buscarProveedor();
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionConsDin.unsubscribe();
      console.log('se desuscribió al modal de consulta dinamica');
    });
    this.ngxSmartModalService.open(datosModal.modal);
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
      console.log('Cerrado el modal de imagen: ', modal.getData());

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
      this.suscripcionFormularios.unsubscribe();
      console.log('se desuscribió al modal de imagenes');
    });
    this.ngxSmartModalService.open(datosModal.modal);
  }

  modificar(){
    
    this.modificando = true;
    this.forma.controls['calleFac'].disable();
    this.forma.controls['codPostalFac'].disable();
    this.forma.controls['provinciaFac'].disable();
    this.forma.controls['calleEnv'].enable();
    this.forma.controls['codPostalEnv'].enable();
    this.forma.controls['provinciaEnv'].disable();
    this.forma.controls['telefono1'].enable();
    this.forma.controls['telefono2'].enable();
    this.forma.controls['telefono3'].enable();
    this.forma.controls['email'].enable();

    this.getCabecera()
    this.forma.controls['email'].setValue(this.datosCabecera[0].Email);
    this.forma.controls['calleEnv'].setValue(this.datosCabecera[0].Domicilio_envio);
    this.forma.controls['codPostalEnv'].setValue(this.datosCabecera[0].Codigo_Postal_envio);
    this.forma.controls['provinciaEnv'].setValue(this.datosCabecera[0].Ciudad_envio);
    this.forma.controls['telefono1'].setValue(this.datosCabecera[0].Telefono_Oficina);
    this.forma.controls['telefono2'].setValue(this.datosCabecera[0].Telefono_Movil);
    this.forma.controls['telefono3'].setValue(this.datosCabecera[0].Telefono_Fax);
  }
  cancelar(){
    this.modificando = false;
    this.forma.controls['email'].setValue(this.datosCabecera[0].Email);
    this.forma.controls['calleEnv'].setValue(this.datosCabecera[0].Domicilio_envio);
    this.forma.controls['codPostalEnv'].setValue(this.datosCabecera[0].Codigo_Postal_envio);
    this.forma.controls['provinciaEnv'].setValue(this.datosCabecera[0].Ciudad_envio);
    this.forma.controls['telefono1'].setValue(this.datosCabecera[0].Telefono_Oficina);
    this.forma.controls['telefono2'].setValue(this.datosCabecera[0].Telefono_Movil);
    this.forma.controls['telefono3'].setValue(this.datosCabecera[0].Telefono_Fax);
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
  actualizar(){
    this.modificando = false;
    

    let jsbodyupd = {

      "ID_Proveedor": this.idProv,
      "ID_User": this.auxUserId,        
      "Email": this.forma.controls['email'].value,        
      "Domicilio_envio":this.forma.controls['calleEnv'].value,       
      "ID_Localidad_envio": this.idLocalidad,       
      "Telefono_Oficina":this.forma.controls['telefono1'].value,       
      "Telefono_Alternativo":this.forma.controls['telefono2'].value,       
      "Telefono_Fax":this.forma.controls['telefono3'].value
      }
      
     let jsonbodyupd = JSON.stringify(jsbodyupd);

     this._DatosProveedorService.updCabecera( jsonbodyupd, this.token )
     .subscribe( dataP => {
     console.log(dataP);
     this.respUpdCabecera = dataP;
     this.openSnackBar('Datos Actualizados');
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
            // let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsonbody = JSON.stringify(jsbody);
            // this._DatosProveedorService.login(jsonbody)
            //   .subscribe( dataL => {
                console.log('token invalido');
                // this.loginData = dataL;
                // this.token = this.loginData.dataset[0].jwt;
                // this.getCabecera();
            //  });
            } else {
              this.getFormulario();
              this.getImpuesto();
              if(this.respCabecera.dataset.length>0){
                this.datosCabecera = this.respCabecera.dataset;
                this.loading = false;
                if(this.datosCabecera[0].Domicilio == null){
                  this.direccionFac = null;
                }
                if(this.datosCabecera[0].Domicilio_envio == "") {
                  this.direccionEnv = null;
                } else {
                this.direccionEnv = this.datosCabecera[0].Domicilio_envio +', '+'('+this.datosCabecera[0].Codigo_Postal_envio+')'+', '+this.datosCabecera[0].Ciudad_envio;
                }
                this.telefonos = this.datosCabecera[0].Telefono_Oficina + ' - ' + this.datosCabecera[0].Telefono_Movil;
                
              } else {
                this.datosCabecera = null;

              }

            }
      });

  }

   //TRAE IMPUESTOS
   getImpuesto(){
    let jsbodyCab = {
      "Id_Proveedor": this.idProv//"4081"
    }
    let jsonbodyCab= JSON.stringify(jsbodyCab);
    this._DatosProveedorService.getImpuesto( jsonbodyCab, this.token)
    .subscribe(dataI => {
      console.log(dataI);
      this.respImpuesto = dataI;
      if(this.respImpuesto.dataset.length>0){
        this.datosImpuesto = this.respImpuesto.dataset;
       this.datosImpuesto.forEach( impuesto => {
        switch (impuesto.Situacion) {
          case '1':
            impuesto.Situacion = 'Exento';
            break;
          case '2':
            impuesto.Situacion = 'Inscripto';
          default:
            break;
          case '3':
            impuesto.Situacion = "No inscripto";
            break;  
        }
       })
       
        this.dataSource = new MatTableDataSource(this.datosImpuesto);
      } else {
        this.dataSource = this.respImpuesto.dataset.length;
        console.log(this.dataSource)
      }
    })
   }
  
   //TRAE FORMULARIOS
   getFormulario(){
    let jsbodyCab = {
      "Id_Proveedor": this.idProv//"4081"
    }
    let jsonbodyCab= JSON.stringify(jsbodyCab);
    this._DatosProveedorService.getFormulario( jsonbodyCab, this.token)
    .subscribe(dataF => {
      console.log(dataF);
      this.respFormulario = dataF;
      if(this.respFormulario.dataset.length>0){
        this.datosFormularios = this.respFormulario.dataset;
        this.dataSource2 = new MatTableDataSource(this.datosFormularios);
        this.formDescripcion = this.datosFormularios[0].Descripcion
      } else {
        this.dataSource2 = this.respFormulario.dataset.length;
       
      }
    })
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

  cargarFormulario(formId,formNomId,fechPresen,fechVenci,urlImagen,descrip){
    this.itemDeConsulta = null;
    console.clear();
    let datosModal : {
      modal: string;
      provId: string;
      form: string;
      formNombre: string;
      fechaPresen: string;
      fechaVenci: string;
      url: string;
      descripcion: string
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      modal: 'formulariosModal',
      provId: this.idProv,
      form: formId,
      formNombre: formNomId,
      fechaPresen: fechPresen,
      fechaVenci: fechVenci,
      url: urlImagen,
      descripcion: descrip
    }
    

    console.log('enviando datosModal: ');
    console.log(datosModal);
    
    // datosModal.columnSelection = this.columnSelection;
    console.log('Lista de modales declarados: ', this.ngxSmartModalService.modalStack);
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionFormularios = this.ngxSmartModalService.getModal(datosModal.modal).onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de consulta dinamica: ', modal.getData());

      let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);
      console.log('Respuesta del modal: ', respuesta);

      if (respuesta.estado === 'cancelado'){
        this.openSnackBar('Se canceló la selección');
      }
      else{
        this.ngxSmartModalService.resetModalData('formulariosModal');
        this.getCabecera();
        // this.forma.controls[control].setValue(respuesta.selection[0].cpostal);
        // this.buscarProveedor();
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionFormularios.unsubscribe();
      console.log('se desuscribió al modal de consulta dinamica');
    });
    this.ngxSmartModalService.open(datosModal.modal);
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
  "Impuesto": number,
  "ID_Modelo_impuestos": string,
  "Situacion": string,
  "ID_Impuestos": string,
  "Fecha_inscripcion": string,
  "Codigo_inscripcion": string,
  "Observaciones": string,
  "Exenciones": number,
  "Fecha_Desde_Exenciones": string,
  "Fecha_Hasta_Exenciones": string
}
export interface datosFormularios{
  "ID_Formulario": string,
  "ID_Formulario_nombre": string,
  "Fecha_presentacion": string,
  "Fecha_vencimiento": string,
  "Url": string,
  "Descripcion": string,
}
