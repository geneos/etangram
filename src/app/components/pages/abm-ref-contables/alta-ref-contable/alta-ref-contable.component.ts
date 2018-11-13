import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const REFCONTABLES:any[] = [
  {'codigo':0,'nombre':'TEST.REF.CONTABLE'},
  {'codigo':1,'nombre':'REMUNER.PLANTA.PERMANENTE'}
];

@Component({
  selector: 'app-alta-ref-contable',
  templateUrl: './alta-ref-contable.component.html',
  styleUrls: ['./alta-ref-contable.component.css']
})
export class AltaRefContableComponent implements OnInit {

  constRefContables = REFCONTABLES;

  forma:FormGroup;
  id:any;
  existe:boolean;

  constructor( private route:ActivatedRoute ) {
    this.forma = new FormGroup({
      'id_ref_contable': new FormControl('',Validators.required),
      'nombre_ref_contable': new FormControl('',Validators.required),
      'cuenta_contable': new FormControl('',Validators.required),
      'grupo_financiero': new FormControl('',Validators.required),
      'tiene_centro_costo': new FormControl('',Validators.required),
      'centro_costo': new FormControl(),
      'estado_ref_contable': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constRefContables ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['id_ref_contable'].setValue(this.id);
            console.log(this.constRefContables[this.id].nombre);
            this.forma.controls['nombre_ref_contable'].setValue(this.constRefContables[this.id].nombre);
          }
        }
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

    });
   }

  ngOnInit() {
    //console.log();
  }

  guardarRefContables(){
    if( this.id == "nuevo" ){
      // insertando
    }else{
      //actualizando
    }
  }

}
