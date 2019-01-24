import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTable,MatTableDataSource, MatDialog, MatPaginator, MatSort, MatSnackBar, MatPaginatorIntl} from '@angular/material';
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
  paginatorIntl = new MatPaginatorIntl();
  forma: FormGroup;
  compraProveedor: CompraProveedor;
  loginData: any;
  token: string;
  proveedorData: any;
  consultaRetenciones: consultaRetenciones[] = [];
  respCabecera: any;
  cabeceraId: string;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  tabla: any = [];
  ProveedorData: any;
  baseDatos: any;
  informes: informes[] = [];
  urlBaseDatos: string;
  urlInforme: any;
  baseUrl: ImpresionBase[] = [];
  modeloImpuesto: string;
  fechaActualMasUno: Date = new Date();
  cuit: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay  = ['Fecha', 'Comprobante', 'Expediente', 'Impuesto', 'Concepto', 'Importe', 'accion'];
  dataSource = new MatTableDataSource<consultaRetenciones>(this.consultaRetenciones);

  
  selection = new SelectionModel(true, []);
  id: any;
  loading: boolean = true;
  filtrada:boolean = false;

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
      'expediente': new FormControl(''),
    })
    this.route.params.subscribe( parametros=>{
      this.id = parametros['id'];
      //this.Controles['proveedor'].setValue(this.id);
      this.buscarProveedor();
    });
   }
   
   
  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    console.log(this.paginator._intl.getRangeLabel);
 
    this.fechaActual.setDate(this.fechaActual.getDate());
    this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    this.fechaDesde.setDate(this.fechaActual.getDate() - 60);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);
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
            // this.compraProveedor = null;
            // let jsbody = {"usuario":"usuario1","pass":"password1"}
            // let jsonbody = JSON.stringify(jsbody);
            // this._compraService.login(jsonbody)
            //   .subscribe( dataL => {
            //     console.log(dataL);
            //     this.loginData = dataL;
            //     this.token = this.loginData.dataset[0].jwt;
            //     this.buscarProveedor();
            //   });
            } else {
            if(this.proveedorData.dataset.length>0){
              this.loading = false;
              this.compraProveedor = this.proveedorData.dataset[0];

              let icuit = this.compraProveedor.cuit.slice(0,2)
              let mcuit = this.compraProveedor.cuit.slice(2,10)
              let fcuit = this.compraProveedor.cuit.slice(10)

              this.cuit = icuit + '-' + mcuit + '-' + fcuit;
            } else {
              this.compraProveedor = null; 
            }
          }
      });
  }

  getComprobantes(){
    let ano = this.forma.controls['fecdesde'].value.getFullYear().toString();
    let mes = (this.forma.controls['fecdesde'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    let dia = this.forma.controls['fecdesde'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfechadesde = ano+"-"+mes+"-"+dia;

    ano = this.forma.controls['fechasta'].value.getFullYear().toString();
    mes = (this.forma.controls['fechasta'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    dia = this.forma.controls['fechasta'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfechahasta = ano+"-"+mes+"-"+dia;

    let jsbody = {

      "IdCliente": this.id,
      "FechaDesde": auxfechadesde,
      "FechaHasta": auxfechahasta,
      "TipoReferente": "P",
      "TipoOperacion": "INT",
      "TipoComprobante": "RET",
      "Expendiente":this.forma.controls['expediente'].value,
      "ReservaPresup":" ",
      "Certificado":" ",
      "param_limite": 10,
      "param_offset": 0
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
          this.filtrada = true;
        } else {
          this.consultaRetenciones = null;
          this.dataSource = null
          this.openSnackBar('No hay datos para mostrar');
        }
      });
  }

  print(nint: number) {
    
    this._impresionCompService.getBaseDatos( this.token )
    .subscribe ( dataP => {
      console.log(dataP)
      this.ProveedorData = dataP;
      this.baseUrl = this.ProveedorData.dataset
      this.urlBaseDatos = this.baseUrl[0].jasperserver + this.baseUrl[0].app
      if(this.ProveedorData.dataset.length>0){
        if(this.consultaRetenciones[0].ID_Modelo_Impuesto = 1){
          this.modeloImpuesto = 'ETG_retencion_ibrutos'
        } else if(this.consultaRetenciones[0].ID_Modelo_Impuesto = 2) {
          this.modeloImpuesto = 'ETG_retencion_ganancias';
        } else if (this.consultaRetenciones[0].ID_Modelo_Impuesto = 3){
          this.modeloImpuesto = 'ETG_retencion_sellos'
        }
        this._impresionCompService.getInfromes(this.modeloImpuesto, this.token)
        .subscribe ( dataP => {
          console.log(dataP)
          this.ProveedorData = dataP;
          this.informes = this.ProveedorData.dataset
          this.urlInforme = this.urlBaseDatos + this.informes[0].url
          console.log(this.urlInforme)
          if(this.ProveedorData.dataset.length>0){

            window.open(this.urlInforme + nint)
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
  ID_Modelo_Impuesto: number,
  Modelo_Impuesto: string,
  Expediente: string,
  Reserva_Presupuestaria: string,
  Certificado: string,
  Estado: string,
  Saldo: number 
}