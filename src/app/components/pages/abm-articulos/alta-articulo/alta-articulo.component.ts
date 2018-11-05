import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';

const ARTICULOS:any[] = [
  {'nroArticulo':0,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40},
  {'nroArticulo':1,'articulo':'Gomitas Mogul','unidadMedida':'Bolsa(s)','precioUnitario':35},
  {'nroArticulo':2,'articulo':'Chupetines Mr. Pops','unidadMedida':'Bolsa(s)','precioUnitario':50},
  {'nroArticulo':3,'articulo':'Alfajores Terrabusi','unidadMedida':'Caja(s)','precioUnitario':72},
  {'nroArticulo':4,'articulo':'Caramelos Misky','unidadMedida':'Bolsa(s)','precioUnitario':40}
];

@Component({
  selector: 'app-alta-articulo',
  templateUrl: './alta-articulo.component.html',
  styleUrls: ['./alta-articulo.component.css']
})
export class AltaArticuloComponent implements OnInit {

  constArticulos = ARTICULOS;

  forma:FormGroup;
  id:any;

  existe:boolean;

  constructor( private route:ActivatedRoute ) {
    this.forma = new FormGroup({
      'tipo': new FormControl(),
      'nroArticulo': new FormControl('',Validators.required),
      'descripcion': new FormControl(),
      'codigoAlternativo': new FormControl(),
      'codigoBarra': new FormControl(),
      'idGrupo': new FormControl(),
      'idTipoArticulo': new FormControl(),
      'procedencia': new FormControl(),
      'propio': new FormControl(),
      'idMarca': new FormControl(),
      'idCampo1': new FormControl(),
      'idCampo2': new FormControl(),
      'idCampo3': new FormControl(),
      'estado': new FormControl(),
      'categoria_bloqueo': new FormControl(),
      'obsRegistroAutoVta': new FormControl(),
      'obsRegistroAutoCpa': new FormControl(),
      'obsIngresoVta': new FormControl(),
      'obsIngresoCpa': new FormControl(),
      'obsAuditoriaVta': new FormControl(),
      'obsAuditoriaCpa': new FormControl(),
      'obsImprimeVta': new FormControl(),
      'categoriaVenta': new FormControl(),
      'categoriaCompra': new FormControl(),
      'categoriaInventario': new FormControl(),
      //comprasyventas
      'precioUltCompra': new FormControl(),
      'fechaUltCompra': new FormControl(),
      'idMonedaUltCompra': new FormControl(),
      'cantidadOptimaDeCompra': new FormControl(),

      /*'articulo': new FormControl('',Validators.required),
      'unidadMedida': new FormControl('',Validators.required),
      'precioUnitario': new FormControl('',Validators.required)*/
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        for( let aux in this.constArticulos ){
          if (this.id == aux){
            this.existe=true;
            this.forma.controls['nroArticulo'].setValue(this.id);
            /*this.forma.controls['articulo'].setValue(this.constArticulos[this.id].articulo);
            this.forma.controls['unidadMedida'].setValue(this.constArticulos[this.id].unidadMedida);
            this.forma.controls['precioUnitario'].setValue(this.constArticulos[this.id].precioUnitario);*/
          }
        }
        if (this.existe == false){
          console.log('no existe este id!');
          this.forma.controls['nroArticulo'].disable();
          /*this.forma.controls['articulo'].disable();
          this.forma.controls['unidadMedida'].disable();
          this.forma.controls['precioUnitario'].disable();*/
        }
      }

    });

  }

  ngOnInit() {
  }

  guardarArticulo(){
    if( this.id == "nuevo" ){
      // insertando
    }else{
      //actualizando
    }
  }

}
