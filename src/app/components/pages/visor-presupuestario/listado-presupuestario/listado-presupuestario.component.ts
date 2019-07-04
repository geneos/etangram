import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ComprobantesService } from 'src/app/services/i2t/comprobantes.service';
import { VisorPresupuestarioService } from 'src/app/services/i2t/visor-presupuestario.service';

import * as moment from 'moment';

@Component({
  selector: 'app-listado-presupuestario',
  templateUrl: './listado-presupuestario.component.html',
  styleUrls: ['./listado-presupuestario.component.css']
})
export class ListadoPresupuestarioComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() idComprobante : string;
  comprobante: any;

  columnsToDisplay = ['expediente', 'tramite', 'fecha', 'partida', 'descripcion', 'imputado', 'estado', 'edit']

  total: number = 0;
  diferencia: number = 0;

  ocultarForm: boolean = true;
  linea: any;
  presupuestosComprobante: any[] = [];
  _presupuestosComprobante = new MatTableDataSource(this.presupuestosComprobante)

  constructor(
    private comprobantesService: ComprobantesService,
    private visorPresupuestarioService: VisorPresupuestarioService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { 
      this.linea = {
        ID_Comprobante: this.idComprobante,
        ID_AppReserva: "0",
        Expediente: "",
        Tramite: "",
        Fecha: moment(new Date()).format("YYYY-MM-DD"),
        Partida: "",
        Descripcion: "",
        Imputado: "",
        Estado: "",
        ID_Partida: "",
        ID_Partida_Afecta: ""
      };
      
      this.comprobante = {
        Total: 0,
      }
  }

  ngOnInit() {
    this.comprobantesService.getComprobante(this.idComprobante).subscribe(
      data => {
        this.comprobante = data;
      }
    );

    this.cargarLista();
    this.ocultarForm = true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  cargarLista() : void {
    this.visorPresupuestarioService.getPresupuestoComprobante(this.idComprobante)
      .subscribe(ppt => {
        console.log("Presupuestos del comprobante", ppt)
        this.presupuestosComprobante = ppt;
        this.calcularTotal(); 
        this._presupuestosComprobante.data = this.presupuestosComprobante;
        this._presupuestosComprobante.paginator = this.paginator;
        this._presupuestosComprobante.sort = this.sort;
    });
  }

  calcularTotal() : void {
    this.total = this.presupuestosComprobante.reduce((total, elem) => {return total + Number(elem.Imputado)}, 0);
    this.diferencia = Number(this.comprobante.Total) - this.total;
  }

  agregarPresupuesto() : void {
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_AppReserva: "0",
      Expediente: "",
      Tramite: "",
      Fecha: moment(new Date()).format("YYYY-MM-DD"),
      Partida: "",
      Descripcion: "",
      Imputado: "",
      Estado: "",
      ID_Partida: "",
      ID_Partida_Afecta: ""
    }
    this.ocultarForm = false;
  }

  actualizarLista() : void {
    this.cargarLista();
    this.ocultarForm = true
  }

  cancelar() : void {
    this.ocultarForm = true
  }

  editarLinea(id: string) : void {
    let row = this.presupuestosComprobante.find(row => {return row.ID_AppReserva == id});
    this.linea = {
      ID_Comprobante: this.idComprobante,
      ID_AppReserva: row.ID_AppReserva,
      Expediente: row.Expediente,
      Tramite: row.Tramite,
      Fecha: row.Fecha,
      Partida: row.Descripcion_Partida,
      Descripcion: row.Descripcion_Partida,
      Imputado: row.Imputado,
      Estado_Presupuestario: row.Estado_Presupuestario,
      ID_Partida: row.ID_Partida,
      ID_Partida_Afecta: row.ID_Partida_Afecta
    }
    this.ocultarForm = false;
  }

  borrarLinea(id: string) : void {
    let row = this.presupuestosComprobante.find(row => {return row.ID_AppReserva == id});
    this.visorPresupuestarioService.borrarLineaPresupuestaria(row).subscribe(
      data => {}
    );
  }

}
