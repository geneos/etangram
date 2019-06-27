import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { PlanCuentasService } from "../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../interfaces/plan-cuenta.interface";
import { TablapcComponent } from "../../shared/tablapc/tablapc.component";
import { Router, ActivatedRoute } from "@angular/router";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-abm-plan-de-cuentas',
  templateUrl: './abm-plan-de-cuentas.component.html',
  styleUrls: ['./abm-plan-de-cuentas.component.css']
})
export class AbmPlanDeCuentasComponent implements OnInit {

  @ViewChild('tablapc') compTablaPC:TablapcComponent;

  loading:boolean;
  logueado: boolean = true;
  paramVueltaId: string;
  token: string = "a";

  constructor(private _planCuentasService:PlanCuentasService,
              private route:ActivatedRoute,
              private router: Router,
              @Inject(SESSION_STORAGE) private storage: StorageService) {
    //this.loading = true;
    this.route.params.subscribe( parametros=>{
      this.paramVueltaId = parametros['id'];
      //this.urla = this.id;

    });
    console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem('TOKEN')
    if (localStorage.length == 0){
      this.loading = true;
      setTimeout(() => {
        this.logueado = false;     
     //   this.openSnackBar('No ha iniciado sesión')
      }, 1000);  //2s
    } else {
      this.loading = false;
    } 
  }

  ngOnInit() {  }

  }
