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
      'codigo': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constRefContables ){
          if (this.id == aux){
            this.existe=true;
            //this.forma.controls['numero'].setValue(this.id);
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          //this.forma.controls['numero'].disable();
        }
      }

    });
   }

  ngOnInit() {
  }

  guardarRefContables(){
    if( this.id == "nuevo" ){
      // insertando
    }else{
      //actualizando
    }
  }

}
