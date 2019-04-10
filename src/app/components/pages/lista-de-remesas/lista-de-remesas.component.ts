import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';

export interface Prueba{
  fechaPago: string,
  descripcion: string,
  pagar: number,
  estado: string
}
const datosPrueba: Prueba[] = [
  {fechaPago: '10-04-2019', descripcion: 'prueba', pagar: 200, estado: 'pendiente'}
]

@Component({
  selector: 'app-lista-de-remesas',
  templateUrl: './lista-de-remesas.component.html',
  styleUrls: ['./lista-de-remesas.component.css']
})
export class ListaDeRemesasComponent implements OnInit {

  
  loading: boolean = false;
  forma: FormGroup;
  checked: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(datosPrueba);

  constructor() { 
    this.forma = new FormGroup({
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(),
      'soloPendientes': new FormControl(''),
    })
  }

  ngOnInit() {
    this.fechaActual.setDate(this.fechaActual.getDate() + 30);
    this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    this.fechaDesde.setDate(this.fechaActual.getDate() - 30);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);
  }
  

}
