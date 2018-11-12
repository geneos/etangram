import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

const REFCONTABLES:any[] = [
  {'codigo':0,'nombre':'TEST.REF.CONTABLE'},
  {'codigo':1,'nombre':'REMUNER.PLANTA.PERMANENTE'}
];

@Component({
  selector: 'app-abm-ref-contables',
  templateUrl: './abm-ref-contables.component.html',
  styleUrls: ['./abm-ref-contables.component.css']
})
export class AbmRefContablesComponent implements OnInit {
  constRefContables = new MatTableDataSource(REFCONTABLES);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selection = new SelectionModel(true, []);

  constructor() { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constRefContables.sort = this.sort;
    this.constRefContables.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constRefContables.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constRefContables.data.forEach(row => this.selection.select(row));
  }

  }
