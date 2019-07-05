import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { VisorPresupuestarioService } from 'src/app/services/i2t/visor-presupuestario.service';

@Component({
  selector: 'app-form-presupuestario',
  templateUrl: './form-presupuestario.component.html',
  styleUrls: ['./form-presupuestario.component.css']
})
export class FormPresupuestarioComponent implements OnInit {
  @Input() linea : any;
  @Output() savedLine = new EventEmitter<any>();
  @Output() canceled = new EventEmitter<any>();

  partidas: any[] = [];

  constructor(
    private visorPresupuestarioService: VisorPresupuestarioService,
    private _snackBar: MatSnackBar) { 
      
  }

  ngOnInit() {
    console.log("linea", this.linea)
    this.visorPresupuestarioService.getPartidas(this.linea.ID_Partida_Afecta).subscribe(
      data => {
        this.partidas = data;
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  seleccionarPartida(id: string) : void {
    let partida = this.partidas.find(partida => {return partida.ID_Partida == id})
    this.linea.Codigo_Partida = partida.Codigo_Partida;
    this.linea.ID_Partida = partida.ID_Partida;
    this.linea.Descripcion_Partida = partida.Nombre_Partida;
  }

  guardar() : void {
    this.visorPresupuestarioService.insertarLineaPresupuestaria(this.linea).subscribe(
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
    this.visorPresupuestarioService.actualizarLineaPresupuestaria(this.linea).subscribe(
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
}
