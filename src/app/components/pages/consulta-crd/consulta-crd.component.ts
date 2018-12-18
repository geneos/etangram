import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface Certificados {
  certificado: number;
  fecha: string ;
  expediente: string;
  opublicidad: string;
  comprobante: string;
  importe: number;
}
const constCertificados: Certificados[] = [
  {certificado: 123456789, fecha: '01/01/2018', expediente: '200-4567895-456', opublicidad: 'aaaaa', comprobante: 'FC12-446548977', importe: 1000}
];

@Component({
  selector: 'app-consulta-crd',
  templateUrl: './consulta-crd.component.html',
  styleUrls: ['./consulta-crd.component.css']
})
export class ConsultaCrdComponent implements OnInit {
  constCertificados = new MatTableDataSource(constCertificados);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['certificado', 'fecha', 'expediente', 'opublicidad', 'comprobante', 'importe'];
  dataSource = new MatTableDataSource<Certificados>(constCertificados);
  selection = new SelectionModel<Certificados>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
 /* isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }*/

  /** Selects all rows if they are not all selected; otherwise clear selection. */
 /* masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  */
  numero:FormGroup;
  constructor() { 
    this.numero = new FormGroup({
        'numero': new FormControl('',Validators.required),
        'razonSocial': new FormControl('',Validators.required),
    })
    
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.constCertificados.sort = this.sort;
    this.constCertificados.paginator = this.paginator;
  }


}
