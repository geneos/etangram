import { Component, OnInit, Output, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cons-din',
  templateUrl: './cons-din.component.html',
  styleUrls: ['./cons-din.component.css']
})
export class ConsDinComponent implements OnInit, AfterViewInit {

  suscripcionesModal: Subscription[] = [];

  constructor(public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    //suscribir a los eventos de escape del modal, para no hacer nada en esos casos
    this.suscripcionesModal[0] = this.ngxSmartModalService.getModal('consDinModal').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      console.log('dismissed modal de consulta dinamica: ', modal.getData());
      this.ngxSmartModalService.resetModalData('consDinModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModal');
      // this.suscripcionesModal[0].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a dismiss')

    this.suscripcionesModal[1] = this.ngxSmartModalService.getModal('consDinModal').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      console.log('escaped modal de consulta dinamica: ', modal.getData());
      this.ngxSmartModalService.resetModalData('consDinModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModal');
      // this.suscripcionesModal[1].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a escape')
  }

  aplicar(){
    this.ngxSmartModalService.close('consDinModal');
  }

  cancelar(){
    this.ngxSmartModalService.resetModalData('consDinModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModal');
    this.ngxSmartModalService.close('consDinModal');
  }
}
