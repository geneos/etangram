import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  constProveedores = PROVEEDORES;

  forma:FormGroup;
  id:any;

  existe:boolean;

  constructor( private route:ActivatedRoute ) {
    this.forma = new FormGroup({
      'tipoReferente': new FormControl('',Validators.required),
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
      'envCalle': new FormControl('',Validators.required),
      'envCiudad': new FormControl('',Validators.required),
      'envProvincia': new FormControl('',Validators.required),
      'envCodigoPostal': new FormControl('',Validators.required),
      'envPais': new FormControl('',Validators.required),
      'telefono1': new FormControl('',Validators.required),
      'telefono2': new FormControl('',Validators.required),
      'telefono3': new FormControl('',Validators.required),
      'email': new FormControl('',Validators.required),
      'observaciones': new FormControl('',Validators.required)
    });

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
  }

  guardarProveedor(){
    if( this.id == "nuevo" ){
      // insertando
    }else{
      //actualizando
    }
  }

}
