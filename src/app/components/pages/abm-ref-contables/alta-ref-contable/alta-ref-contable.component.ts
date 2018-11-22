import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefContablesService } from '../../../../services/i2t/ref-contables.service';
import { RefContable } from '../../../../interfaces/ref-contable.interface';

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

  loading:boolean;

  constructor( private route:ActivatedRoute , private _refContablesService:RefContablesService ) {
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
        this.buscarRefContable(this.id);
      } else {
        this.loading = false;
      }

    });
   }

  ngOnInit() {
    //console.log();
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
                  this.forma.controls['nombre_ref_contable'].setValue(this.refContable.name);
                  //this.forma.controls['cuenta_contable'].disable();
                  //this.forma.controls['grupo_financiero'].disable();
                  this.forma.controls['tiene_centro_costo'].setValue(this.refContable.tienectocosto);
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

  guardarRefContables(){
    if( this.id == "nuevo" ){
      // insertando
      let jsbody = {
        "id":this.forma.controls['id_ref_contable'].value,
        "name":this.forma.controls['nombre_ref_contable'].value,
        "date_entered":"2018-11-22",//hardcoded
        "date_modified":"2018-11-22",//hardcoded
        "modified_user_id":1,//hardcoded
        "created_by":1,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
        "tienectocosto ":"0",//this.forma.controls['tiene_centro_costo'].value,
        "numero":this.forma.controls['id_ref_contable'].value,
        "idgrupofinanciero":1,//hardcoded POR AHORA
        "tg01_centrocosto_id_c":null,//hardcoded POR AHORA
        "idreferenciacontable":this.forma.controls['id_ref_contable'].value,
        "estado":0,//this.forma.controls['estado_ref_contable'].value,
        "tg01_grupofinanciero_id_c":null//hardcoded POR AHORA
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._refContablesService.postRefContable( jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          if(resp.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContable = null;
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
              console.log(resp);
              //console.log(resp.returnset[0].RId);
              //this.respCabecera = resp;
              //this.cabeceraId = this.respCabecera.returnset[0].RId;
          }
        });
    }else{
      //actualizando
    }
  }

}
