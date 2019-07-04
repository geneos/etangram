import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ComprobantesService } from '../../../../services/i2t/comprobantes.service';
import { DialogoConfComponent } from '../../../shared/modals/dialogo-conf/dialogo-conf.component'
import { VisorImpositivoService } from 'src/app/services/i2t/visor-impositivo.service';

@Component({
  selector: 'app-listado-impositivo',
  templateUrl: './listado-impositivo.component.html',
  styleUrls: ['./listado-impositivo.component.css']
})
export class ListadoImpositivoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() idComprobante : string;
  comprobante : any;

  columnsToDisplay = ['cuenta', 'descripcion', 'impuesto', 'imponible', 'importe', 'observaciones', 'edit']

  rowID : number = 0;
  total : number = 0;

  impuestosComprobante : any[] = [];
  _impuestosComprobante = new MatTableDataSource(this.impuestosComprobante);

  ocultarForm : boolean = true;
  linea : any;

  tipo_impuestos : any[];
  // impuestos : any[];

  constructor(
    private comprobantesService: ComprobantesService,
    private visorImpositivoService: VisorImpositivoService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { 
      this.linea = {
        ID_Comprobante: "",
        ID_Renglon: 0,
        Nro_RefContable: null,
        Descripcion: "",
        Concepto: "",
        Imponible: 0,
        MontoRetenido: 0,
        Observaciones: ""
      }
  }

  ngOnInit() {
    this.comprobantesService.getComprobante(this.idComprobante)
      .subscribe(data => {
        this.comprobante = data;
      });

    this.visorImpositivoService.getTipoDeImpuestos()
      .subscribe(data => {
        this.tipo_impuestos = data;
      });

    this.cargarLista();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  agregarImpuesto() : void {
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_Renglon: 0,
      Nro_RefContable: null,
      Descripcion: "",
      Concepto: "",
      Imponible: this.comprobante.Total,
      MontoRetenido: 0,
      Observaciones: ""
    }
    this.ocultarForm = false;
  }

  editarImpuesto(rowId : string) : void {
    let row = this.impuestosComprobante.find(impc => {
      return rowId == impc.ID_Renglon;
    });
    
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_Renglon: rowId,
      Nro_RefContable: row.Nro_RefContable,
      Descripcion: row.Descripcion,
      Concepto: row.Concepto,
      Imponible: this.comprobante.Total,
      MontoRetenido: row.MontoRetenido,
      Observaciones: row.Observaciones
    }

    this.ocultarForm = false;
  }

  borrarImpuesto(rowId : string) : void {
    const dialogRef = this.dialog.open(DialogoConfComponent, {
      width: '250px',
      data: {titulo: "Atención!", mensaje: "¿Desea borrar el elemento?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let index = this.impuestosComprobante.findIndex(imp => {
          return imp.ID_Renglon == rowId
        });

        let impuesto = { ID_Renglon: rowId }
        console.log("Borrando", impuesto)
        // La borro en el server
        this.visorImpositivoService.borrarLineaImpositiva(impuesto).subscribe(
          data => {
            if(data[0] && data[0].error){
              return this.openSnackBar(data[0].error, "Cerrar")
            }  
            // La borro de la vista
            this.impuestosComprobante.splice(index, 1)
            this._impuestosComprobante.data = this.impuestosComprobante;
            this.calcularTotal();
          }
        );  
      }
    });
  }

  calcularTotal() : void {
    this.total = this.impuestosComprobante.reduce((total, elem) => {return total + Number(elem.MontoRetenido)}, 0);
  }

  cargarLista() : void {
    this.visorImpositivoService.getImpuestosComprobante(this.idComprobante)
      .subscribe(impc => {
        console.log("Impuestos del comprobante", impc)
        this.impuestosComprobante = impc;
        this.calcularTotal(); 
        this._impuestosComprobante.data = this.impuestosComprobante;
        this._impuestosComprobante.paginator = this.paginator;
        this._impuestosComprobante.sort = this.sort;
        this.ocultarForm = true;
    });
  }

  ocultarFormulario() : void {
    this.ocultarForm = true;
  }

  cargarImpuestos() : void {

  }
}
