import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar, Sort } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
// key that is used to access the data in local storage
const TOKEN = '';

@Component({
  selector: 'app-abm-liquidaciones',
  templateUrl: './abm-liquidaciones.component.html',
  styleUrls: ['./abm-liquidaciones.component.css']
})
export class AbmLiquidacionesComponent implements OnInit {


  //#region tabla
  liqsAll: any[];
  sortedLiqs: any[];
  constLiqs = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //#endregion tabla

  loading: boolean;
  token: string;
  forma:FormGroup;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,
              private FormBuilder: FormBuilder,
              public snackBar: MatSnackBar,) 
  { 
    console.log(this.storage.get('TOKEN') || 'Local storage is empty');
    this.token = this.storage.get('TOKEN');

    this.loading = true;

    this.forma = this.FormBuilder.group({
      fechaDesde: new FormControl(),
      fechaHasta: new FormControl(),
      soloPendientes: new FormControl()
    });
    this.forma.controls['soloPendientes'].setValue(true);
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constLiqs.sort = this.sort;
    this.constLiqs.paginator = this.paginator;

    this.liqsAll = [
      {fechaPago: '13/12/2018', descripcion: 'Transferencias varias DIC 18',  medioPago: 'TRANSF', monto: '14.568', estado: 'Pendiente'},
      {fechaPago: '11/12/2018', descripcion: 'Transferencias BAEHOST',        medioPago: 'TRANSF', monto: '27.450', estado: 'Pendiente'},
      {fechaPago: '10/11/2018', descripcion: 'Transferencias varias NOV 18',  medioPago: 'TRANSF', monto: '17.500', estado: 'Pagado'},
      {fechaPago: '06/12/2018', descripcion: 'Pagos a prv CHEQUE',            medioPago: 'CHEQUE 30/60/90', monto: '47.300', estado: 'Pendiente'},
    ];

    if (this.forma.controls['soloPendientes'].value == true){
      this.constLiqs = new MatTableDataSource(this.liqsAll.filter(liq => liq.estado == 'Pendiente'));
    }
    else{
      this.constLiqs = new MatTableDataSource(this.liqsAll);
    }
  }

  //#region funcionesTabla
  applyFilter(){
    
  }

  sortData(sort: Sort) {
    console.log('llamado al sort: ', sort);
    const data = this.liqsAll.slice(); //todo cambiar por liquidaciones filtradas
    if (!sort.active || sort.direction === '') {
      this.sortedLiqs = data;
      return;
    }

    this.sortedLiqs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fechaPago': return compare(a.fechaPago, b.fechaPago, isAsc);
        case 'descripcion': return compare(a.descripcion, b.descripcion, isAsc);
        case 'medioPago': return compare(a.medioPago, b.medioPago, isAsc);
        default: return 0;
      }
    });
    this.constLiqs = new MatTableDataSource(this.sortedLiqs);
  }
}

  function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  //#endregion funcionesTabla

