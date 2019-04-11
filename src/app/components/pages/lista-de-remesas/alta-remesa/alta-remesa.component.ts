import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';

@Component({
  selector: 'app-alta-remesa',
  templateUrl: './alta-remesa.component.html',
  styleUrls: ['./alta-remesa.component.css']
})
export class AltaRemesaComponent implements OnInit {
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  loading: boolean = false;
  forma: FormGroup;
  checked: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();

  @ViewChild(MatSort) sort: MatSort;
 // dataSource = new MatTableDataSource();
  constructor() {
    this.forma = new FormGroup({
      'fecha': new FormControl(),
      'numero': new FormControl(),
      'descripcion': new FormControl(),
      'pagoPrevisto': new FormControl(),
      'restante': new FormControl(),
      'imputado': new FormControl()
    })
   }

  ngOnInit() {
  }

}
export interface Element {
  proveedor: string;
  categoria: string;
  criticidadProv: string;
  comprobante: string;
  criticidadComp: string;
  vencimiento: string;
  total: string;
  saldo: string;
  pagar: string;
}

const ELEMENT_DATA: Element[] = [
  { proveedor: '1', categoria: 'Hydrogen', criticidadProv: '1.0079', comprobante: 'H', criticidadComp: "Yes", vencimiento: '01-01-2019', total: '20', saldo: '20', pagar: '' },
  { proveedor: '1', categoria: 'Hydrogen', criticidadProv: '1.0079', comprobante: 'H', criticidadComp: "Yes", vencimiento: '01-01-2019', total: '20', saldo: '20', pagar: '200' },
  { proveedor: '1', categoria: 'Hydrogen', criticidadProv: '1.0079', comprobante: 'H', criticidadComp: "Yes", vencimiento: '01-01-2019', total: '20', saldo: '20', pagar: '' },
  { proveedor: '1', categoria: 'Hydrogen', criticidadProv: '1.0079', comprobante: 'H', criticidadComp: "Yes", vencimiento: '01-01-2019', total: '20', saldo: '20', pagar: '400' },
  { proveedor: '1', categoria: 'Hydrogen', criticidadProv: '1.0079', comprobante: 'H', criticidadComp: "Yes", vencimiento: '01-01-2019', total: '20', saldo: '20', pagar: '' },
];