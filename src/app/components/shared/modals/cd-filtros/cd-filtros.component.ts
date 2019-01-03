import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-cd-filtros',
  templateUrl: './cd-filtros.component.html',
  styleUrls: ['./cd-filtros.component.css']
})
export class CdFiltrosComponent implements AfterViewInit {
  constructor(public ngxSmartModalService: NgxSmartModalService) {
  }

  ngAfterViewInit() {
    
    };

}
