import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { ComprobantesService } from '../../../../services/i2t/comprobantes.service';
import { VisorImpositivoService } from '../../../../services/i2t/visor-impositivo.service'

@Component({
  selector: 'app-form-impositivo',
  templateUrl: './form-impositivo.component.html',
  styleUrls: ['./form-impositivo.component.css']
})
export class FormImpositivoComponent implements OnInit {
  @Input() linea : any;
  @Output() savedLine = new EventEmitter<any>();
  // @Output() updatedLine = new EventEmitter<any>();
  @Output() canceled = new EventEmitter<any>();

  /* cuenta : number;
  descripcion : string;
  impuesto : string;
  imponible : number;
  importe : number;
  observaciones : string; */

  public tipo_imp_id : number;
  public imp_id : number;

  tipo_impuestos : any[] = [];
  impuestos : any[] = [];

  constructor(
    private visorImpositivoService: VisorImpositivoService,
    private _snackBar: MatSnackBar) { 
      this.tipo_imp_id = 0;
      this.imp_id = 0;
    }

  ngOnInit() {
    console.log("Iniciando formulario") 
    this.visorImpositivoService.getTipoDeImpuestos().subscribe(data => {
      this.tipo_impuestos = data;
      if(this.linea.ID_Renglon != 0) {
        this.seleccionarTipoImpuesto(this.linea.Descripcion);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  seleccionarTipoImpuesto(value: string) : void {
    let tipo_imp = this.tipo_impuestos.find(t => {return t.name == value});
    
    this.visorImpositivoService.getImpuestosPorTipo(tipo_imp.idmodeloimpuesto)
      .subscribe(data => {
        this.impuestos = data;
      });
  }

  seleccionarImpuesto(value: string) : void {
    let selected = this.impuestos.find(imp => {return imp.Nombre_Impuesto == value});
    this.linea.Concepto = value;
    this.linea.Nro_RefContable = selected.numeroReferencia;

    let body = {
      ID_Modeloimpuesto: selected.ID_ModeloImpuesto,
      Id_Impuesto: Number(selected.ID_Impuesto),
      Id_comprobante: this.linea.ID_Comprobante
    };
    this.visorImpositivoService.getImporteLineaImpositiva(body)
      .subscribe(data => {
        this.linea.MontoRetenido = Number(data[0].importeretencion); 
      });
  }

  guardar() : void {
    this.cargarImpuesto();

    let nuevaLinea = {
      ID_Comprobante: this.linea.ID_Comprobante,
      ID_ModeloImpuesto: this.tipo_imp_id,
      ID_Impuesto: this.imp_id,
      ID_RefContable: this.linea.Nro_RefContable,
      Importe: this.linea.MontoRetenido,
      Observaciones: this.linea.Observaciones
    };
    console.log("Guardanto Impuesto", nuevaLinea)
    this.visorImpositivoService.insertarLineaImpositiva(nuevaLinea).subscribe(
      data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Cerrar")
        } else {
          this.savedLine.emit();
        }
      }
    );
  }

  actualizar() : void {
    this.cargarImpuesto();

    let editada = {
      ID_Comprobante: this.linea.ID_Comprobante,
      ID_Renglon: this.linea.ID_Renglon,
      ID_ModeloImpuesto: this.tipo_imp_id,
      ID_Impuesto: this.imp_id,
      ID_RefContable: this.linea.Nro_RefContable ? this.linea.Nro_RefContable : "",
      Importe: Number(this.linea.MontoRetenido),
      Observaciones: this.linea.Observaciones
    };
    console.log("Actualizando Impuesto", editada)
    this.visorImpositivoService.actualizarLineaImpositiva(editada).subscribe(
      data => {
        if(data[0] && data[0].error){
          return this.openSnackBar(data[0].error, "Cerrar")
        } else {
          this.savedLine.emit();
        }
      }
    );
  }

  cancelar() : void {
    this.canceled.emit();
  }

  cargarImpuesto() : void {
    // Extraigo el ID del tipo de impuesto y lo guardo
    let tipo_imp = this.tipo_impuestos.find(t => {return t.name == this.linea.Descripcion});
    this.tipo_imp_id = tipo_imp ? tipo_imp.idmodeloimpuesto : 0;
    // Extraigo el ID del impuesto y lo guardo
    let selected = this.impuestos.find(imp => {return imp.Nombre_Impuesto == this.linea.Concepto});
    this.imp_id = selected ? Number(selected.ID_Impuesto) : 0;
  }

}
