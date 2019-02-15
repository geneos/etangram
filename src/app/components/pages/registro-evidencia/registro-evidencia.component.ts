import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTable, MatHint, MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'app-registro-evidencia',
  templateUrl: './registro-evidencia.component.html',
  styleUrls: ['./registro-evidencia.component.css']
})
export class RegistroEvidenciaComponent implements OnInit {

  forma: FormGroup;
  loading: boolean = false;
  nuevo: boolean = false;
  suscripcionConsDin: Subscription;
  itemDeConsulta: any;

  constructor(public ngxSmartModalService: NgxSmartModalService,
              public snackBar: MatSnackBar) { 
              this.forma = new FormGroup({
      'fecha': new FormControl(),
      'descripcion': new FormControl(),
      'image': new FormControl(),
      'btn': new FormControl()
    })
  }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  agregarEvidencia(){
    this.nuevo = true;
  }
  guardarEvidencia(){
    this.nuevo = false;
  }

}
