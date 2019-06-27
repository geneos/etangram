import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { ProveedoresService } from 'src/app/services/i2t/proveedores.service'

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.css']
})
export class ImgComponent implements OnInit {

  token: string;
  respData: any;
  suscripcionesModal: Subscription[] = [];
  inputParam: any;
  imgUrl: string;
  constructor(public ngxSmartModalService: NgxSmartModalService,
              private _proveedoresService: ProveedoresService) { }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
   
    this.ngxSmartModalService.getModal('imgModal').onOpen.subscribe(() => {
      this.inputParam = this.ngxSmartModalService.getModalData('imgModal');
      console.log('datos recibidos por modal de imgModal: ', this.inputParam);
      this.imgUrl = this.inputParam.url;
    });
  }

  cerrar(){
    this.ngxSmartModalService.resetModalData('imgModal');
    this.ngxSmartModalService.setModalData({estado: 'cancelado'}, 'imgModal');
    this.ngxSmartModalService.close('imgModal');
  }
}
