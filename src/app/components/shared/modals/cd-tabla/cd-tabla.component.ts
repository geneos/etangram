import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-cd-tabla',
  templateUrl: './cd-tabla.component.html',
  styleUrls: ['./cd-tabla.component.css']
})
export class CdTablaComponent implements AfterViewInit {
  constructor(public ngxSmartModalService: NgxSmartModalService) {
  }

  ngAfterViewInit(){
    
  }

}
