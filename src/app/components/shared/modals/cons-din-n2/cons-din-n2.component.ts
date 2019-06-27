import { Component, OnInit, Output, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cons-din-n2',
  templateUrl: './cons-din-n2.component.html',
  styleUrls: ['./cons-din-n2.component.css']
})
export class ConsDinN2Component implements OnInit, AfterViewInit {

  suscripcionesModal: Subscription[] = [];

  constructor(public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    console.log('inicializando segundo nivel')
    //suscribir a los eventos de escape del modal, para no hacer nada en esos casos
    this.suscripcionesModal[0] = this.ngxSmartModalService.getModal('consDinModalN2').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      console.log('dismissed modal de consulta dinamica: ', modal.getData());
      this.ngxSmartModalService.resetModalData('consDinModalN2');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModalN2');
      // this.suscripcionesModal[0].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a dismiss')

    this.suscripcionesModal[1] = this.ngxSmartModalService.getModal('consDinModalN2').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      console.log('escaped modal de consulta dinamica: ', modal.getData());
      this.ngxSmartModalService.resetModalData('consDinModalN2');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModalN2');
      // this.suscripcionesModal[1].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a escape')
  }

  aplicar(){
    console.log('ejecutando aplicar de cons n2')
    this.ngxSmartModalService.close('consDinModalN2');
  }

  cancelar(){
    console.log('ejecutando cancelar de cons n2')

    this.ngxSmartModalService.resetModalData('consDinModalN2');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'consDinModalN2');
    this.ngxSmartModalService.close('consDinModalN2');
  }
}
