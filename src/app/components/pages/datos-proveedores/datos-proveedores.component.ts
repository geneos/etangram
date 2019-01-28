import { Component, OnInit } from '@angular/core';
import { DatosProveedorService } from 'src/app/services/i2t/datos-proveedor.service';
import { MatTable, MatSort, MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-datos-proveedores',
  templateUrl: './datos-proveedores.component.html',
  styleUrls: ['./datos-proveedores.component.css']
})
export class DatosProveedoresComponent implements OnInit {
  
  respCabecera: any;
  respImpuesto: any;
  respFormulario: any;
  datosCabecera: datosCabecera[] = [];
  datosImpuesto : datosImpuesto[] = [];
  datosFormularios: datosFormularios[] = [];
  token: string = 'a';
  loginData: any;
  loading: boolean = true;
  direccionFac: string;
  direccionEnv: string;
  telefonos: string;
  url: string;

  dataSource = new MatTableDataSource<datosImpuesto>(this.datosImpuesto);
  dataSource2 = new MatTableDataSource<datosFormularios>(this.datosFormularios);
  columnsToDisplay = ['descripcion', 'presentacion', 'vencimiento'];
  constructor(private _DatosProveedorService: DatosProveedorService) { }

  ngOnInit() {
    this.getCabecera()
  }

  modificar(){

  }

  getCabecera(){
    let jsbodyCab = {
      "Id_Proveedor": "4081"
    }
    let jsonbodyCab= JSON.stringify(jsbodyCab);
    
    this._DatosProveedorService.datosCabecera( jsonbodyCab, this.token )
      .subscribe( dataP => {
        console.log(dataP);
          this.respCabecera = dataP;
          if(this.respCabecera.returnset[0].RCode== "-6003" ){
            //token invalido
            let jsbody = {"usuario":"usuario1","pass":"password1"}
            let jsonbody = JSON.stringify(jsbody);
            this._DatosProveedorService.login(jsonbody)
              .subscribe( dataL => {
 //               console.log(dataL);
                this.loginData = dataL;
                this.token = this.loginData.dataset[0].jwt;
                this.getCabecera();
              });
            } else {
              if(this.respCabecera.dataset.length>0){
                this.datosCabecera = this.respCabecera.dataset;
                this.loading = false;
                if(this.datosCabecera[0].Domicilio == null){
                  this.direccionFac = null;
                } else{
                  this.direccionFac = this.datosCabecera[0].Domicilio +', '+'('+this.datosCabecera[0].Codigo_Postal+')'+', '+this.datosCabecera[0].Ciudad;
                }
                if(this.datosCabecera[0].Domicilio_envio == "") {
                  this.direccionEnv = null;
                } else {
                this.direccionEnv = this.datosCabecera[0].Domicilio_envio +', '+'('+this.datosCabecera[0].Codigo_Postal_envio+')'+', '+this.datosCabecera[0].Ciudad_envio;
                }
                this.telefonos = this.datosCabecera[0].Telefono_Oficina + ' - ' + this.datosCabecera[0].Telefono_Movil;

                //TRAE IMPUESTOS
                this._DatosProveedorService.getImpuesto( jsonbodyCab, this.token)
                .subscribe(dataI => {
                  console.log(dataI);
                  this.respImpuesto = dataI;
                  if(this.respImpuesto.dataset.length>0){
                    this.datosImpuesto = this.respImpuesto.dataset;
                    this.dataSource = new MatTableDataSource(this.datosImpuesto);
                  }
                })
                //TRAE FORMULARIOS
                this._DatosProveedorService.getFormulario( jsonbodyCab, this.token)
                .subscribe(dataF => {
                  console.log(dataF);
                  this.respFormulario = dataF;
                  if(this.respFormulario.dataset.length>0){
                    this.datosFormularios = this.respFormulario.dataset;
                    this.dataSource2 = new MatTableDataSource(this.datosFormularios);
                  }
                })
              } else {
                this.datosCabecera = null;

              }
            }
      });
    
  }
}
export interface datosCabecera {
  'Razon_Social': string,
  'CUIT': string,
  'Email': string,
  'Estado': string,
  'Estado_Afip': string,
  'Domicilio': number,
  'Ciudad': number,
  'Codigo_Postal': string,
  'Domicilio_envio': string,
  'Ciudad_envio': string,
  'Codigo_Postal_envio': string,
  'Telefono_Oficina': string,
  'Telefono_Movil': string
}

export interface datosImpuesto {
  "id_prov": string,
  "name_mode": string,
  "name_impu": string,
  "situacion": string,
  "nroinscripcion": string,
  "fechainscripcion": string,
  "exenciones": number,
  "exen_fechadesde": string,
  "exen_fechahasta": string
}
export interface datosFormularios{
  "name": string,
  "fechapresentacion": string,
  "fechavencimiento": string,
  "url": string,
  "id_prov": string
}