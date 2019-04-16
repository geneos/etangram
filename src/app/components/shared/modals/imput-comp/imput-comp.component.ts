import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-imput-comp',
  templateUrl: './imput-comp.component.html',
  styleUrls: ['./imput-comp.component.css']
})
export class ImputCompComponent implements OnInit {

  suscripcionesModal: Subscription[] = [];
  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    //suscribir a los eventos de escape del modal, para no hacer nada en esos casos
    this.suscripcionesModal[0] = this.ngxSmartModalService.getModal('imputCompModal').onDismiss.subscribe((modal: NgxSmartModalComponent) => {
      console.log('dismissed modal imputCompModal: ', modal.getData());
      this.ngxSmartModalService.resetModalData('imputCompModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'imputCompModal');
      // this.suscripcionesModal[0].unsubscribe();
    });
    console.log('Modal Consulta din - ngAfterViewInit: suscripto a dismiss')

    this.suscripcionesModal[1] = this.ngxSmartModalService.getModal('imputCompModal').onEscape.subscribe((modal: NgxSmartModalComponent) => {
      console.log('escaped modal de imputCompModal: ', modal.getData());
      this.ngxSmartModalService.resetModalData('imputCompModal');
      this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'imputCompModal');
      // this.suscripcionesModal[1].unsubscribe();
    });
    console.log('Modal imputCompModal - ngAfterViewInit: suscripto a escape')
  }

  aplicar(){
    this.ngxSmartModalService.close('imputCompModal');
  }

  cancelar(){
    this.ngxSmartModalService.resetModalData('imputCompModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'imputCompModal');
    this.ngxSmartModalService.close('imputCompModal');
  }
}
