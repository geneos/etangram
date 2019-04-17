import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar, Sort } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Caja } from 'src/app/interfaces/caja.interface';


@Component({
  selector: 'app-liquidacion-por-lote',
  templateUrl: './liquidacion-por-lote.component.html',
  styleUrls: ['./liquidacion-por-lote.component.css']
})
export class LiquidacionPorLoteComponent implements OnInit {

  cuentasAll: any[] = [];
  cajasAll: Caja[] = [];  
  titulo: string;
  
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
    this.titulo = 'Nueva Liquidación por Lote';

    this.forma = this.FormBuilder.group({
      fecha: new FormControl(),
      descripcion: new FormControl(),
      caja: new FormControl(),
      cuenta: new FormControl()
    });
  }

  ngOnInit() {
  }

}
