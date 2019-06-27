import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { Comprobante } from '../../../interfaces/comprobante.interface';

import { ComprobantesService } from '../../../services/i2t/comprobantes.service';

import * as moment from 'moment';

@Component({
  selector: 'app-lista-comprobantes',
  templateUrl: './lista-comprobantes.component.html',
  styleUrls: ['./lista-comprobantes.component.css']
})
export class ListaComprobantesComponent implements OnInit {
  comprobantes : any;
  _comprobantes = new MatTableDataSource(this.comprobantes);

  // Table
  columnsToDisplay = ['numCompr', 'fecha', 'referente', 'total', 'estado_cai', 'estado_doc', 'autorizacion', 'contabilidad', 'imputacion', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Filtros
  desde = new FormControl();
  hasta = new FormControl();
  referente = new FormControl();
  estado_cai : number = -1;
  estado_doc : number = -1;
  autorizacion : number = -1;
  contabilidad : number = -1;
  imputacion : number = -1;
  pageOffset : number = 0;
  pageLimit : number = 10;
  referenteId : string = null

  estados = [
    {id: -1, value: 'Todos'},
    // {id: 0, value: 'Aut'}, 
    {id: 0, value: 'PTE'}, 
    // {id: 1, value: 'RECH'},
    {id: 1, value: 'OK'},
  ];

  suscripcionConsDin: Subscription;

  // MatPaginator
  pageLength = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  
  constructor(private comprobantesService: ComprobantesService,
    private ngxSmartModalService: NgxSmartModalService,
    private snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    this.comprobantesService.getComprobantes(null).subscribe(data => {
      console.log("Lista comprobantes: ",data)
      this.comprobantes = data;
      this._comprobantes.data = this.comprobantes;
      this._comprobantes.paginator = this.paginator;
      this._comprobantes.sort = this.sort;
    })
  }

  filtrar() : void {
    let filtro : Object = { Tipo_Operacion: "FAC" };
    if(this.desde.value) {
      filtro['Fecha_Desde'] = moment(new Date(this.desde.value)).format("YYYY-MM-DD");
    } else {
      filtro['Fecha_Desde'] = "2000-01-01";
    }
    if(this.hasta.value) {
      filtro['Fecha_Hasta'] = moment(new Date(this.hasta.value)).format("YYYY-MM-DD");
    } else {
      filtro['Fecha_Hasta'] = moment(new Date()).format("YYYY-MM-DD")
    }
    if(this.referente.value == null || this.referente.value == undefined || this.referente.value == "") {
      this.referenteId = null;
    }
    filtro['Id_Referente'] = this.referenteId ? this.referenteId : "";
    filtro['Estado_CAI'] = this.estado_cai;
    filtro['Estado_Documentacion'] = this.estado_doc;
    filtro['Estado_Impositivo'] = this.imputacion;
    filtro['Estado_Contable'] = this.contabilidad;
    filtro['Estado_Presupuestario'] = this.autorizacion;
    filtro['param_limite'] = this.pageLimit;
    filtro['param_offset'] = this.pageOffset;

    console.log("Filtrando con", filtro);

    this.comprobantesService.getComprobantes(filtro).subscribe(data => {
      this.comprobantes = data;
      this._comprobantes.data = this.comprobantes;
      this._comprobantes.paginator = this.paginator;
      this._comprobantes.sort = this.sort;
      // console.log("# Elementos: ",this.comprobantes.length)
    })
  }

  getPagina(value : any) {
    /* 
      value es un objeto con el formato 
      {"previousPageIndex":0,"pageIndex":0,"pageSize":5,"length":10}
    */
    if(this.pageLength == (value.pageSize * (value.pageIndex + 1))){
      this.pageLength *= 2;
    }
    /* this.pageOffset = value.pageSize * value.pageIndex;
    this.pageLimit = value.pageSize * (value.pageIndex + 1);
    console.log("Paginado", this.pageOffset, this.pageLimit, " of ", this.pageLength)
    this.filtrar(); */
  }

  ocultarColumna() : void {
    if(this.columnsToDisplay.length == 9)
      this.columnsToDisplay = ['numCompr', 'fecha', 'referente', 'total', 'estado_cai', 'estado_doc', 'autorizacion', 'contabilidad', 'imputacion', 'edit'];
    else 
      this.columnsToDisplay = ['numCompr', 'fecha', 'referente', 'total', 'estado_cai', 'estado_doc', 'autorizacion', 'contabilidad', 'edit'];
  }

  saludar() : void {
    alert(`FILTROS: 
      ${this.desde.value})
      ${this.hasta.value}
      ${this.estado_cai} 
      ${this.estado_doc}
      ${this.autorizacion}
      ${this.contabilidad}
      ${this.imputacion}
      ${this.referente}
    ` )
  }

  abrirConsulta(consulta: string){
    let datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null,
      modal: 'consDinModal'
    }
    
    this.ngxSmartModalService.resetModalData(datosModal.modal);
    this.ngxSmartModalService.setModalData(datosModal, datosModal.modal);
    
    this.suscripcionConsDin = this.ngxSmartModalService.getModal(datosModal.modal).onClose
      .subscribe((modal: NgxSmartModalComponent) => {
        let respuesta = this.ngxSmartModalService.getModalData(datosModal.modal);

        if (respuesta.estado === 'cancelado'){
          this.openSnackBar('Se canceló la selección de Proveedor');
        }
        else{
          console.log("Elegido: ", respuesta.selection[0])
          this.referente.setValue(respuesta.selection[0].name);
          this.referenteId = respuesta.selection[0].id;
        }

        this.suscripcionConsDin.unsubscribe();
      });
    this.ngxSmartModalService.open(datosModal.modal);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

}
