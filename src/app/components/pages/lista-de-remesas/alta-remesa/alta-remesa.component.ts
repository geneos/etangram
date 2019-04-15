import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, Event } from "@angular/router";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { RemesasService } from 'src/app/services/i2t/remesas.service'
import { Remesas, RemesaComprobantes} from 'src/app/interfaces/remesas.interface'
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';

@Injectable()
@Component({
  selector: 'app-alta-remesa',
  templateUrl: './alta-remesa.component.html',
  styleUrls: ['./alta-remesa.component.css']
})
export class AltaRemesaComponent implements OnInit {

  token: any;
  editing: boolean = false;  
  dataRc: any; //Comprobantes de remesas
  remesaComprobantes: RemesaComprobantes[] = [];
  remesas: any; // Datos de la Remesa
  listaRemesas: Remesas[] = []
  idRemesa: any;
  pagoRestante: any;
  numero: any;
  dataSource = new MatTableDataSource(this.remesaComprobantes)

  loading: boolean = false;
  forma: FormGroup;
  checked: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();

  @ViewChild(MatSort) sort: MatSort;
 // dataSource = new MatTableDataSource();
  constructor( @Inject(SESSION_STORAGE) private storage: StorageService,
              private router: Router,
              private route: ActivatedRoute,
              private _remesasService: RemesasService) {
    this.forma = new FormGroup({
      'fecha': new FormControl(),
      'numero': new FormControl(),
      'descripcion': new FormControl(),
      'pagoPrevisto': new FormControl(),
      'restante': new FormControl(),
      'imputado': new FormControl()
    })

    this.token = localStorage.getItem('TOKEN')
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {;
        if (!this.router.url.includes('lista-remesas/nuevo')){
          this.editing = true;
          
        } else {
          this.editing = false;
        }
      }
    })

    this.route.params.subscribe( parametros=>{
      this.idRemesa = parametros['id'];
    });
  }

  ngOnInit() {
    this.obtenerDatosRemesa()
  }

  obtenerDatosRemesa(){
    this._remesasService.getRemesas( this.idRemesa, this.token)
     .subscribe(resp => {
       this.remesas = resp
       this.listaRemesas = this.remesas.dataset
       this.forma.controls['fecha'].setValue(this.listaRemesas[0].fecha)
       this.forma.controls['descripcion'].setValue(this.listaRemesas[0].name)
       this.forma.controls['pagoPrevisto'].setValue(this.listaRemesas[0].pago_previsto)
       this.pagoRestante = this.listaRemesas[0].pago_restante
       this.numero = this.listaRemesas[0].numero
      this.obtenerComprobantes();
       
     })
  }
  obtenerComprobantes(){
    let jsbody = {
      "ID_Remesa": this.idRemesa
    }
    let jsonbody = JSON.stringify(jsbody)
    this._remesasService.getRemesaComprobantes(jsonbody, this.token)
      .subscribe( resp =>{
        console.log(resp)
        this.dataRc = resp
        this.remesaComprobantes = this.dataRc.dataset
        console.log(this.remesaComprobantes)
        this.dataSource = new MatTableDataSource(this.remesaComprobantes)
      })
  }

  crearRemesa(){
    let jsbody = {
        "Nombre_Remesa":  this.forma.controls['descripcion'].value,
        "Fecha":  this.forma.controls['fecha'].value,
        "Pago_Previsto":  this.forma.controls['pagoPrevisto'].value,
        "ID_Usuario": "1"
    }
    let jsonbody = JSON.stringify(jsbody)
    this._remesasService.postRemesaIns(jsonbody, this.token)
      .subscribe(resp => {
        console.log(resp)
      })
  }
  
  confirmarRemesa(){
    let jsbody = {
      "ID_Remesa": this.idRemesa
    }
    let jsonbody = JSON.stringify(jsbody);
    this._remesasService.postRemesaConf( jsonbody, this.token)
      .subscribe(resp => {
        console.log(resp)
      })
  }
}