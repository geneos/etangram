import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';

import { ComprobantesService } from '../../../../services/i2t/comprobantes.service';

import { DialogoConfComponent } from '../../../shared/modals/dialogo-conf/dialogo-conf.component'

@Component({
  selector: 'app-centro-costo',
  templateUrl: './centro-costo.component.html',
  styleUrls: ['./centro-costo.component.css']
})
export class CentroCostoComponent implements OnInit {
  @Input() idLinea : string;
  columnsToDisplay : string[] = ["centro", "importe","edit"]
  total : number = 0;

  centrosDeLinea : any[] = [
    {id: 1, idCentro: 2, importe: 1234.58},
    {id: 2, idCentro: 5, importe: 548.33},
  ];
  _centrosDeLinea = new MatTableDataSource(this.centrosDeLinea);
  
  centrosDeCosto : any[] = [
    // {id: 0, nombre: "Sin seleccionar"},
    {id: 1, nombre: "Centro_1"},
    {id: 2, nombre: "Centro_2"},
    {id: 3, nombre: "Centro_3"},
    {id: 4, nombre: "Centro_4"},
    {id: 5, nombre: "Centro_5"},
    {id: 6, nombre: "Centro_6"},
    {id: 7, nombre: "Centro_7"},
  ]

  constructor(
    private comprobantesService: ComprobantesService,
    private dialog : MatDialog) { }

  ngOnInit() {
    /* this.comprobantesService.getCentrosDeCosto()
      .subscribe(data => {
        this.centrosDeLinea = data; */
        this.centrosDeLinea.forEach(linea => {
          linea.editing = false;
          this.total += linea.importe;
        })
        this._centrosDeLinea.data = this.centrosDeLinea;
      /* }) */
  }

  agregarLinea() : void {
    this.centrosDeLinea.unshift({id : 0})
    this._centrosDeLinea.data = this.centrosDeLinea;
  }

  editarLinea(id : string) : void {
    this.centrosDeLinea.forEach(linea => {
      if(linea.id === id) {
        linea.editing = true;
      } else {
        linea.editing = false
      }
    });
  }

  borrarLinea(id : string) : void {
    const dialogRef = this.dialog.open(DialogoConfComponent, {
      width: '250px',
      data: {titulo: "Atención!", mensaje: "¿Desea borrar el elemento?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let index = this.centrosDeLinea.findIndex(linea => {
          return linea.id == id
        })
        this.centrosDeLinea.splice(index, 1)
        this._centrosDeLinea.data = this.centrosDeLinea;
        this.calcularTotal();
      }   
    });
  }

  actualizarImporte(id : string, valor : number) : void {
    let row = this.centrosDeLinea.find(linea => {
      return linea.id == id;
    })
    row.importe = Number(valor);
    this.calcularTotal()
  }

  calcularTotal() : void {
    this.total = 0;
    this.centrosDeLinea.forEach(linea => {
      this.total += linea.importe;
    })
  }
}
