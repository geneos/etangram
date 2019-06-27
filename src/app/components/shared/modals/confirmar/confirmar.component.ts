import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit, AfterViewInit {

  loading:boolean;
  mensaje: string = '';

  constructor(
    public ngxSmartModalService: NgxSmartModalService,) { 
    // this.mensaje = '';
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.ngxSmartModalService.getModal('confirmar').onOpen.subscribe(() => {
      this.loading = true;
      let msg = this.ngxSmartModalService.getModalData('confirmar');
      if (msg != null){
        this.mensaje = msg;
      }
      else{
        //mensaje por default
        this.mensaje = '¿Está seguro?';
      }
      this.loading = false;
    });
  }      

  aceptar(){
    console.log('cerrando modal de confirmar, aceptando')
    this.ngxSmartModalService.resetModalData('confirmar');
    this.ngxSmartModalService.setModalData({estado: 'confirmado'}, 'confirmar');
    this.ngxSmartModalService.close('confirmar');
  }
  cancelar(){
    console.log('cerrando modal de confirmar, cancelando')
    this.ngxSmartModalService.resetModalData('confirmar');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'confirmar');
    this.ngxSmartModalService.close('confirmar');
  }
}
