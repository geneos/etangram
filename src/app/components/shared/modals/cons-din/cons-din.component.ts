import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
@Component({
  selector: 'app-cons-din',
  templateUrl: './cons-din.component.html',
  styleUrls: ['./cons-din.component.css']
})
export class ConsDinComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
  }

}
