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
  inputParam: any;
  suscripcionesModal: Subscription[] = [];
  //nuevo: boolean = false;

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }


  ngAfterViewInit()
  {
    this.ngxSmartModalService.getModal('evidenciasModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('evidenciasModal');
      console.log('datos recibidos por modal de evidencias: ', this.inputParam);
    });
    
  }

  cancelar(){
    this.ngxSmartModalService.resetModalData('evidenciasModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado', nuevo: false}, 'evidenciasModal');
    this.ngxSmartModalService.close('evidenciasModal');
  }
}
