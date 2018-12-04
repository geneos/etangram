import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable,MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompraArticulo, CompraProveedor } from 'src/app/interfaces/compra.interface';
import { CompraService } from 'src/app/services/i2t/compra.service';

var auxProvData,auxArtiData:any;

@Component({
  selector: 'app-alta-min-contable',
  templateUrl: './alta-min-contable.component.html',
  styleUrls: ['./alta-min-contable.component.css']
})

export class AltaMinContableComponent implements OnInit {

  editingRenglones:boolean = false;
  agregarReng:boolean = true;

  editingCabecera:boolean = true;
  addingReferencia:boolean = false;
  addingItem:boolean = false;
  editingAI:boolean = false;
  auxEditingArt:number = null;

  referenciasData: any[] = [];
  //referenciasDataSource = new MatTableDataSource(this.referenciasData);

  loginData: any;
  token: string = "a";
  cabeceraId: string;
  renglonId: string;
  articuloData: any;
  proveedorData: any;
  respCabecera: any;
  respRenglon: any;
  //todo cambiar
  compraArticulo: CompraArticulo;
  compraProveedor: CompraProveedor;

  forma:FormGroup;
  formaReferencias:FormGroup;
/* 
  totalneto:number = 0;
  impuestosalicuotas:number = 0;
  totaltotal:number = 0;

  posicionesFiscales: string[] = ["N/D","IVA Responsable Inscripto","IVA Responsable no Inscripto",
"IVA no Responsable","IVA Sujeto Exento","Consumidor Final","Responsable Monotributo",
"Sujeto no Categorizado","Proveedor del Exterior","Cliente del Exterior","IVA Liberado - Ley N° 19.640",
"IVA Responsable Inscripto - Agente de Percepción","Pequeño Contribuyente Eventual",
"Monotributista Social","Pequeño Contribuyente Eventual Social"]; */

  @ViewChild('tableArticulos') table: MatTable<any>;

  //todo cambiar
  constructor(public dialogArt: MatDialog, private _compraService:CompraService) {
    this.forma = new FormGroup({
      'fecha': new FormControl('',Validators.required),
      'tipo': new FormControl(),
      'numero': new FormControl(),
      'organizacion': new FormControl(),
      'moneda': new FormControl(),
      'caja': new FormControl('',Validators.required),
      'observaciones': new FormControl()
    })

    this.forma.controls['tipo'].disable();
    this.forma.controls['numero'].disable();
    this.forma.controls['organizacion'].disable();
    this.forma.controls['moneda'].disable();

    this.formaReferencias = new FormGroup({
      'refContable': new FormControl('',Validators.required,this.existeArticulo),
      'centroDeCosto': new FormControl(Validators.required),
      'debe': new FormControl(),
      'haber': new FormControl()
    })

    this.formaReferencias.controls['refContable'].disable();
    this.formaReferencias.controls['centroDeCosto'].disable();
    this.formaReferencias.controls['debe'].disable();
    this.formaReferencias.controls['haber'].disable();
  }

  ngOnInit() {}

  test(){
    //console.log(this.forma.controls['caicae'].errors)
  }

  //todo adaptar
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

  //todo adaptar a referencia
  existeArticulo( control: FormControl ): Promise<any>{
    let promesa = new Promise(
      ( resolve, reject )=>{
        setTimeout( ()=>{
          if( auxArtiData==0 ){
            resolve( {noExiste:true} )
          }else{resolve( null )}
        },2000 )
      }
    )
    return promesa;
  }

  buscarRefContable(){
    this._compraService.getProveedor( this.forma.controls['proveedor'].value, this.token )
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
                this.buscarRefContable();
              });
            } else {
              if(this.proveedorData.dataset.length>0){
                this.compraProveedor = this.proveedorData.dataset[0];
              } else {
                this.compraProveedor = null;
              }
            }
      });
  }

  buscarArticulo(){
    if(this.addingReferencia){
      this._compraService.getArticulo( this.formaReferencias.controls['codigo'].value, this.token )
        .subscribe( dataA => {
          this.articuloData = dataA;
          auxArtiData = this.articuloData.dataset.length;
          if(this.articuloData.dataset.length>0){
            this.compraArticulo = this.articuloData.dataset[0];
          } else {
            this.compraArticulo = null;
          }
        });
    }
    if(this.addingItem){
      this._compraService.getItem( this.formaReferencias.controls['codigo'].value, this.token )
        .subscribe( dataA => {
          this.articuloData = dataA;
          auxArtiData = this.articuloData.dataset.length;
          if(this.articuloData.dataset.length>0){
            this.compraArticulo = this.articuloData.dataset[0];
          } else {
            this.compraArticulo = null;
          }
        });
    }
  }

  addReferencia(){
    this.addingReferencia = true;
  }

  guardarCabecera(){
    this.editingCabecera = false;

    let ano = this.forma.controls['fecha'].value.getFullYear().toString();
    let mes = (this.forma.controls['fecha'].value.getMonth()+1).toString();
    if(mes.length==1){mes="0"+mes};
    let dia = this.forma.controls['fecha'].value.getDate().toString();
    if(dia.length==1){dia="0"+dia};

    let auxfecha = ano+"-"+mes+"-"+dia;

    let jsbody = {
      "Tipocbte":this.forma.controls['tipoComprobante'].value,
      "Modelocbte":"cpa",//hardcoded
      "NroCbte":this.forma.controls['nroComprobante'].value,
      "ImporteTotalcbte":this.forma.controls['totalCabecera'].value,
      "Fechacbte":auxfecha,
      "codigoReferente":this.forma.controls['proveedor'].value,
      "CAE":this.forma.controls['caicae'].value,
      "FormaPago":"F",//hardcoded
      "idcondComercializacion":"1",//hardcoded
      "IdSucursal":"1",//hardcoded
      "IdDeposito":"1",//hardcoded
      "IdLista":"1",//hardcoded
      "IdMoneda":"1",//hardcoded
      "Cotizacion":"1",//hardcoded
      "FechaBase":auxfecha,
      "FechaContable":auxfecha,
      "idcaja":"1",//hardcoded
      "idUsuario":"99",//hardcoded
      "Observaciones":this.forma.controls['observaciones'].value
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._compraService.postCabecera( jsonbody,this.token )
      .subscribe( resp => {
        //console.log(resp.returnset[0].RId);
        this.respCabecera = resp;
        this.cabeceraId = this.respCabecera.returnset[0].RId;
      });

    this.forma.controls['fecha'].disable();
    this.forma.controls['tipo'].disable();
    this.forma.controls['numero'].disable();
    this.forma.controls['organizacion'].disable();
    this.forma.controls['moneda'].disable();
    this.forma.controls['caja'].disable();
  }

  guardarArticulo(){
    this.compraArticulo.cantidad = this.formaReferencias.controls['cantidad'].value;
    this.compraArticulo.descuento = this.formaReferencias.controls['descuento'].value;

    if(this.editingAI){
      //editando
      let jsbody = {
        "idrenglon":this.referenciasData[this.auxEditingArt].renglonId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota*/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._compraService.editArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          //this.renglonId = this.respRenglon.returnset[0].RId;
        });

      this.referenciasData[this.auxEditingArt] = this.compraArticulo;
      this.table.renderRows();

      this.editingAI=false;
    }else{
      //agregando nuevo
      if(this.addingItem){
        this.compraArticulo.tipoRenglon="I";
        this.compraArticulo.precio_unitario=0;
        this.compraArticulo.alicuota=0;
      };
      if(this.addingReferencia){this.compraArticulo.tipoRenglon="A"};

      let jsbody = {
        "idCabecera":this.cabeceraId,
        "codigoArticulo":this.compraArticulo.codigo,
        "descArticulo":this.compraArticulo.descripcion,
        "cantidad":this.compraArticulo.cantidad,
        "precioUnitario":this.compraArticulo.precio_unitario,
        "alicuotaIVA":21/*this.compraArticulo.alicuota*/,
        "Descuentolinea":this.compraArticulo.descuento,
        "idUM":1,//this.compraArticulo.unidad_medida,
        "TipoRenglon":this.compraArticulo.tipoRenglon,
        "idusuario":"1",//hardcoded
      };
      let jsonbody= JSON.stringify(jsbody);
      console.log(jsonbody);
      this._compraService.postArticulo( jsonbody, this.token )
        .subscribe( resp => {
          console.log(resp);
          this.respRenglon = resp;
          this.renglonId = this.respRenglon.returnset[0].RId;
          //console.log("dentro: "+this.renglonId);
          //console.log(this.referenciasData[(this.referenciasData.length-1)]);
          this.referenciasData[(this.referenciasData.length-1)].renglonId = this.renglonId;
          //console.log(this.referenciasData[(this.referenciasData.length-1)]);
        });

      this.compraArticulo.renglonId="temp";
      this.referenciasData.push(this.compraArticulo);
      this.table.renderRows();

      this.addingReferencia=false;
      this.addingItem=false;
    }

    let auxtotal=(this.compraArticulo.precio_unitario*this.compraArticulo.cantidad)*((100-this.compraArticulo.descuento)/100);
    //todo revisar
    /* this.totalneto=this.totalneto+auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas+(auxtotal*(this.compraArticulo.alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas; */

    this.formaReferencias.controls['codigo'].setValue("");
    this.formaReferencias.controls['cantidad'].setValue(1);
    this.formaReferencias.controls['descuento'].setValue(0);
    this.compraArticulo = null;
  }

  cancelarArtItem(){
    this.addingItem = false;
    this.addingReferencia = false;
    this.editingAI = false;
    this.compraArticulo = null;
    this.formaReferencias.controls['codigo'].setValue("");
    this.formaReferencias.controls['cantidad'].setValue(1);
    this.formaReferencias.controls['descuento'].setValue(0);
  }

  eliminarArticulo(ind:number){
    let jsbody = {
      "idrenglon":this.referenciasData[ind].renglonId,
      "idusuario":"1",//hardcoded
    };
    let jsonbody= JSON.stringify(jsbody);
    console.log(jsonbody);
    this._compraService.deleteArticulo( jsonbody, this.token )
      .subscribe( resp => {
        console.log(resp);
        this.respRenglon = resp;
        //this.renglonId = this.respRenglon.returnset[0].RId;
      });

    let auxtotal=(this.referenciasData[ind].precio_unitario*this.referenciasData[ind].cantidad)*((100-this.referenciasData[ind].descuento)/100);
    //todo revisar
    /* this.totalneto=this.totalneto-auxtotal;
    this.impuestosalicuotas=this.impuestosalicuotas-(auxtotal*(this.referenciasData[ind].alicuota/100));
    this.totaltotal=this.totalneto+this.impuestosalicuotas; */

    this.referenciasData.splice(ind, 1);
    this.table.renderRows();
  };

  editarArticulo(ind:number){
    this.editingAI = true;
    this.compraArticulo = this.referenciasData[ind];
    this.formaReferencias.controls['codigo'].setValue(this.referenciasData[ind].codigo);
    this.formaReferencias.controls['cantidad'].setValue(this.referenciasData[ind].cantidad);
    this.formaReferencias.controls['descuento'].setValue(this.referenciasData[ind].descuento);
    //console.log(this.compraArticulo);
    this.auxEditingArt=ind;
  };

}
