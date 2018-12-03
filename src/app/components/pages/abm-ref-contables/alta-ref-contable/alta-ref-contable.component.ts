import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar,MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefContablesService } from '../../../../services/i2t/ref-contables.service';
import { RefContable } from '../../../../interfaces/ref-contable.interface';
import { formatDate } from '@angular/common';
import { UsuariosService } from '../../../../services/i2t/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';


@Component({
  selector: 'app-alta-ref-contable',
  templateUrl: './alta-ref-contable.component.html',
  styleUrls: ['./alta-ref-contable.component.css']
})
export class AltaRefContableComponent implements OnInit {

  constRefContables ;

  forma:FormGroup;
  id:any;
  existe:boolean;
  token: string = "a";
  rcData: any;
  refContable: RefContable;
  loginData: any;
  tieneCC: boolean;
<<<<<<< HEAD
<<<<<<< HEAD
  esnuevo:boolean;
=======
  usuario: Usuario;
>>>>>>> 98c6ebaf24a2c3694ce384f613875e5f4d0b461d
=======
  usuario: Usuario;
>>>>>>> 98c6ebaf24a2c3694ce384f613875e5f4d0b461d

  loading:boolean;
  auxresp: any;
  
  today:Date;
  datetime = '';

  constructor(
    private route:ActivatedRoute,
    private _refContablesService:RefContablesService,
    private _usuariosService:UsuariosService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.loading = true;

    this.forma = new FormGroup({
      'id_ref_contable': new FormControl('',Validators.required),
      'nombre_ref_contable': new FormControl('',Validators.required),
      'cuenta_contable': new FormControl(),
      'grupo_financiero': new FormControl(),
      'tiene_centro_costo': new FormControl('',Validators.required),
      'centro_costo': new FormControl(),
      'estado_ref_contable': new FormControl('',Validators.required),
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
    this._usuariosService.getUsuarioPorUsername('morecchia', this.token)
    .subscribe( resp => {
      //console.log(resp);
      this.auxresp = resp;
      console.log(this.auxresp);
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
            this.obtenerIDUsuario();
          });
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
    this._refContablesService.getRefContable( auxid, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataRC => {
        console.log(dataRC);
          this.rcData = dataRC;
          //auxProvData = this.rcData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContable = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContable(auxid);
              });
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
                  this.forma.controls['cuenta_contable'].setValue(this.refContable.tg01_cuentascontables_id_c);
                  //this.forma.controls['cuenta_contable'].disable();
                  this.forma.controls['grupo_financiero'].setValue(this.refContable.idgrupofinanciero);
                  //this.forma.controls['grupo_financiero'].disable();
                  this.forma.controls['tiene_centro_costo'].setValue(this.refContable.tienectocosto);
                  this.forma.controls['centro_costo'].setValue(this.refContable.tg01_centrocosto_id_c);
                  //this.forma.controls['centro_costo'].disable();
                  this.forma.controls['estado_ref_contable'].setValue(this.refContable.estado);
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
                  this.forma.controls['estado_ref_contable'].disable();
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
        "estado":this.forma.controls['estado_ref_contable'].value,
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

}
