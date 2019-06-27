import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MinContablesService } from 'src/app/services/i2t/min-contables.service';
import { MinContable } from 'src/app/interfaces/min-contable.interface';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const TOKEN = '';

@Injectable()

@Component({
  selector: 'app-abm-min-contables',
  templateUrl: './abm-min-contables.component.html',
  styleUrls: ['./abm-min-contables.component.css']
})
export class AbmMinContablesComponent implements OnInit {

  token: string = "a";
  auxRC:any;
  loginData: any;
  mcData:any;

  minContablesAll:MinContable[];
  loading:boolean;
  logueado: boolean = true;
  constMinContables = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableMinContables') table: MatTable<any>;

  selection = new SelectionModel(true, []);

//todo borrar, cambiar por lo real
/* datos =
  {
    returnset: [
        {
            RCode: 1,
            RTxt: 'OK',
            RId: null,
            RSQLErrNo: 0,
            RSQLErrtxt: 'OK'
        }
    ],
    dataset: [
        {
            id: '1',
            name: 'Test 1',
            estado: 0,
            assigned_user_id: 1,
            created_by: 'lsole',
            date_entered: '01/12/2018',
            date_modified: '01/12/2018',
            deleted: 0,
            tg01_monedas_id2_c: '1',
            account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
            tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
            fecha: '01/12/2018',
            tg01_cajas_id_c: 'd336b046-ee63-11e8-ab85-d050990fe081'

        },
        {
          id: '2',
          name: 'Test 2',
          estado: 0,
          assigned_user_id: 1,
          created_by: 'lsole',
          date_entered: '01/12/2018',
          date_modified: '01/12/2018',
          deleted: 0,
          tg01_monedas_id2_c: '1',
          account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
          tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
          fecha: '02/12/2018',
          tg01_cajas_id_c: 'd50a0d5c-c723-88d6-85df-5bf882d33847'

      },
      {
        id: '3',
        name: 'Test 3',
        estado: 0,
        assigned_user_id: 1,
        created_by: 'lsole',
        date_entered: '01/12/2018',
        date_modified: '01/12/2018',
        deleted: 0,
        tg01_monedas_id2_c: '1',
        account_id1_c: 'b2a2ad2c-e955-00e5-fc7d-5bf87c0ec6b1',
        tg01_tipocomprobante_id_c: '43966f4a-4fc8-11e8-b1a0-d050990fe081',
        fecha: '03/12/2018',
        tg01_cajas_id_c: 'd336b046-ee63-11e8-ab85-d050990fe081'
      }
    ]
  } */
  // todo borrar

  constructor(
    private _minContablesService:MinContablesService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    console.log(localStorage.getItem(TOKEN) || 'Local storage is empty');
    this.token = localStorage.getItem('TOKEN')
  //  this.token = this.storage.get(TOKEN);

  if (localStorage.length == 0){
    this.loading = true;
    setTimeout(() => {
      this.logueado = false;     
   //   this.openSnackBar('No ha iniciado sesión')
    }, 1000);  //2s
  } else {
    this.loading = false;
  } 
    this.buscarMinContable();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constMinContables.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constMinContables.data.forEach(row => this.selection.select(row));
  }

  buscarMinContable(){
    /* this.minContablesAll = this.datos.dataset;
    console.log(this.minContablesAll);
    this.loading = false;

    this.constMinContables = new MatTableDataSource(this.minContablesAll);

    this.constMinContables.sort = this.sort;
    this.constMinContables.paginator = this.paginator; */


    /////

    let jsbody = {
        "ID_Comprobante":"",
        "Id_Cliente":"",
        "Fecha_desde":"",
        "Fecha_hasta":"",
        "param_limite":"10000",
        "param_offset":"0"
    };
    let jsonbody= JSON.stringify(jsbody);

    this._minContablesService.getMinContables(jsonbody, this.token )
      .subscribe( dataMC => {
        //console.log(dataMC);
          this.mcData = dataMC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.mcData.returnset[0].RCode=="-6003"){
            //token invalido
            /*this.minContablesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._minContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarMinContable();
              });*/
              console.log('token invalido')
            } else {
              if(this.mcData.dataset.length>0){
                this.minContablesAll = this.mcData.dataset;
                console.log(this.minContablesAll);
                this.loading = false;
                //todo cambiar cuando se pueda traer sólo minutas con el servicio
                //this.constMinContables = new MatTableDataSource(this.minContablesAll);
                this.constMinContables = new MatTableDataSource(this.minContablesAll.filter(minuta => minuta.tipooperacion === '5d73571b-dbb1-a045-cce3-5adfa5f59c9c'));

                this.constMinContables.sort = this.sort;
                this.constMinContables.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.minContablesAll = null;
              }
            }
            //console.log(this.minContablesAll);
      });

  }

  }
