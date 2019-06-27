import { Component, OnInit, Output, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service'

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {
  token: string;
  respData: any;
  suscripcionesModal: Subscription[] = [];
  inputParam: any;

  constructor(public ngxSmartModalService: NgxSmartModalService,
              private _proveedoresService: ProveedoresService) { }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    console.log('inicializando segundo nivel')
    //suscribir a los eventos de escape del modal, para no hacer nada en esos casos
    this.suscripcionesModal[0] = this.ngxSmartModalService.getModal('formulariosModal').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      console.log('dismissed modal de evidencias: ', modal.getData());
      this.ngxSmartModalService.resetModalData('formulariosModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'formulariosModal');
      // this.suscripcionesModal[0].unsubscribe();
    });
    console.log('Modal Formularios - ngAfterViewInit: suscripto a dismiss')

    this.suscripcionesModal[1] = this.ngxSmartModalService.getModal('formulariosModal').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      console.log('escaped modal de formularios: ', modal.getData());
      this.ngxSmartModalService.resetModalData('formulariosModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'formulariosModal');
      // this.suscripcionesModal[1].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a escape')
    this.ngxSmartModalService.getModal('formulariosModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('formulariosModal');
      console.log('datos recibidos por modal de formularios: ', this.inputParam);
    });
  }

  guardar(){
    console.log(this.inputParam.url)
   // this.ngxSmartModalService.resetModalData('formulariosModal');
    this.ngxSmartModalService.setModalData({estado: 'guardado'}, 'formulariosModal');
    this.ngxSmartModalService.close('formulariosModal');
  }
  cancelar(){
    this.ngxSmartModalService.resetModalData('formulariosModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'formulariosModal');
    this.ngxSmartModalService.close('formulariosModal');
  }

 
}
