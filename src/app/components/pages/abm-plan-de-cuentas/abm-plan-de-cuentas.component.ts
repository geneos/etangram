import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanCuentasService } from "../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../interfaces/plan-cuenta.interface";
import { TablapcComponent } from "../../shared/tablapc/tablapc.component"

@Component({
  selector: 'app-abm-plan-de-cuentas',
  templateUrl: './abm-plan-de-cuentas.component.html',
  styleUrls: ['./abm-plan-de-cuentas.component.css']
})
export class AbmPlanDeCuentasComponent implements OnInit {

  @ViewChild('tablapc') compTablaPC:TablapcComponent;

  loading:boolean;

  constructor(private _planCuentasService:PlanCuentasService) {
    //this.loading = true;
  }

  ngOnInit() {  }

  }
