import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';
import { RemesasService } from 'src/app/services/i2t/remesas.service'
import { Remesas} from 'src/app/interfaces/remesas.interface'
import { Router, ActivatedRoute } from "@angular/router";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-lista-de-remesas',
  templateUrl: './lista-de-remesas.component.html',
  styleUrls: ['./lista-de-remesas.component.css']
})
export class ListaDeRemesasComponent implements OnInit {

  token: any;
  loading: boolean = false;
  forma: FormGroup;
  checked: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();
  fec: any;

  remesas: any;
  listaRemesas: Remesas[] = []
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.listaRemesas);

  get fecdesde(): any { return this.forma.get('fecdesde'); }
  get fechasta(): any { return this.forma.get('fechasta'); }
  
  constructor(private _remesasService: RemesasService,
              private route:ActivatedRoute,private router: Router,
              @Inject(SESSION_STORAGE) private storage: StorageService) { 
    
    this.token = localStorage.getItem('TOKEN')  
    this.forma = new FormGroup({
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(),
     // 'soloPendientes': new FormControl(true),
    })
    
    this.dataSource.filterPredicate = (data, filter) =>{
      if (this.fecdesde && this.fechasta) {
        let a: Date
        let b: Date = new Date()
         
        return Date.parse(data.fecha) >= this.fecdesde && data.fecha <= this.fechasta;
      }
      return true;
    }
  }


  ngOnInit() {
    this.obtenerRemesas();
    this.fechaActual.setDate(this.fechaActual.getDate() + 30);
    this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    this.fechaDesde.setDate(this.fechaActual.getDate() - 30);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);
  //  this.forma.controls['soloPendientes'].setValue(true)
    
    
  }
  
  obtenerRemesas(){
    this._remesasService.getRemesas(null,this.token)
      .subscribe(resp => {
      //  console.log(resp)
        this.remesas = resp
        this.listaRemesas = this.remesas.dataset
        console.log(this.listaRemesas)
        this.listaRemesas.forEach( data =>{
          console.log(data.fecha)
        })
        this.dataSource = new MatTableDataSource(this.listaRemesas)
      //  this.dataSource.filter = 'Pendiente';
      })
  }
  applyFilter() {
    this.dataSource.filter =  ''+Math.random();
   }
}
