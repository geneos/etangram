import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource, MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Comprobante } from '../../../interfaces/comprobante.interface';
import { ImpuestoComprobante } from '../../../interfaces/impuesto-comprobante.interface';
import { Impuesto } from 'src/app/interfaces/impuesto.interface';

import { ComprobantesService } from '../../../services/i2t/comprobantes.service';

import { DialogoConfComponent } from '../../shared/modals/dialogo-conf/dialogo-conf.component';

@Component({
  selector: 'app-visor-presupuestario',
  templateUrl: './visor-presupuestario.component.html',
  styleUrls: ['./visor-presupuestario.component.css']
})
export class VisorPresupuestarioComponent implements OnInit {
  columnsToDisplay = ['expediente', 'tramite', 'fecha', 'partida', 'descripcion', 'imputado', 'estado', 'edit']

  rowID: number = 0;
  total: number = 0;
  diferencia: number = 0;

  idParam: string;
  comprobante: any;
  ocultarComprobante: boolean = false;
  
  presupuestosComprobante: any[];
  _presupuestosComprobante = new MatTableDataSource(this.presupuestosComprobante);

  constructor(
    private comprobantesService: ComprobantesService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

    this.route.params.subscribe(parametros => {
      this.idParam = parametros['id'];
    });

    this.route.queryParamMap.subscribe(queryParams => {
      let flag = queryParams.get("flag");
      this.ocultarComprobante =  (flag && flag === "true") ? false : true;
    });

    this.comprobante = {
      Comprobante: "",
      Fecha: "",
      RazonSocial_Referente: "",
      Total: 0
    }
  }

  ngOnInit() {
    this.comprobantesService.getComprobante(this.idParam).subscribe(data => {
      console.log("Visor - Comprobante:", data);
      this.comprobante = data;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  agregarLinea() : void {}

  guardarLinea(rowId : string) : void {}

  editarLinea(rowId : string) : void {}

  borrarLinea(rowId : string) : void {}

  autorizarLinea(rowId : string) : void {}

  guardar() : void {}

  cancelar() : void {}

  autorizar() : void {}

}
