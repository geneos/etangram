import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { ComprobantesService } from '../../../../services/i2t/comprobantes.service';
import { VisorContableService } from 'src/app/services/i2t/visor-contable.service';

@Component({
  selector: 'app-form-contable',
  templateUrl: './form-contable.component.html',
  styleUrls: ['./form-contable.component.css']
})
export class FormContableComponent implements OnInit {
  @Input() linea : any;
  @Output() savedLine = new EventEmitter<any>();
  @Output() canceled = new EventEmitter<any>();

  centros_costo : any[];
  cuentas_contables : any[];

  constructor(
    private visorContableService: VisorContableService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.visorContableService.getCentrosDeCosto().subscribe(
      data => {
        // console.log("Centros de costo", data)
        this.centros_costo = data;
      }
    );

    this.visorContableService.getCuentasContables().subscribe(
      data => {
        // console.log("Cuentas contables", data)
        this.cuentas_contables = data;
      }
    );

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  seleccionarCuenta(value : string) : void {
    let cuenta = this.cuentas_contables.find(cta => {return cta.idreferenciacontable == value});
    this.linea.Nombre_RefContable = cuenta.name;
  }

  seleccionarCentro(value : string) : void {
    let centro = this.centros_costo.find(c => {return (c.idcentrocosto).toString() == value})
    this.linea.Nombre_CtoCosto = centro ? centro.name : "";
    console.log("Se selecciono centro:", value, centro);
  }

  guardar() : void {
    let nuevaLinea = {
      ID_Comprobante: this.linea.ID_Comprobante,
      ID_RefContable: this.linea.Nro_RefContable,
      ID_CtoCosto: this.linea.IdCtoCosto.toString(),
      Debe: Number(this.linea.debe),
      Haber: Number(this.linea.haber)
    }
    console.log("Guardando linea contable", nuevaLinea)
    this.visorContableService.insertarLineaContable(nuevaLinea).subscribe(
      data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Cerrar")
        }
        this.savedLine.emit()
      }
    );
  }

  actualizar() : void {
    let nuevaLinea = {
      ID_Comprobante: this.linea.ID_Comprobante,
      ID_Renglon: this.linea.ID_Renglon,
      ID_CtoCosto: (this.linea.IdCtoCosto).toString(),
      Debe: Number(this.linea.debe),
      Haber: Number(this.linea.haber)
    }
    console.log("Actualizando linea contable", nuevaLinea)
    this.visorContableService.actualizarLineaContable(nuevaLinea).subscribe(
      data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Cerrar")
        }
        this.savedLine.emit()
      }
    );
  }

  cancelar() : void {
    this.canceled.emit();
  }
}
