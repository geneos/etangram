import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import { ComprobantesService } from '../../../services/i2t/comprobantes.service';
import { VisorContableService } from 'src/app/services/i2t/visor-contable.service';

@Component({
  selector: 'app-visor-contable',
  templateUrl: './visor-contable.component.html',
  styleUrls: ['./visor-contable.component.css']
})
export class VisorContableComponent implements OnInit {
  idParam : string;
  idLinea : string;
  ocultarCentros : boolean = true;
  ocultarComprobante : boolean = true;

  comprobante : any;

  constructor(
    private comprobantesService: ComprobantesService,
    private visorContableService: VisorContableService,
    private route : ActivatedRoute,
    private _snackBar: MatSnackBar) {

    this.route.params.subscribe(parametros => {
      this.idParam = parametros['id'];
    });

    this.route.queryParamMap.subscribe(queryParams => {
      let flag = queryParams.get("flag");
      this.ocultarComprobante =  (flag && flag === "true") ? false : true;
    })

    this.comprobante = {
      Comprobante: "",
      subdiario: "",
      Fecha: "",
      Total: 0
    }
  }

  ngOnInit() {
    this.comprobantesService.getComprobante(this.idParam)
      .subscribe(data => {
        this.comprobante = data;
      })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  cancelar() : void {}

  guardar() : void {}

  rechazar() : void {}

  autorizar() : void {
    this.visorContableService.autorizarContabilidad(this.comprobante.ID_Comprobante)
      .subscribe(data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Error")
        }
      })
  }

  seleccionarLinea(id : string) : void {
    this.idLinea = id;
    this.ocultarCentros = !this.ocultarCentros;
  }

  mostrarComprobante() : void {
    alert("Esto deberia ser el comprobante")
  }

}
