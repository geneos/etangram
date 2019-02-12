import { Component, OnInit, Output, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css']
})
export class EvidenciasComponent implements OnInit, AfterViewInit {

  suscripcionesModal: Subscription[] = [];

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    console.log('inicializando segundo nivel')
    //suscribir a los eventos de escape del modal, para no hacer nada en esos casos
    this.suscripcionesModal[0] = this.ngxSmartModalService.getModal('evidenciasModal').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      console.log('dismissed modal de evidencias: ', modal.getData());
      this.ngxSmartModalService.resetModalData('evidenciasModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'evidenciasModal');
      // this.suscripcionesModal[0].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a dismiss')

    this.suscripcionesModal[1] = this.ngxSmartModalService.getModal('evidenciasModal').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      console.log('escaped modal de evidencias: ', modal.getData());
      this.ngxSmartModalService.resetModalData('evidenciasModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'evidenciasModal');
      // this.suscripcionesModal[1].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a escape')
  }

  cancelar(){
    this.ngxSmartModalService.resetModalData('evidenciasModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'evidenciasModal');
    this.ngxSmartModalService.close('evidenciasModal');
  }
}
