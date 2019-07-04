import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Comprobante } from '../../../interfaces/comprobante.interface';
import { ImpuestoComprobante } from '../../../interfaces/impuesto-comprobante.interface';
import { Impuesto } from 'src/app/interfaces/impuesto.interface';

import { ComprobantesService } from '../../../services/i2t/comprobantes.service';

import { DialogoConfComponent } from '../../shared/modals/dialogo-conf/dialogo-conf.component'
import { VisorImpositivoService } from 'src/app/services/i2t/visor-impositivo.service';

@Component({
  selector: 'app-visor-impositivo',
  templateUrl: './visor-impositivo.component.html',
  styleUrls: ['./visor-impositivo.component.css']
})
export class VisorImpositivoComponent implements OnInit {
  columnsToDisplay = ['cuenta', 'descripcion', 'impuesto', 'imponible', 'importe', 'observaciones', 'edit']

  ocultarComprobante : boolean = true;

  idParam : string;
  comprobante : any = {};

  constructor(
      private comprobantesService: ComprobantesService,
      private visorImpositivoService: VisorImpositivoService,
      private route : ActivatedRoute,
      private _snackBar: MatSnackBar) {

    this.route.params.subscribe(parametros => {
      this.idParam = parametros['id'];
    });

    this.route.queryParamMap.subscribe(queryParams => {
      let flag = queryParams.get("flag");
      this.ocultarComprobante =  (flag && flag === "true") ? false : true;
    })
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

  autorizar() : void {
    this.visorImpositivoService.autorizarLineaImpositiva(this.comprobante.ID_Comprobante).subscribe(data => {
      if(data[0] && data[0].error){
        return this.openSnackBar(data[0].error, "Cerrar")
      }
    });
  }
}
