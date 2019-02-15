import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar,MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatPaginator } from '@angular/material';
import { PlanCuentasService } from "../../../../services/i2t/plan-cuentas.service";
import { PlanCuenta } from "../../../../interfaces/plan-cuenta.interface";
import { RefContable } from 'src/app/interfaces/ref-contable.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { RefContablesService } from 'src/app/services/i2t/ref-contables.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-alta-plan-de-cuentas',
  templateUrl: './alta-plan-de-cuentas.component.html',
  styleUrls: ['./alta-plan-de-cuentas.component.css']
})
export class AltaPlanDeCuentasComponent implements OnInit {

  constPlanesCuentas :PlanCuenta[];

  forma:FormGroup;
  id:any;
  padre:any;
  existe:boolean;
  token: string = "a";
  pcData: any;
  planDeCuentas: PlanCuenta;
  loginData: any;

  loading:boolean;
  auxresp: any;

  today: Date;
  datetime: string = '';

  //para la lista de referencias contables
  refContablesAll:RefContable[];
  constRefContables = new MatTableDataSource();
  constRefContablesNull = new MatTableDataSource();
  refContableElegida:any;
  mostrarReferencias:boolean;

  rcData:any;

  //@ViewChild(MatSort) sort: MatSort;
//  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tableRefContables') table: MatTable<any>;
  @ViewChild('tableRefContablesNull') tableNull: MatTable<any>;

  selection = new SelectionModel(true, []);
  cdadniveles: number;
  cdadnivelespadre: any;
  //

  constructor(
    private route:ActivatedRoute,
    private _PlanCuentasService:PlanCuentasService,
    private router: Router,
    public snackBar: MatSnackBar,
    private _refContablesService:RefContablesService
  ) {
    this.loading = true;

    this.forma = new FormGroup({
      //'id': new FormControl('',Validators.required),
      'cuentacontable': new FormControl(),
      'name': new FormControl('',Validators.required),
      'imputable': new FormControl('',Validators.required),
      'patrimonial': new FormControl(),
      //'nomenclador': new FormControl(),
      //'nomencladorpadre': new FormControl(),
      //'orden': new FormControl('',Validators.required),
      'n1': new FormControl('',Validators.required),
      'n2': new FormControl('',Validators.required),
      'n3': new FormControl('',Validators.required),
      'n4': new FormControl('',Validators.required),
      'n5': new FormControl('',Validators.required),
      'n6': new FormControl('',Validators.required),
      'estado': new FormControl('',Validators.required),
    });

    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      this.padre = parametros['padre'];
      this.existe = false;

      if( this.id !== "nuevo" ){
        this.buscarPlanDeCuentas(this.id);
        /*if(this.forma.controls['imputable'].value == '0'){
          this.forma.controls['patrimonial'].disable();
        }*/
      } else {
        this.loading = false;
        this.forma.controls['estado'].setValue('0');
      }

      //this.forma.controls['nomencladorpadre'].disable();
      //this.forma.controls['nomenclador'].disable();

    });
  }

  getdatetime(){
    this.today = new Date();
    return formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'en-US', '-0300');
  }

  reiniciar(){
    //this.forma.controls['cuentacontable'].setValue(this.planDeCuentas.cuentacontable);
    this.forma.controls['name'].reset();
    //this.forma.controls['nomenclador'].setValue(this.planDeCuentas.nomenclador);
    //this.forma.controls['nomencladorpadre'].setValue(this.planDeCuentas.nomencladorpadre);
    //this.forma.controls['orden'].setValue(this.planDeCuentas.orden);
    this.forma.controls['imputable'].reset();
    this.forma.controls['patrimonial'].reset();
    this.forma.controls['estado'].reset();
  }

  /** Whether the number of selected elements matches the total number of rows. */
/*  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.constRefContables.data.length;
    return numSelected === numRows;
  }*/

  /** Selects all rows if they are not all selected; otherwise clear selection. */
/*  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.constRefContables.data.forEach(row => this.selection.select(row));
  }*/

  buscarPlanDeCuentas(auxid:string){
    this._PlanCuentasService.getPlanDeCuentas( auxid, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataPC => {
        console.log(dataPC);
          this.pcData = dataPC;
          //auxProvData = this.pcData.dataset.length;
          if(this.pcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarPlanDeCuentas(auxid);
              });
            } else {
              if(this.pcData.dataset.length>0){
                this.planDeCuentas = this.pcData.dataset[0];
                this.existe = true;
                if (this.existe == true){
                  //console.log(this.planDeCuentas);
                  this.loading = false;

                  var strnivel = this.planDeCuentas.id;
                  var niveles = strnivel.split(".");

                  var strpadre = this.planDeCuentas.nomenclador;
                  var nivelespadre = strpadre.split(".");
                  this.cdadniveles = nivelespadre.length;
                  console.log(this.cdadniveles);

                  this.forma.controls['cuentacontable'].setValue(this.planDeCuentas.cuentacontable);
                  this.forma.controls['name'].setValue(this.planDeCuentas.name);
                  //this.forma.controls['nomenclador'].setValue(this.planDeCuentas.nomenclador);
                  //this.forma.controls['nomencladorpadre'].setValue(this.planDeCuentas.nomencladorpadre);
                  //this.forma.controls['orden'].setValue(this.planDeCuentas.orden);
                  this.forma.controls['n1'].setValue(niveles[0]);
                  this.forma.controls['n2'].setValue(niveles[1]);
                  this.forma.controls['n3'].setValue(niveles[2]);
                  this.forma.controls['n4'].setValue(niveles[3]);
                  this.forma.controls['n5'].setValue(niveles[4]);
                  this.forma.controls['n6'].setValue(niveles[5]);
                  this.forma.controls['imputable'].setValue(this.planDeCuentas.imputable.toString());
                  this.forma.controls['patrimonial'].setValue(this.planDeCuentas.patrimonial.toString());
                  this.forma.controls['estado'].setValue(this.planDeCuentas.estado.toString());

                  if(this.cdadniveles!=1){this.forma.controls['n1'].disable();}
                  if(this.cdadniveles!=2){this.forma.controls['n2'].disable();}
                  if(this.cdadniveles!=3){this.forma.controls['n3'].disable();}
                  if(this.cdadniveles!=4){this.forma.controls['n4'].disable();}
                  if(this.cdadniveles!=5){this.forma.controls['n5'].disable();}
                  if(this.cdadniveles!=6){this.forma.controls['n6'].disable();}

                  this.cdadnivelespadre = this.cdadniveles - 1

                }
              } else {
                this.planDeCuentas = null;
                this.existe = false;
                if (this.existe == false){
                  console.log('no existe este id!');
                  this.forma.controls['cuentacontable'].disable();
                  this.forma.controls['name'].disable();
                  this.forma.controls['imputable'].disable();
                  this.forma.controls['patrimonial'].disable();
                  //this.forma.controls['nomenclador'].disable();
                  //this.forma.controls['nomencladorpadre'].disable();
                  //this.forma.controls['orden'].disable();
                  this.forma.controls['n1'].disable();
                  this.forma.controls['n2'].disable();
                  this.forma.controls['n3'].disable();
                  this.forma.controls['n4'].disable();
                  this.forma.controls['n5'].disable();
                  this.forma.controls['n6'].disable();
                  this.forma.controls['estado'].disable();
                }
              }
            }

      });
  }

   /* <!--
   id                  if:string;
   Nombre              nombre:string;
   Cuenta Contable     cuenta_contable:string;
   Nomenclador         nomenclador:string;
   Nomenclador Padre   nomenclador_padre:string;
   Orden               orden:string;
   Estado              estado:number;

   Imputable?          imputable:number;
   Patrimonial?        patrimonial:number;
   --> */

  ngOnInit() {
    //console.log();

    //subscribir al cambio de valores en el valor de "imputable"
    //necesario para mostrar u ocultar correctamente al iniciar la pantalla
    //todo: investigar una mejor forma
    //posibles: ngZone, ChangeDetectorRef.DetectChanges. Requieren incluir en constructor
    this.forma.get('imputable').valueChanges.subscribe(
      value => {  if (value == 1) {
                    this.mostrarReferencias = true;
                  }
                  else{
                    this.mostrarReferencias = false;
                  }

    });

    if(this.padre == null && this.id == "nuevo"){
      //this.forma.controls['nomencladorpadre'].setValue(this.padre);
      this.forma.controls['n2'].disable();
      this.forma.controls['n3'].disable();
      this.forma.controls['n4'].disable();
      this.forma.controls['n5'].disable();
      this.forma.controls['n6'].disable();
    }
    if(this.padre != null && this.id == "nuevo"){
      var nivelespadre2 = this.padre.split(".");
      this.cdadnivelespadre = nivelespadre2.length;

      this.forma.controls['n1'].setValue(nivelespadre2[0]);
      this.forma.controls['n2'].setValue(nivelespadre2[1]);
      this.forma.controls['n3'].setValue(nivelespadre2[2]);
      this.forma.controls['n4'].setValue(nivelespadre2[3]);
      this.forma.controls['n5'].setValue(nivelespadre2[4]);
      this.forma.controls['n6'].setValue(nivelespadre2[5]);
      if(this.cdadnivelespadre+1!=1){this.forma.controls['n1'].disable();}
      if(this.cdadnivelespadre+1!=2){this.forma.controls['n2'].disable();}
      if(this.cdadnivelespadre+1!=3){this.forma.controls['n3'].disable();}
      if(this.cdadnivelespadre+1!=4){this.forma.controls['n4'].disable();}
      if(this.cdadnivelespadre+1!=5){this.forma.controls['n5'].disable();}
      if(this.cdadnivelespadre+1!=6){this.forma.controls['n6'].disable();}
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  eliminarPlanDeCuentas(){
    var d = new Date();
    var d2;
    if( this.planDeCuentas.date_entered != null){
      d2 = (this.planDeCuentas.date_entered);
      d2 = d2.substring(0, 10);
    }

    // let usuarioActual: any = this.obtenerIDUsuario().id;
    let usuarioActual: any = 'idDePrueba';
    let jsbody = {
      "id":this.planDeCuentas.id,
      "name":this.planDeCuentas.name,
      "cuentacontable":this.planDeCuentas.cuentacontable,
      /* "date_entered":d2,
      "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), */
      "date_entered":this.planDeCuentas.date_entered,
      "date_modified":this.getdatetime(),
      "modified_user_id":usuarioActual,//hardcoded
      "created_by":this.planDeCuentas.created_by,//hardcoded
      "description":null,//hardcoded
      "deleted":1,//hardcoded
      "assigned_user_id":1,//hardcoded
      "estado":0 //this.planDeCuentas.estado
      /* ,
      "patrimonial":??,
      "imputable":??,
      "estado":??, */
    };

    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._PlanCuentasService.putPlanDeCuentas( this.planDeCuentas.id,jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp);
        this.auxresp = resp;
        if(this.auxresp.returnset[0].RCode=="-6003"){
          //token invalido
          //this.planDeCuentas = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._PlanCuentasService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.guardarPlanDeCuentas();
            });
          } else {
            if (this.auxresp.returnset[0].RCode=="1"){
              // baja ok
              this.openSnackBar("Baja realizada con éxito.");
              this.router.navigate(['/plan-cuentas']);
            } else {
              //error en la baja
              this.openSnackBar("Error. Baja no permitida.");
            }
        }
      });
  }

  guardarPlanDeCuentas(){
    console.log(this.cdadnivelespadre);

    var auxnomenclador = this.forma.controls['n1'].value;
    if(this.cdadnivelespadre>=1){auxnomenclador += '.'+this.forma.controls['n2'].value;}
    if(this.cdadnivelespadre>=2){auxnomenclador += '.'+this.forma.controls['n3'].value;}
    if(this.cdadnivelespadre>=3){auxnomenclador += '.'+this.forma.controls['n4'].value;}
    if(this.cdadnivelespadre>=4){auxnomenclador += '.'+this.forma.controls['n5'].value;}
    if(this.cdadnivelespadre>=5){auxnomenclador += '.'+this.forma.controls['n6'].value;}

    var auxnomencladorpadre ='';
    if(this.cdadnivelespadre>=1){auxnomencladorpadre += this.forma.controls['n1'].value;}
    if(this.cdadnivelespadre>=2){auxnomencladorpadre += '.'+this.forma.controls['n2'].value;}
    if(this.cdadnivelespadre>=3){auxnomencladorpadre += '.'+this.forma.controls['n3'].value;}
    if(this.cdadnivelespadre>=4){auxnomencladorpadre += '.'+this.forma.controls['n4'].value;}
    if(this.cdadnivelespadre>=5){auxnomencladorpadre += '.'+this.forma.controls['n5'].value;}
    if(this.cdadnivelespadre>=6){auxnomencladorpadre += '.'+this.forma.controls['n6'].value;}

    var auxid = this.forma.controls['n1'].value;
    if(this.cdadnivelespadre>=1){auxid += '.'+this.forma.controls['n2'].value;}else{auxid += '.0'}
    if(this.cdadnivelespadre>=2){auxid += '.'+this.forma.controls['n3'].value;}else{auxid += '.0'}
    if(this.cdadnivelespadre>=3){auxid += '.'+this.forma.controls['n4'].value;}else{auxid += '.0'}
    if(this.cdadnivelespadre>=4){auxid += '.'+this.forma.controls['n5'].value;}else{auxid += '.0'}
    if(this.cdadnivelespadre>=5){auxid += '.'+this.forma.controls['n6'].value;}else{auxid += '.0'}

    var auxorden;
    if(this.forma.controls['imputable'].value==0){auxorden=0}
    else{auxorden=this.forma.controls['n'+(this.cdadnivelespadre+1)].value;}

    if( this.id == "nuevo" ){
      // insertando
      var d = new Date();
      var auxpat = this.forma.controls['patrimonial'].value;
      if(!auxpat){auxpat = 0}

      // let usuarioActual: any = this.obtenerIDUsuario().id;
      let usuarioActual: any = 'idDePrueba';
      let jsbody = {
        "id":auxid,
        "cuentacontable":auxid,
        "name":this.forma.controls['name'].value,
        "nomenclador":auxnomenclador,
        "nomencladorpadre":auxnomencladorpadre,
        "orden":auxorden,
        "imputable":this.forma.controls['imputable'].value,
        "patrimonial":auxpat,//this.forma.controls['patrimonial'].value,
        "estado":this.forma.controls['estado'].value,
        //auditoría
        /* "date_entered":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), */
        "date_entered":this.getdatetime(),
        "date_modified":this.getdatetime(),
        "modified_user_id":usuarioActual,//hardcoded
        "created_by":usuarioActual,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
      };

      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._PlanCuentasService.postPlanDeCuentas( jsonbody,this.token )
        .subscribe( resp => {
          //console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarPlanDeCuentas();
              });
            } else {
              console.log(this.auxresp);
              // si viene codigo -2001, es xq id duplicado.
              if (this.auxresp.returnset[0].RCode=="1"){
                // carga ok
                this.openSnackBar("Alta Correcta.");
                //todo cambiar por lo real de plan de cuentas
                this.router.navigate(['/plan-cuentas', auxid]);
              } else {
                //error al cargar
                this.openSnackBar("Error. Alta no permitida.");
              }
          }
        });
    }else{
      //actualizando
    //todo cambiar por lo real de plan de cuentas
      var d = new Date();
      var d2;
      if( this.planDeCuentas.date_entered != null){
        d2 = (this.planDeCuentas.date_entered);
        d2 = d2.substring(0, 10);
      }
      let jsbody = {
        "id":this.planDeCuentas.id,
        "cuentacontable":this.planDeCuentas.id,
        "name":this.forma.controls['name'].value,
        "nomenclador":auxnomenclador,
        "nomencladorpadre":auxnomencladorpadre,
        "orden":auxorden,
        "imputable":this.forma.controls['imputable'].value,
        "patrimonial":this.forma.controls['patrimonial'].value,
        "estado":this.forma.controls['estado'].value,
        //auditoría
        "date_entered":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "date_modified":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
        "modified_user_id":1,//hardcoded
        "created_by":1,//hardcoded
        "description":null,//hardcoded
        "deleted":0,//hardcoded
        "assigned_user_id":1,//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._PlanCuentasService.putPlanDeCuentas( this.planDeCuentas.id,jsonbody,this.token )
        .subscribe( resp => {
          console.log(resp);
          this.auxresp = resp;
          if(this.auxresp.returnset[0].RCode=="-6003"){
            //token invalido
            //this.planDeCuentas = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._PlanCuentasService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.guardarPlanDeCuentas();
              });
            } else {
              if (this.auxresp.returnset[0].RCode=="1"){
                // modif ok
                this.openSnackBar("Modificación realizada con éxito.");
              } else {
                //error al cargar
                this.openSnackBar("Error. Modificación no permitida.");
              }
          }
        });
    }
  }

  //para la lista de referencias contables asignadas
  buscarRefContable(){
    this._refContablesService.getRefContablesPorCuenta( this.token, this.planDeCuentas.nomenclador)
      .subscribe( dataRC => {
        //console.log(dataRC);
          this.rcData = dataRC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContablesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContable();
              });
            } else {
              if(this.rcData.dataset.length>0){
                this.refContablesAll = this.rcData.dataset;
                console.log(this.refContablesAll);
                this.loading = false;

                this.constRefContables = new MatTableDataSource(this.refContablesAll);

                //this.constRefContables.sort = this.sort;
                //this.constRefContables.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.refContablesAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  //para la lista de referencias contables sin asginar
  buscarRefContableNull(){
    this._refContablesService.getRefContablesSinCuenta( this.token )
      .subscribe( dataRC => {
        //console.log(dataRC);
          this.rcData = dataRC;
          //auxProvData = this.proveedorData.dataset.length;
          if(this.rcData.returnset[0].RCode=="-6003"){
            //token invalido
            this.refContablesAll = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._refContablesService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarRefContableNull();
              });
            } else {
              console.log(this.rcData.dataset);
              if(this.rcData.dataset.length>0){
                this.refContablesAll = this.rcData.dataset;
                console.log(this.refContablesAll);
                this.loading = false;

                this.constRefContablesNull = new MatTableDataSource(this.refContablesAll);

                //this.constRefContables.sort = this.sort;
                //this.constRefContables.paginator = this.paginator;

                //this.table.renderRows();
                //this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';

              } else {
                this.refContablesAll = null;
              }
            }
            //console.log(this.refContablesAll);
      });
  }

  asignarRefContable(indice:number,asignando:boolean){
    //actualizando
    if(asignando){
      console.log('agregando referencia: ');
      console.log(this.constRefContablesNull.data[indice]||', indice: '||indice);
      this.refContableElegida = this.constRefContablesNull.data[indice];
      var auxAsignando:any = this.planDeCuentas.nomenclador;
    } else {

      console.log('eliminando referencia: ');
      this.refContableElegida = this.constRefContables.data[indice];
      var auxAsignando:any = 'null';
    }
    /*var d = new Date();
    var d2;
    if( this.refContable.date_entered != null){
      d2 = (this.refContable.date_entered);
      d2 = d2.substring(0, 10);
    }*/
    let jsbody = {
      "id":this.refContableElegida.id,
      "name":this.refContableElegida.name,
      "date_entered":this.refContableElegida.date_entered,
      "date_modified":this.refContableElegida.date_modified,
      "modified_user_id":this.refContableElegida.modified_user_id,
      "created_by":this.refContableElegida.created_by,
      "description":null,
      "deleted":this.refContableElegida.deleted,
      "assigned_user_id":this.refContableElegida.assigned_user_id,
      "tienectocosto ":this.refContableElegida.tienectocosto,
      "numero":this.refContableElegida.numero,
      "idgrupofinanciero":this.refContableElegida.idgrupofinanciero,
      "tg01_centrocosto_id_c":this.refContableElegida.tg01_centrocosto_id_c,
      "idreferenciacontable":this.refContableElegida.idreferenciacontable,
      "estado":this.refContableElegida.estado,
      "tg01_grupofinanciero_id_c":this.refContableElegida.tg01_grupofinanciero_id_c,
      "tg01_cuentascontables_id_c":auxAsignando,
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._refContablesService.putRefContable( this.refContableElegida.id,jsonbody,this.token )
      .subscribe( resp => {
        console.log(resp);
        this.auxresp = resp;
        if(this.auxresp.returnset[0].RCode=="-6003"){
          //token invalido
          //this.refContable = null;
          let jsbody = {"usuario":"usuario1","pass":"password1"}
          let jsonbody = JSON.stringify(jsbody);
          this._refContablesService.login(jsonbody)
            .subscribe( dataL => {
              console.log(dataL);
              this.loginData = dataL;
              this.token = this.loginData.dataset[0].jwt;
              this.asignarRefContable(indice,asignando);
            });
          } else {
            if (this.auxresp.returnset[0].RCode=="1"){
              // modif ok
              this.buscarRefContable();
              this.buscarRefContableNull();
              this.openSnackBar("Asignación realizada con éxito.");
            } else {
              //error al cargar
              this.openSnackBar("Error. Asignación no permitida.");
            }
        }
      });
  }

  openGroup(nombrePanel: string){
    this.buscarRefContable();
    this.buscarRefContableNull();
  }
  //
}
