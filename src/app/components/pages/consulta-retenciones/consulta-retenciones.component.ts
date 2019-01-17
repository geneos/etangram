import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable,MatTableDataSource, MatDialog, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import { CompraService } from "../../../services/i2t/compra.service";
import { CompraProveedor } from "../../../interfaces/compra.interface";
import { ConsultaRetencionesService } from 'src/app/services/i2t/consulta-retenciones.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ImpresionCompService } from "../../../services/i2t/impresion-comp.service";
import { ImpresionBase, informes } from "../../../interfaces/impresion.interface";

var auxProvData: any;
@Component({
  selector: 'app-consulta-retenciones',
  templateUrl: './consulta-retenciones.component.html',
  styleUrls: ['./consulta-retenciones.component.css'],
  providers: [
    { provide: 'Window',  useValue: window }
  ]
})
export class ConsultaRetencionesComponent implements OnInit {

  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
  token: string = "a";
  proveedorData: any;
  consultaRetenciones: consultaRetenciones[] = [];
  respCabecera: any;
  cabeceraId: string;
  public fechaActual: Date = new Date();
  public fechaDesde: Date = new Date();
  tabla: any = [];
  ProveedorData: any;
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay  = ['Fecha', 'Comprobante', 'Expediente', 'Impuesto', 'Concepto', 'Importe', 'accion'];
  dataSource = new MatTableDataSource<consultaRetenciones>(this.consultaRetenciones);

  
  selection = new SelectionModel(true, []);
  id: any;
  loading: boolean = true;
  constructor( @Inject('Window') private window: Window,
              private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar, 
              public dialogArt: MatDialog, private _compraService:CompraService,
              private _consultaRetenciones:ConsultaRetencionesService, 
              private _impresionCompService: ImpresionCompService) {
    
  
    this.forma = new FormGroup({
      'proveedor': new FormControl(),
      'razonSocial': new FormControl(),
      'cuit': new FormControl(),
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(new Date()),
      'expediente': new FormControl(),
    })
    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      //this.Controles['proveedor'].setValue(this.id);
      this.buscarProveedor();
    });
   }
   
   
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  //this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
  this.fechaDesde.setDate(this.fechaActual.getDate() - 60).toLocaleString();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  existeProveedor( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxProvData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }


  buscarProveedor(){
    this._compraService.getProveedor( this.id, this.token )
    //this._compraService.getProveedores()
      .subscribe( dataP => {
        console.log(dataP);
          this.proveedorData = dataP;
          auxProvData = this.proveedorData.dataset.length;
          if(this.proveedorData.returnset[0].RCode=="-6003"){
            //token invalido
            this.compraProveedor = null;
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._compraService.login(jsonbody)
              .subscribe( dataL => {
                console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.buscarProveedor();
              });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.loading = false;
              this.compraProveedor = this.proveedorData.dataset[0];
            } else {
              this.compraProveedor = null; 
            }
          }
      });
  }

  getComprobantes(){

    let jsbody = {
      "idcliente": this.id,
      "fechadesde":"",// this.forma.controls['fecdesde'].value,
      "fechahasta":"",// this.forma.controls['fechasta'].value,
      "tiporeferente": "P",
      "tipooperacion": "INT",
      "tipocomprobante": "RET",
    };

    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._consultaRetenciones.getComprobante( jsonbody,this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respCabecera = resp;
        this.cabeceraId = this.respCabecera.returnset[0].RId;
        console.log(this.respCabecera.dataset[0])
        if(this.respCabecera.dataset.length>0){
          this.consultaRetenciones = this.respCabecera.dataset;
          this.dataSource = new MatTableDataSource(this.consultaRetenciones)

        } else {
          this.consultaRetenciones = null;
          this.dataSource = null
          this.openSnackBar('No hay datos para mostrar');
        }
      });
  }

  print() {
    
    this._impresionCompService.getBaseDatos( this.token )
    .subscribe ( dataP => {
      console.log(dataP)
      this.ProveedorData = dataP;
      this.baseUrl = this.ProveedorData.dataset
      this.urlBaseDatos = this.baseUrl[0].jasperserver + this.baseUrl[0].app
      if(this.ProveedorData.dataset.length>0){
        this._impresionCompService.getInfromes('ETG_retencion_crd', this.token)
        .subscribe ( dataP => {
          console.log(dataP)
          this.ProveedorData = dataP;
          this.informes = this.ProveedorData.dataset
          this.urlInforme = this.urlBaseDatos + this.informes[0].url
          console.log(this.urlInforme)
          if(this.ProveedorData.dataset.length>0){

            this._impresionCompService.getReporte( this.urlInforme, this.id,  this.token)
            .subscribe (dataP => {
              console.log(dataP);
            })
          }
        })
      }
    })
  }
} 
export interface consultaRetenciones {
  
  Numero_Referente: string,
  Numero_Comprobante: string,
  Referente: string,
  Fecha: string,
  Importe_Neto: number,
  Importe_Total: number,
  Tipo_Referente: string,
  Tipo_Operacion: string,
  Tipo_Comprobante: string,
  Id_Comprobante: string,
  Nombre_Comprobante: string,
  Letra: string,
  Observaciones_Comprobante: string,
  Impuesto: string,
  Modelo_Impuesto: string,
  Expediente: string,
  Reserva_Presupuestaria: string,
  Certificado: string,
  Estado: string,
  Saldo: number 
}