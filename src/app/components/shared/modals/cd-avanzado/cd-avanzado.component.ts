import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-cd-avanzado',
  templateUrl: './cd-avanzado.component.html',
  styleUrls: ['./cd-avanzado.component.css']
})
export class CdAvanzadoComponent implements AfterViewInit {
  constructor(public ngxSmartModalService: NgxSmartModalService) {
  }

  ngAfterViewInit(){
    
  }

}
