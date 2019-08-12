import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ComprobantesService } from 'src/app/services/i2t/comprobantes.service';
import { VisorPresupuestarioService } from 'src/app/services/i2t/visor-presupuestario.service';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

import { ToMoneyPipe } from '../../../../pipes/to-money.pipe';

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

  str_total: string = "";
  str_diferencia: string = "";

  ocultarForm: boolean = true;
  linea: any;
  presupuestosComprobante: any[] = [];
  _presupuestosComprobante = new MatTableDataSource(this.presupuestosComprobante);

  suscripcionConsDin: Subscription;

  constructor(
    private comprobantesService: ComprobantesService,
    private visorPresupuestarioService: VisorPresupuestarioService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private ngxSmartModalService: NgxSmartModalService) { 
      this.linea = {
        ID_Comprobante: this.idComprobante,
        ID_AppReserva: "0",
        Expediente: "",
        Tramite: "",
        Fecha: moment(new Date()).format("DD-MM-YYYY"),
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
      this.str_total = new ToMoneyPipe().transform(this.total.toString());
      this.str_diferencia = new ToMoneyPipe().transform(this.diferencia.toString());
  }

  agregarPresupuesto(idReserva: string) : void {
    this.visorPresupuestarioService.getReservaPresupuestaria(idReserva).subscribe(
      data => {
        let reserva = data[0];
        this.linea = {
          ID_Comprobante: this.idComprobante,
          ID_AppReserva: "0",
          Expediente: reserva.Expediente,
          Tramite: reserva.Tramite,
          Fecha: moment(new Date()).format("DD/MM/YYYY"),
          Partida: "",
          Descripcion_Partida: "",
          Imputado: reserva.Imputado,
          Estado: "",
          ID_Partida: reserva.ID_Partida,
          ID_Partida_Afecta: reserva.ID_Partida_Afecta,
          ID_Reserva: reserva.ID_Reserva
        }
        this.ocultarForm = false;
      }
    )
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
      Fecha: moment(row.Fecha).format("DD/MM/YYYY"),
      Partida: row.Descripcion_Partida,
      Descripcion_Partida: row.Descripcion_Partida,
      Imputado: row.Imputado,
      Estado_Presupuestario: row.Estado_Presupuestario,
      ID_Partida: row.ID_Partida,
      ID_Partida_Afecta: row.ID_Partida_Afecta,
      ID_Reserva: row.ID_Reserva,
      Codigo_Partida: row.Codigo_Partida,
    }
    this.ocultarForm = false;
  }

  borrarLinea(id: string) : void {
    let row = this.presupuestosComprobante.find(row => {return row.ID_AppReserva == id});
    this.visorPresupuestarioService.borrarLineaPresupuestaria(row).subscribe(
      data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Cerrar")
        } else {
          this.cargarLista();
        }
      }
    );
  }

  abrirConsulta(consulta: string){
    let datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null,
      modal: 'consDinModal'
    }
    
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionConsDin = this.ngxSmartModalService.getModal(datosModal.modal).onClose
      .subscribe((modal: NgxSmartModalComponent) => {
        let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);

        if (respuesta.estado === 'cancelado'){
          this.openSnackBar('Se canceló la selección de la reserva', 'Cerrar');
        }
        else {
          if(respuesta.selection){
            console.log("Elegido: ", respuesta.selection[0]);
            this.agregarPresupuesto(respuesta.selection[0].id);
          }
        }

        this.suscripcionConsDin.unsubscribe();
      });
    this.ngxSmartModalService.open(datosModal.modal);
  }

}
