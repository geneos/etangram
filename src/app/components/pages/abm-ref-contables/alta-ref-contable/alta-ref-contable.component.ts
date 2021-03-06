import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar,MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefContablesService } from '../../../../services/i2t/ref-contables.service';
import { RefContable } from '../../../../interfaces/ref-contable.interface';
import { formatDate } from '@angular/common';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../../services/i2t/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { GruposFinancierosService } from 'src/app/services/i2t/grupos-financieros.service';
import { GrupoFinanciero } from 'src/app/interfaces/grupo-financiero.interface';
import { PlanCuenta } from 'src/app/interfaces/plan-cuenta.interface';
import { PlanCuentasService } from 'src/app/services/i2t/plan-cuentas.service';

// key that is used to access the data in local storage
const TOKEN = '';

var auxGFData, auxCCData;

@Injectable()

@Component({
  selector: 'app-alta-ref-contable',
  templateUrl: './alta-ref-contable.component.html',
  styleUrls: ['./alta-ref-contable.component.css']
})
export class AltaRefContableComponent implements OnInit {

  constRefContables ;
  logueado: boolean = true;
  forma:FormGroup;
  id:any;
  existe:boolean;
  token: string = "a";
  rcData: any;
  gfData: any;
  ccData: any;
  refContable: RefContable;
  grupoFinanciero: GrupoFinanciero;
  cuentaContable: PlanCuenta;
  loginData: any;
  tieneCC: boolean;

  esnuevo:boolean;

  usuario: Usuario;

  loading:boolean;
  auxresp: any;

  today:Date;
  datetime = '';

  suscripcionConsDin: Subscription;
  itemDeConsulta: any;

  constructor(
    private route:ActivatedRoute,
    private _refContablesService:RefContablesService,
    private _usuariosService:UsuariosService,
    private _grupoFinancieroService: GruposFinancierosService,
    private _cuentasContablesService: PlanCuentasService,
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    public snackBar: MatSnackBar,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem('TOKEN')
    if (localStorage.length == 0){
      this.loading = true;
      setTimeout(() => {
        this.logueado = false;     
     //   this.openSnackBar('No ha iniciado sesión')
      }, 1000);  //2s
    } else {
      this.loading = false;
    }
    //this.token = this.storage.get(TOKEN);

    this.loading = true;

    this.forma = new FormGroup({
      'id_ref_contable': new FormControl('',Validators.required),
      'nombre_ref_contable': new FormControl('',Validators.required),
      'cuenta_contable': new FormControl(),
        'nombreCuenta': new FormControl(),
      'grupo_financiero': new FormControl(),
        'nombreGrupo': new FormControl(),
      'tiene_centro_costo': new FormControl('',Validators.required),
      'centro_costo': new FormControl(),
      //'estado_ref_contable': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        this.esnuevo = true;
        this.buscarRefContable(this.id);
      } else {
        this.esnuevo = false;
        this.loading = false;
      }

    });
   }

  getdatetime(){
    this.today = new Date();
    return formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'en-US', '-0300');
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
          } else {
            //error al obtener el id de usuario
            this.openSnackBar("Error. No se pudo obtener el id de usuario.");
          }
      }
    });

    return this.usuario;
  }

  ngOnInit() {
    //console.log();

    //subscribir al cambio de valores en el valor de "tiene centro de costos"
    //necesario para mostrar u ocultar correctamente al iniciar la pantalla
    //todo: investigar una mejor forma
    //posibles: ngZone, ChangeDetectorRef.DetectChanges. Requieren incluir en constructor
    this.forma.get('tiene_centro_costo').valueChanges.subscribe(
      value => {  if (value == 1) {
                    this.tieneCC = true;
                  }
                  else{
                    this.tieneCC = false;
                  }

    });

    this.usuario = this.obtenerIDUsuario()
  }

  buscarRefContable(auxid:string){
    this._refContablesService.getRefContable( this.id, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataRC => {
        console.log(dataRC);
          this.rcData = dataRC;
          //auxProvData = this.rcData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            // this.refContable = null;
            // let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsonbody = JSON.stringify(jsbody);
            // this._refContablesService.login(jsonbody)
            //   .subscribe( dataL => {
            //     console.log(dataL);
            //     this.loginData = dataL;
            //     this.token = this.loginData.dataset[0].jwt;
            //     this.buscarRefContable(auxid);
            //   });
            } else {
              if(this.rcData.dataset.length>0){
                this.refContable = this.rcData.dataset[0];
                this.existe = true;
                if (this.existe == true){
                  //console.log(this.refContable);
                  this.loading = false;

                  this.forma.controls['id_ref_contable'].setValue(this.refContable.id);
                  this.forma.controls['id_ref_contable'].disable();
                  this.forma.controls['nombre_ref_contable'].setValue(this.refContable.name);
                  if (this.refContable.tg01_cuentascontables_id_c !== 'null'){
                    this.forma.controls['cuenta_contable'].setValue(this.refContable.tg01_cuentascontables_id_c);
                  }

                  //this.forma.controls['cuenta_contable'].disable();
                  this.forma.controls['grupo_financiero'].setValue(this.refContable.idgrupofinanciero);
                  //this.forma.controls['grupo_financiero'].disable();
                  this.forma.controls['tiene_centro_costo'].setValue(this.refContable.tienectocosto);
                  this.forma.controls['centro_costo'].setValue(this.refContable.tg01_centrocosto_id_c);
                  //this.forma.controls['centro_costo'].disable();
                  //this.forma.controls['estado_ref_contable'].setValue(this.refContable.estado);
                  
                  setTimeout(() => {
                    this.buscarGrupo();
                    this.buscarCuenta();
                  });
                }
              } else {
                this.refContable = null;
                this.existe = false;
                if (this.existe == false){
                  console.log('no existe este id!');
                  this.forma.controls['id_ref_contable'].disable();
                  this.forma.controls['nombre_ref_contable'].disable();
                  this.forma.controls['cuenta_contable'].disable();
                  this.forma.controls['grupo_financiero'].disable();
                  this.forma.controls['tiene_centro_costo'].disable();
                  this.forma.controls['centro_costo'].disable();
                  //this.forma.controls['estado_ref_contable'].disable();
                }
              }
            }

      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  eliminarRefContables(){
    var d = new Date();
    var d2;
    if( this.refContable.date_entered != null){
      d2 = (this.refContable.date_entered);
      d2 = d2.substring(0, 10);
    }

    let usuarioActual: any = this.obtenerIDUsuario().id;
    let jsbody = {
      "id":this.refContable.id,
      "name":this.refContable.name,
      /* "date_entered":d2,
      "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), */
      "date_entered":this.refContable.date_entered,
      "date_modified":this.getdatetime(),
      "modified_user_id":usuarioActual,//hardcoded
      "created_by":this.refContable.created_by,//hardcoded
      "description":null,//hardcoded
      "deleted":1,//hardcoded
      "assigned_user_id":1,//hardcoded
      "tienectocosto ":this.refContable.tienectocosto,
      "numero":this.refContable.numero,
      "idgrupofinanciero":this.refContable.idgrupofinanciero,//hardcoded POR AHORA
      "tg01_centrocosto_id_c":this.refContable.tg01_centrocosto_id_c,//hardcoded POR AHORA
      "idreferenciacontable":this.refContable.idreferenciacontable,
      "estado":0,//debe ser 0='Inactivo' al eliminar
      "tg01_grupofinanciero_id_c":this.refContable.tg01_grupofinanciero_id_c,//hardcoded POR AHORA
      "tg01_cuentascontables_id_c":this.refContable.tg01_cuentascontables_id_c
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._refContablesService.putRefContable( this.refContable.id,jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp);
        this.auxresp = resp;
        if(this.auxresp.returnset[0].RCode=="-6003"){
          //token invalido
          //this.refContable = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._refContablesService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.guardarRefContables();
            });
          } else {
            if (this.auxresp.returnset[0].RCode=="1"){
              // baja ok
              this.openSnackBar("Baja realizada con éxito.");
              this.router.navigate(['/ref-contables']);
            } else {
              //error en la baja
              this.openSnackBar("Error. Baja no permitida.");
            }
        }
      });
  }

  guardarRefContables(){
    if( this.id == "nuevo" ){
      // insertando
      var d = new Date();

      let usuarioActual: any = this.obtenerIDUsuario().id;
      let jsbody = {
        "id":this.forma.controls['id_ref_contable'].value,
        "name":this.forma.controls['nombre_ref_contable'].value,
        /* "date_entered":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), */
        "date_entered":this.getdatetime(),
        "date_modified":this.getdatetime(),
        "modified_user_id":usuarioActual,//hardcoded
        "created_by":usuarioActual,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
        "tienectocosto ":this.forma.controls['tiene_centro_costo'].value,
        "numero":this.forma.controls['id_ref_contable'].value,
        "idgrupofinanciero":this.forma.controls['grupo_financiero'].value,//hardcoded POR AHORA
        "tg01_centrocosto_id_c":this.forma.controls['centro_costo'].value,//hardcoded POR AHORA
        "idreferenciacontable":this.forma.controls['id_ref_contable'].value,
        "estado":1,//debe ser 1='Activo' al crearse
        "tg01_grupofinanciero_id_c":this.forma.controls['grupo_financiero'].value,//hardcoded POR AHORA
        "tg01_cuentascontables_id_c":this.forma.controls['cuenta_contable'].value
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._refContablesService.postRefContable( jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.refContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarRefContables();
              });
            } else {
              console.log(this.auxresp);
              // si viene codigo -2001, es xq id duplicado.
              if (this.auxresp.returnset[0].RCode=="1"){
                // carga ok
                this.openSnackBar("Alta Correcta.");
                this.router.navigate(['/ref-contables', this.forma.controls['id_ref_contable'].value]);
              } else {
                //error al cargar
                this.openSnackBar("Error. Alta no permitida.");
              }
          }
        });
    }else{
      //actualizando
      var d = new Date();
      var d2;
      if( this.refContable.date_entered != null){
        d2 = (this.refContable.date_entered);
        d2 = d2.substring(0, 10);
      }
      let usuarioActual: any = this.obtenerIDUsuario().id;
      //
      console.log('recibido: ');
      console.log(usuarioActual);
      //
      let jsbody = {
        "id":this.forma.controls['id_ref_contable'].value,
        "name":this.forma.controls['nombre_ref_contable'].value,
        /* "date_entered":d2,
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), */
        "date_entered":this.refContable.date_entered,
        "date_modified":this.getdatetime(),
        "modified_user_id":usuarioActual,//hardcoded
        "created_by":this.refContable.created_by,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
        "tienectocosto ":this.forma.controls['tiene_centro_costo'].value,
        "numero":this.forma.controls['id_ref_contable'].value,
        "idgrupofinanciero":this.forma.controls['grupo_financiero'].value,//hardcoded POR AHORA
        "tg01_centrocosto_id_c":this.forma.controls['centro_costo'].value,//hardcoded POR AHORA
        "idreferenciacontable":this.forma.controls['id_ref_contable'].value,
        "estado":1,//hardcoded REVISAR
        "tg01_grupofinanciero_id_c":this.forma.controls['grupo_financiero'].value,//hardcoded POR AHORA
        "tg01_cuentascontables_id_c":this.forma.controls['cuenta_contable'].value
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._refContablesService.putRefContable( this.refContable.id,jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.refContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarRefContables();
              });
            } else {
              if (this.auxresp.returnset[0].RCode=="1"){
                // modif ok
                this.openSnackBar("Modificación realizada con éxito.");
              } else {
                //error al cargar
                this.openSnackBar("Error. Modificación no permitida.");
              }
          }
        });
    }
  }

  // abrirConsulta(consulta: string, control: string){
    //usa el mismo formato que los get de formcontrol: ej ['coleccion', indice_en_array...]
  abrirConsulta(consulta: string, ubicacion: any[], controlID: string, controlDesc?: string, funcion?: string, param?: any){
    this.itemDeConsulta = null;
    console.log(' recibido por abrirconsulta: ', consulta, controlID, controlDesc, ubicacion, funcion, param);
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
    let atributoDesc:  string = 'name';
    switch (consulta) {
      case 'tg01_cuentascontables':
        atributoAUsar = 'name';
        break;
      case 'tg01_grupofinanciero':
        atributoAUsar = 'codigo';
        // atributoDesc = 'Nombre';
        break;
      default:
        atributoAUsar = 'id';
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
        setTimeout(() => {
          // this.forma.controls[control].setValue(respuesta.selection[0][atributoAUsar]);
          // ==>
          //obtener la base sobre la que se buscará los FormControl
          let fg: FormGroup;
          if (ubicacion.length == 0){
            fg = this.forma;
          }
          else{
            fg = this.forma.get(ubicacion) as FormGroup;
          }

          //escribir el valor en el primer control, para el id
          fg.controls[controlID].setValue(respuesta.selection[0][atributoAUsar]);

          //si hay que guardar descripción:
          if (controlDesc != null){
            if (respuesta.selection[0][atributoDesc] != null){
              fg.controls[controlDesc].setValue(respuesta.selection[0][atributoDesc]);
            }
            else{
              fg.controls[controlDesc].setValue('');
              console.log('Valor de ' + controlDesc + ' vaciado, no se encontró ' + atributoDesc + ' en la seleccion');
            }
          }

          //ejecutar función
          if (funcion != null){
            console.log('todo llamado a funcion');
            
            //lo siguiente funciona:
            // this[funcion](param);
          }

          // this['proveedor'] = null;
          // this['resultado'+control] = respuesta.selection[0];
          
          //todo 
          //disparar detección de cambios, cada parte es un intento distinto
          // this.proveedor = respuesta.selection[0];
          
          // setTimeout(() => this.ref.detectChanges(), 1000);
          // this.ref.markForCheck();
        
          // this.forma.controls['artDeProveedor'].updateValueAndValidity();

          // console.log('seleccionado: ',this.resultadoidGrupo, this['resultado'+control]);
        });

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

  buscarGrupo(){
    this._grupoFinancieroService.getGrupoFinanciero(this.forma.controls['grupo_financiero'].value, this.token)
      .subscribe( data => {
          this.gfData = data;
          auxGFData = this.gfData.dataset.length;
          if(this.gfData.returnset[0].RCode=="-6003"){
            //token invalido
            this.grupoFinanciero = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('buscar grupo para base con :', this.forma.controls['grupo_financiero'].value)
            console.log('resultado buscar grupo para base ', this.gfData)

          if(this.gfData.dataset.length>0){
            this.grupoFinanciero = this.gfData.dataset[0];
            
            //rellenar descripcion
            this.forma.controls['nombreGrupo'].setValue(this.grupoFinanciero.name);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name); */
          } else {
            this.grupoFinanciero = null;
            
            //vaciar descripcion
            this.forma.controls['nombreGrupo'].setValue(null);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(''); */
          }
        }
      });
  }

  buscarCuenta(){
    this._cuentasContablesService.getPlanDeCuentas(this.forma.controls['cuenta_contable'].value, this.token)
      .subscribe( data => {
          this.ccData = data;
          auxGFData = this.ccData.dataset.length;
          if(this.ccData.returnset[0].RCode=="-6003"){
            //token invalido
            this.cuentaContable = null;
            this.forma.disable();
            this.openSnackBar('Sesión expirada.')
          } else {
            console.log('buscar cuenta contable para base con :', this.forma.controls['cuenta_contable'].value)
            console.log('resultado buscar cuenta contable para base ', this.ccData)

          if(this.ccData.dataset.length>0){
            this.cuentaContable = this.ccData.dataset[0];
            
            //rellenar descripcion
            this.forma.controls['nombreCuenta'].setValue(this.cuentaContable.name);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(this.proveedor.name); */
          } else {
            this.cuentaContable = null;
            
            //vaciar descripcion
            this.forma.controls['nombreCuenta'].setValue(null);
            /* ((this.forma.controls.articulosHijos as FormArray).
              controls[indice] as FormGroup).
                controls['artDesc'].setValue(''); */
          }
        }
      });
  }
}
