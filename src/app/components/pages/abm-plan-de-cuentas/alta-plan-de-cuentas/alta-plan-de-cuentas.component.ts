import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar,MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatPaginator } from '@angular/material';
import { PlanCuentasService } from "../../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../../interfaces/plan-cuenta.interface";
import { RefContable } from 'src/app/interfaces/ref-contable.interface';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-alta-plan-de-cuentas',
  templateUrl: './alta-plan-de-cuentas.component.html',
  styleUrls: ['./alta-plan-de-cuentas.component.css']
})
export class AltaPlanDeCuentasComponent implements OnInit {

  constPlanesCuentas :PlanCuenta[];

  forma:FormGroup;
  id:any;
  existe:boolean;
  token: string = "a";
  pcData: any;
  planDeCuentas: PlanCuenta;
  loginData: any;

  loading:boolean;
  auxresp: any;

  //para la lista de referencias contables
  refContablesAll:RefContable[];
  constRefContables = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableRefContables') table: MatTable<any>;

  selection = new SelectionModel(true, []);
  //

  constructor(
    private route:ActivatedRoute,
    private _PlanCuentasService:PlanCuentasService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.loading = true;

    this.forma = new FormGroup({
      'id': new FormControl('',Validators.required),
      'cuentacontable': new FormControl('',Validators.required),
      'name': new FormControl('',Validators.required),
      'imputable': new FormControl('',Validators.required),
      'patrimonial': new FormControl('',Validators.required),
      'nomenclador': new FormControl('',Validators.required),
      'nomencladorpadre': new FormControl(),
      'orden': new FormControl('',Validators.required),
      'estado': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        this.buscarPlanDeCuentas(this.id);
      } else {
        this.loading = false;
      }

    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constRefContables.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constRefContables.data.forEach(row => this.selection.select(row));
  }

  buscarPlanDeCuentas(auxid:string){
    this._PlanCuentasService.getPlanDeCuentas( auxid, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataPC => {
        console.log(dataPC);
          this.pcData = dataPC;
          //auxProvData = this.pcData.dataset.length;
          if(this.pcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPlanDeCuentas(auxid);
              });
            } else {
              if(this.pcData.dataset.length>0){
                this.planDeCuentas = this.pcData.dataset[0];
                this.existe = true;
                if (this.existe == true){
                  //console.log(this.planDeCuentas);
                  this.loading = false;

                  
                  //this.forma.controls['id'].setValue(this.id);
                  //console.log(this.constPlanesCuentas[this.id]);
                  this.forma.controls['cuentacontable'].setValue(this.planDeCuentas.cuentacontable);
                  this.forma.controls['name'].setValue(this.planDeCuentas.name);                  
                  this.forma.controls['nomenclador'].setValue(this.planDeCuentas.nomenclador);
                  this.forma.controls['nomencladorpadre'].setValue(this.planDeCuentas.nomencladorpadre);
                  this.forma.controls['orden'].setValue(this.planDeCuentas.orden);
                  this.forma.controls['imputable'].setValue(this.planDeCuentas.imputable.toString());           
                  this.forma.controls['patrimonial'].setValue(this.planDeCuentas.patrimonial.toString());
                  this.forma.controls['estado'].setValue(this.planDeCuentas.estado.toString());
                }
              } else {
                this.planDeCuentas = null;
                this.existe = false;
                if (this.existe == false){
                  console.log('no existe este id!');
                  this.forma.controls['cuentacontable'].disable();
                  this.forma.controls['name'].disable();
                  this.forma.controls['imputable'].disable();
                  this.forma.controls['patrimonial'].disable();
                  this.forma.controls['nomenclador'].disable();
                  this.forma.controls['nomencladorpadre'].disable();
                  this.forma.controls['orden'].disable();
                  this.forma.controls['estado'].disable();
                }
              }
            }

      });
  }

/*     this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constPlanesCuentas ){
          if (this.id == aux){
            this.existe=true;
            //this.forma.controls['id'].setValue(this.id);
            console.log(this.constPlanesCuentas[this.id]);
            
            this.forma.controls['cuenta_contable'].setValue(this.constPlanesCuentas[this.id].cuenta_contable);
            this.forma.controls['nombre'].setValue(this.constPlanesCuentas[this.id].nombre);
/*             this.forma.controls['imputable'].setValue(this.constPlanesCuentas[this.id].imputable);           
            this.forma.controls['patrimonial'].setValue(this.constPlanesCuentas[this.id].patrimonial);
            this.forma.controls['nomenclador'].setValue(this.constPlanesCuentas[this.id].nomenclador); *
            
            this.forma.controls['imputable'].setValue(this.constPlanesCuentas[this.id].imputable.toString());           
            this.forma.controls['patrimonial'].setValue(this.constPlanesCuentas[this.id].patrimonial.toString());
            this.forma.controls['nomenclador'].setValue(this.constPlanesCuentas[this.id].nomenclador);
            
            this.forma.controls['nomenclador_padre'].setValue(this.constPlanesCuentas[this.id].nomenclador_padre);
            this.forma.controls['orden'].setValue(this.constPlanesCuentas[this.id].orden);
            this.forma.controls['estado'].setValue(this.constPlanesCuentas[this.id].estado.toString());
            // this.constPlanesCuentas[this.id].patrimonial.toString();
            // this.forma.setValue(this.constPlanesCuentas[this.id]);
            // this.forma.controls['patrimonial'].setValue("1");
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['cuenta_contable'].disable();
          this.forma.controls['nombre'].disable();
          this.forma.controls['imputable'].disable();
          this.forma.controls['patrimonial'].disable();
          this.forma.controls['nomenclador'].disable();
          this.forma.controls['nomenclador_padre'].disable();
          this.forma.controls['orden'].disable();
          this.forma.controls['estado'].disable();
        }
      }

    });
   } */

   /* <!-- 
   id                  if:string;
   Nombre              nombre:string;
   Cuenta Contable     cuenta_contable:string;
   Nomenclador         nomenclador:string;
   Nomenclador Padre   nomenclador_padre:string;
   Orden               orden:string;
   Estado              estado:number;

   Imputable?          imputable:number;
   Patrimonial?        patrimonial:number;
   --> */

  ngOnInit() {
    //console.log();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  eliminarPlanDeCuentas(){
    var d = new Date();
    var d2;
    if( this.planDeCuentas.date_entered != null){
      d2 = (this.planDeCuentas.date_entered);
      d2 = d2.substring(0, 10);
    }
    //todo cambiar por lo real de plan de cuentas
    let jsbody = {
      "id":this.planDeCuentas.id,
      "name":this.planDeCuentas.name,
      "cuentacontable":this.planDeCuentas.cuentacontable,
      "date_entered":d2,
      "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
      "modified_user_id":1,//hardcoded
      "created_by":1,//hardcoded
      "description":null,//hardcoded
      "deleted":1,//hardcoded
      "assigned_user_id":1,//hardcoded
      "estado":this.planDeCuentas.estado
      /* ,
      "patrimonial":??,
      "imputable":??,
      "estado":??, */
    };
/*
id: string; //36
cuentacontable:string;//25
name:string;//255
nomenclador:string;//25
nomencladorpadre:string;//25
orden:number;
description:string;
imputable:string;//100
patrimonial:string;//100
estado:string;//100
deleted:number;
assigned_user_id:string;//36
date_entered:datetime;
//created_by:string;//36
date_modified:datetime;
//modified_user_id:string;//36
*/

    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._PlanCuentasService.putPlanDeCuentas( this.planDeCuentas.id,jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp);
        this.auxresp = resp;
        if(this.auxresp.returnset[0].RCode=="-6003"){
          //token invalido
          //this.planDeCuentas = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._PlanCuentasService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.guardarPlanDeCuentas();
            });
          } else {
            if (this.auxresp.returnset[0].RCode=="1"){
              // baja ok
              this.openSnackBar("Baja realizada con éxito.");
              this.router.navigate(['/plan-cuentas']);
            } else {
              //error en la baja
              this.openSnackBar("Error. Baja no permitida.");
            }
        }
      });
  }

  guardarPlanDeCuentas(){
    if( this.id == "nuevo" ){
      // insertando
    //todo cambiar por lo real de plan de cuentas
      var d = new Date();
      //todo corregir desde acá
      let jsbody = {
        "id":this.forma.controls['id_ref_contable'].value,
        "name":this.forma.controls['nombre_ref_contable'].value,
        "date_entered":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id":1,//hardcoded
        "created_by":1,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
        "tienectocosto ":this.forma.controls['tiene_centro_costo'].value,
        "numero":this.forma.controls['id_ref_contable'].value,
        "idgrupofinanciero":1,//hardcoded POR AHORA
        "tg01_centrocosto_id_c":null,//hardcoded POR AHORA
        "idreferenciacontable":this.forma.controls['id_ref_contable'].value,
        "estado":this.forma.controls['estado_ref_contable'].value,
        "tg01_grupofinanciero_id_c":null//hardcoded POR AHORA
      };

      /*
      id: string; //36
      cuentacontable:string;//25
      name:string;//255
      nomenclador:string;//25
      nomencladorpadre:string;//25
      orden:number;
      description:string;
      imputable:string;//100
      patrimonial:string;//100
      estado:string;//100
      deleted:number;
      assigned_user_id:string;//36
      date_entered:datetime;
      //created_by:string;//36
      date_modified:datetime;
      //modified_user_id:string;//36
      */
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._PlanCuentasService.postPlanDeCuentas( jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarPlanDeCuentas();
              });
            } else {
              console.log(this.auxresp);
              // si viene codigo -2001, es xq id duplicado.
              if (this.auxresp.returnset[0].RCode=="1"){
                // carga ok
                this.openSnackBar("Alta Correcta.");
                //todo cambiar por lo real de plan de cuentas
                this.router.navigate(['/plan-cuentas', this.forma.controls['id_ref_contable'].value]);
              } else {
                //error al cargar
                this.openSnackBar("Error. Alta no permitida.");
              }
          }
        });
    }else{
      //actualizando
    //todo cambiar por lo real de plan de cuentas
      var d = new Date();
      var d2;
      if( this.planDeCuentas.date_entered != null){
        d2 = (this.planDeCuentas.date_entered);
        d2 = d2.substring(0, 10);
      }
      let jsbody = {
        "id":this.forma.controls['id_ref_contable'].value,
        "name":this.forma.controls['nombre_ref_contable'].value,
        "date_entered":d2,
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id":1,//hardcoded
        "created_by":1,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
        "tienectocosto ":this.forma.controls['tiene_centro_costo'].value,
        "numero":this.forma.controls['id_ref_contable'].value,
        "idgrupofinanciero":1,//hardcoded POR AHORA
        "tg01_centrocosto_id_c":null,//hardcoded POR AHORA
        "idreferenciacontable":this.forma.controls['id_ref_contable'].value,
        "estado":this.forma.controls['estado_ref_contable'].value,
        "tg01_grupofinanciero_id_c":null//hardcoded POR AHORA
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._PlanCuentasService.putPlanDeCuentas( this.planDeCuentas.id,jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarPlanDeCuentas();
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
