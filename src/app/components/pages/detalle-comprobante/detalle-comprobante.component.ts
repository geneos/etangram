import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material';

import { ComprobantesService } from '../../../services/i2t/comprobantes.service';

@Component({
  selector: 'app-detalle-comprobante',
  templateUrl: './detalle-comprobante.component.html',
  styleUrls: ['./detalle-comprobante.component.css']
})
export class DetalleComprobanteComponent implements OnInit {
  columnsToDisplay = ['producto', 'cantidad', 'UM', 'precioUnitario', 'descuento', 'total'];

  idParam : string;
  comprobante : any = {};

  lineasComprobante : any[];
  _lineasComprobante = new MatTableDataSource(this.lineasComprobante);

  constructor(
    private comprobantesService: ComprobantesService,
    private route : ActivatedRoute) { 

    this.route.params.subscribe(parametros => {
      this.idParam = parametros['id'];
    });

    this.comprobante = {
      Comprobante: "",
      Fecha: "",
      ID_Comprobante: "",
      RazonSocial_Referente: "",
      Total: 0
    }
  }

  ngOnInit() {
    this.comprobantesService.getComprobante(this.idParam)
      .subscribe(data => {
        this.comprobante = data;
        console.log("Comprobante:", data)
      })

    this.comprobantesService.getDetalle(this.idParam).subscribe(
      data => {
        console.log("Lineas detalle",data)
        this.lineasComprobante = data;
        this._lineasComprobante.data = this.lineasComprobante;
        console.log(this._lineasComprobante)
      }
    );
    
  }

}
