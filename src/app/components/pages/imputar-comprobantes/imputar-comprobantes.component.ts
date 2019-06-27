import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';
import { RemesasService } from 'src/app/services/i2t/remesas.service'
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { RemesaComprobantes, RemesaComprobantesImputar } from 'src/app/interfaces/remesas.interface'

@Component({
  selector: 'app-imputar-comprobantes',
  templateUrl: './imputar-comprobantes.component.html',
  styleUrls: ['./imputar-comprobantes.component.css']
})
export class ImputarComprobantesComponent implements OnInit {

  loading: boolean = false;
  forma: FormGroup;
  token: any;
  logueado:boolean;

  datosComp: any;
  Comprobantes: RemesaComprobantes[] = []
  dataSource = new MatTableDataSource
  
  filteredValues = { Razon_Social:''}

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _remesasService: RemesasService,
              public ngxSmartModalService: NgxSmartModalService,
              private route:ActivatedRoute,private router: Router,
              @Inject(SESSION_STORAGE) private storage: StorageService) { 

    this.token = localStorage.getItem('TOKEN')
    this.forma = new FormGroup({
      'tipo': new FormControl(),
      'fecDesde': new FormControl(),
      'fecHasta': new FormControl(),
      'categoria': new FormControl(),
      'nombre': new FormControl('')

    })
  }

  ngAfterViewInit(){
   
    this.ngxSmartModalService.getModal('imputCompModal').onOpen.subscribe(() => {
    //  this.inputParam = this.ngxSmartModalService.getModalData('evidenciasModal');
    //  console.log('datos recibidos por modal de evidencias: ', this.inputParam);
    //  this.nuevo = this.inputParam.nuevo;
      this.obtenerComprobantes();
    });
  }

  ngOnInit() {
    // this.forma.controls['nombre'].statusChanges.subscribe((nameFilterValue) => {
    //   this.filteredValues['proveedor'] = nameFilterValue;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues);
    //   console.log(this.filteredValues)
    // });
    // this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  filtro() {
      this.filteredValues['Razon_Social'] = this.forma.controls['nombre'].value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    const myFilterPredicate = function(data:RemesaComprobantesImputar,filter:string) :boolean {
      let searchString = JSON.parse(filter);
      return data.Razon_Social.toString().trim().toLowerCase().indexOf(searchString.Razon_Social.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }


  obtenerComprobantes(){
    let jsbody = {
      "Razon_Social_Proveedor": "JCABR",
      "Categ_Proveedor": "Empleados",
      "Tipo_Comprobante": "MIN",
      "Fecha_desde": "2018-06-25",
      "Fecha_hasta": "2018-07-10",
      "Criticidad_Comprobante": "N",
      "Criticidad_Proveedor": "N",
      "param_limite": 5,
      "param_offset": 0
    }
    
    let jsonbody = JSON.stringify(jsbody)
    this._remesasService.postComprobantesImputar(jsonbody, this.token)
      .subscribe( resp =>{
        this.datosComp = resp
        this.Comprobantes = this.datosComp.dataset
        this.dataSource = new MatTableDataSource(this.Comprobantes)
      })
  }
}
