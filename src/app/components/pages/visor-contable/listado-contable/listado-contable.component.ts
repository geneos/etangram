import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogoConfComponent } from '../../../shared/modals/dialogo-conf/dialogo-conf.component'

import { VisorContableService } from 'src/app/services/i2t/visor-contable.service';

@Component({
  selector: 'app-listado-contable',
  templateUrl: './listado-contable.component.html',
  styleUrls: ['./listado-contable.component.css']
})
export class ListadoContableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() idComprobante : string;
  linea : any;

  columnsToDisplay : string[] = ["cuenta", "descripcion", "centro", "debe", "haber", "edit"]
  ocultarForm : boolean = true;

  contabilidadComprobantes : any[];
  _contabilidadComprobantes = new MatTableDataSource(this.contabilidadComprobantes);

  debeTotal : number;
  haberTotal : number;

  constructor(
    private visorContableService: VisorContableService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

      this.linea = {
        Nro_RefContable: "",
        Nombre_RefContable: "",
        Nombre_CtoCosto: "",
        debe: 0,
        haber: 0,
      };
  }

  ngOnInit() {
    this.visorContableService.getContabilidadComprobante(this.idComprobante)
      .subscribe(data => {
        console.log("Lineas Contables", data)
        this.contabilidadComprobantes = data;
        this._contabilidadComprobantes.data = this.contabilidadComprobantes;
        this._contabilidadComprobantes.paginator = this.paginator;
        this._contabilidadComprobantes.sort = this.sort;
        this.calcularTotales();
      });
  }

  cargarListado() : void {
    this.visorContableService.getContabilidadComprobante(this.idComprobante)
      .subscribe(data => {
        this.contabilidadComprobantes = data;
        this._contabilidadComprobantes.data = this.contabilidadComprobantes;
        this._contabilidadComprobantes.paginator = this.paginator;
        this._contabilidadComprobantes.sort = this.sort;
        this.calcularTotales();
        this.ocultarForm = true;
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  agregarLineaContable() : void {
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_Renglon: 0,
      Nro_RefContable: "",
      Nombre_RefContable: "",
      Nombre_CtoCosto: "",
      debe: 0,
      haber: 0,
      IdCtoCosto: 0,
      TieneCtoCosto : 2
    };
    this.ocultarForm = false;
  }

  editarLineaContable(id : string) : void {
    let row = this.contabilidadComprobantes.find(ctb => {return ctb.ID_Renglon == id})
    // Aca hay que crear un objeto, para que sea una copia y no pasar el row,
    // porque si no se modifica el original
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_Renglon: id,
      Nro_RefContable: row.Nro_RefContable,
      Nombre_RefContable: row.Nombre_RefContable,
      Nombre_CtoCosto: row.Nombre_CtoCosto,
      debe: row.debe,
      haber: row.haber,
      IdCtoCosto: Number(row.IdCtoCosto),
      TieneCtoCosto : row.TieneCtoCosto
    };

    console.log("Por editar", this.linea)

    this.ocultarForm = false;
  }

  borrarLineaContable(id : string) : void {
    const dialogRef = this.dialog.open(DialogoConfComponent, {
      width: '250px',
      data: {titulo: "Atención!", mensaje: "¿Desea borrar el elemento?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let index = this.contabilidadComprobantes.findIndex(linea => {
          return linea.ID_Renglon == id
        })
        
        let linea : Object = {
          ID_Comprobante: this.idComprobante,
          ID_Imputacion: id
        }
        console.log("Borrando", linea)
        this.visorContableService.borrarLineaContable(linea)
          .subscribe(data => {
            if(data[0] && data[0].error){
              return this.openSnackBar(data[0].error, "Error")
            }

            // Tambien la borro de la vista
            this.contabilidadComprobantes.splice(index, 1)
            this._contabilidadComprobantes.data = this.contabilidadComprobantes;
            this.calcularTotales();
          }) 
      }
    });
  }

  calcularTotales() : void {
    this.debeTotal = 0;
    this.haberTotal = 0;
    this.contabilidadComprobantes.forEach(linea => {
      this.debeTotal += Number(linea.debe);
      this.haberTotal += Number(linea.haber);
    })
  }

  cancelarLinea() : void {
    this.ocultarForm = true;
    this.cargarListado();
  }
}
