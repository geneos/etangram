import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const PLANCUENTAS: any[] = [
  {
    id: '1',
    nombre: 'Activo Corriente',
    cuenta_contable: '1.11.0.0.0000',
    nomenclador:'1.11',
    nomenclador_padre:'1',
    orden:'0',
    estado:1,
    imputable:1,
    patrimonial:1
  },
  {
    id: '2',
    nombre: 'Recaudaciones a depositar',
    cuenta_contable: '1.11.11.11.1001',
    nomenclador:'1.11.11.11.1001',
    nomenclador_padre:'1.11.11.11',
    orden:'1001',
    estado:0,
    imputable:1,
    patrimonial:0
  }
];
///////
const listOfObjs = [{ texto: 'No', id: '0'}, { texto: 'Si', id: '1'}];

@Component({
  selector: 'app-alta-plan-de-cuentas',
  templateUrl: './alta-plan-de-cuentas.component.html',
  styleUrls: ['./alta-plan-de-cuentas.component.css']
})
export class AltaPlanDeCuentasComponent implements OnInit {

  constPlanesCuentas = PLANCUENTAS;

  forma:FormGroup;
  id:any;
  existe:boolean;

  constructor( private route:ActivatedRoute ) {
    this.forma = new FormGroup({
      'id': new FormControl('',Validators.required),
      'cuenta_contable': new FormControl('',Validators.required),
      'nombre': new FormControl('',Validators.required),
      'imputable': new FormControl('',Validators.required),
      'patrimonial': new FormControl('',Validators.required),
      'nomenclador': new FormControl('',Validators.required),
      'nomenclador_padre': new FormControl(),
      'orden': new FormControl('',Validators.required),
      'estado': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
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
            this.forma.controls['nomenclador'].setValue(this.constPlanesCuentas[this.id].nomenclador); */
            
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
   }

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

  guardarPlanCuentas(){
    if( this.id == "nuevo" ){
      // insertando
    }else{
      //actualizando
    }
  }

  //todo borrar
  /* compareObjectsPat(o1: any, o2: any): boolean {
    console.log(o1);
    console.log(o2);
    console.log(o1.nombre === o2.nombre && o1.id === o2.id);
    return o1.nombre === o2.nombre && o1.id === o2.id;
  }

  compareObjectsImp(o1: any, o2: any): boolean {
    return o1.nombre === o2.nombre && o1.id === o2.id;
  }
  compareObjectsEst(o1: any, o2: any): boolean {
    return o1.nombre === o2.nombre && o1.id === o2.id;
  } 
  */
  //hasta acá
}
