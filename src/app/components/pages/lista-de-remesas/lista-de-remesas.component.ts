import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatLabel, MatDialog, MatHint, MatPaginatorIntl} from '@angular/material';
import { RemesasService } from 'src/app/services/i2t/remesas.service'
import { Remesas} from 'src/app/interfaces/remesas.interface'
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar} from '@angular/material/snack-bar';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-lista-de-remesas',
  templateUrl: './lista-de-remesas.component.html',
  styleUrls: ['./lista-de-remesas.component.css']
})
export class ListaDeRemesasComponent implements OnInit {

  token: any;
  loading: boolean = false;
  forma: FormGroup;
  checked: boolean = true;
  dateNow : Date = new Date();
  fechaActual: Date = new Date();
  fechaDesde: Date = new Date();
  fechaActualMasUno: Date = new Date();
  fec: any;

  remesas: any;
  listaRemesas: Remesas[] = [];
  remesasFiltro: Remesas[] = [];
  delData: any;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.listaRemesas);
  filterValues: {
    fechaDesde: any,
    fechaHasta: any,
    estado: any
  };

  
  constructor(private _remesasService: RemesasService,
              private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar,
              private FormBuilder: FormBuilder,
              @Inject(SESSION_STORAGE) private storage: StorageService) { 
    
    this.token = localStorage.getItem('TOKEN')  

    this.forma = this.FormBuilder.group({
      fecdesde: new FormControl(),
      fechasta: new FormControl(),
      soloPendientes: new FormControl(),
    })
    this.forma.controls['soloPendientes'].setValue(true);

    this.filterValues = {
      fechaDesde: '',
      fechaHasta: '',
      estado: 'Provisorio'
    }

    console.log('Filtros iniciales: ', this.filterValues);

    //suscripciones a fechas y checkbox
    this.forma.controls['fecdesde'].valueChanges.subscribe(fecdesde => {
      // this.filterValues.fechaPagoDesde = fechaDesde;
      this.filterValues.fechaDesde = this.extraerFecha(<FormControl>this.forma.controls['fecdesde']);
      // this.applyFilter();
      this.filtrar();
    });
    this.forma.controls['fechasta'].valueChanges.subscribe(fechaHasta => {
      // this.filterValues.fechaPagoHasta = fechaHasta;
      this.filterValues.fechaHasta = this.extraerFecha(<FormControl>this.forma.controls['fechasta']);
      // this.applyFilter();
      this.filtrar();
    });
    this.forma.controls['soloPendientes'].valueChanges.subscribe(valor => {
      // this.filterValues.estado = this.forma.controls['soloPendientes'].value == true ? 'Pendiente' : '';
      this.filterValues.estado = valor == true ? 'Pendiente' : '';
      // this.applyFilter();
      this.filtrar();
    });
  }


  ngOnInit() {
    this.obtenerRemesas();
      
    // this.fechaActual.setDate(this.fechaActual.getDate() + 30);
    // this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    // this.fechaDesde.setDate(this.fechaActual.getDate() - 30);
    // this.forma.controls['fechasta'].setValue(this.fechaActual);
    // this.forma.controls['fecdesde'].setValue(this.fechaDesde);

    setTimeout(() => {
      console.log(this.forma.controls['soloPendientes'].value)
    if (this.forma.controls['soloPendientes'].value == true){
      this.dataSource.filter = 'Provisorio'
    } else {
      this.dataSource.filter = ''
    }
    }, 1000);  //2s
   
  }
  
  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }


  extraerFecha(control: FormControl){
    console.log('control a usar para fecha: ', control)
    let auxFecha: string;
    if (control.value != null){
      let ano = control.value.getFullYear().toString();
      let mes = (control.value.getMonth()+1).toString();
      if(mes.length==1){mes="0"+mes};
      let dia = control.value.getDate().toString();
      if(dia.length==1){dia="0"+dia};
       auxFecha = ano+"-"+mes+"-"+dia;
     // auxFecha = dia+'-'+mes+'-'+ano;
      console.log('string de fecha generado: ', auxFecha);
      return auxFecha;
    }
    else{
      return null;
    }
  }

  obtenerRemesas(){
    this._remesasService.getRemesas('',this.token)
      .subscribe(resp => {
        console.log(resp)
        this.remesas = resp
        this.listaRemesas = this.remesas.dataset
        console.log(this.listaRemesas)
        this.listaRemesas.forEach( data =>{
          if(data.deleted = 1){
            this.listaRemesas.pop()
          }
        })
        this.dataSource = new MatTableDataSource(this.listaRemesas)
      //  this.dataSource.filter = 'Provisorio'
      })
  }
  applyFilter() {

    if (!this.forma.controls['soloPendientes'].value ){
      this.dataSource.filter = 'Provisorio'
    } else {
      this.dataSource.filter = ''
    }
   }

  editarRemesa(id: string,estado: string){
    if (estado == 'Provisorio'){
      this.router.navigate(['/lista-remesas', id])
    }
  }
  borrarRemesa(id: string){
    let jsbody = {
      "ID_Remesa": id
    }
    let jsonbody = JSON.stringify(jsbody);
    
    this._remesasService.RemesaDel(jsonbody, this.token)
      .subscribe( resp => {
        console.log(resp)
        this.delData = resp
        if(this.delData.returnset[0].RCode==-1){
          this.openSnackBar(this.delData.returnset[0].RTxt)
        } else {
          this.openSnackBar('Remesa eliminada')
        }
      })
  }

  filtrar() {
    let filtros = Object.keys(this.filterValues);
    let key: string;
    let valores = this.filterValues;
    console.log(this.filterValues)
    for (let index = 0; index < filtros.length; index++) {
      key = filtros[index];
      console.log('filtrando por ' + key);
      if ((valores[key] != null)&&(valores[key] != '')){
        // console.log('filtrando por ' + key + ' con ' + this.filterValues[key]);
        if (key.includes('Desde')||key.includes('Hasta')){
          // console.log('el filtro es desde/hasta');
          if (key.includes('Desde')){
            let atributo = key.slice(0, key.indexOf('Desde'));
            // listaTemp = listaTemp.filter(temp => temp.fechaPago <= valores[key]);
            // listaTemp = listaTemp.filter(temp => temp[atributo] >= valores[key]);
            console.log('trayendo los que tienen ' + atributo + ' >= ' + valores[key]);
            this.listaRemesas = this.listaRemesas.filter(temp => temp[atributo] >= valores[key]);
          }
          else{
            let atributo = key.slice(0, key.indexOf('Hasta'));
            // listaTemp = listaTemp.filter(temp => temp.fechaPago >= valores[key]);
            console.log('trayendo los que tienen ' + atributo + ' <= ' + valores[key]);
            this.listaRemesas = this.listaRemesas.filter(temp => temp[atributo] <= valores[key]);
          }
        }
        else{
          console.log('trayendo los que tienen ' + key + ' = ' + valores[key]);
          this.listaRemesas = this.listaRemesas.filter(temp => temp[key] == valores[key]);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.listaRemesas);
  
  }
}
