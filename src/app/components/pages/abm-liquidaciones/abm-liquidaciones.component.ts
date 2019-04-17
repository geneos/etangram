import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatTable, MatSort, MatPaginator, MatTableDataSource, MatSnackBar, Sort } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
// key that is used to access the data in local storage
const TOKEN = '';

@Component({
  selector: 'app-abm-liquidaciones',
  templateUrl: './abm-liquidaciones.component.html',
  styleUrls: ['./abm-liquidaciones.component.css']
})
export class AbmLiquidacionesComponent implements OnInit {


  //#region tabla
  liqsAll: any[];
  sortedLiqs: any[];
  constLiqs = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  filterValues: {
    fechaPagoDesde: any,
    fechaPagoHasta: any,
    descripcion:any,
    medioPago: any,
    estado: any,
  };
  //#endregion tabla

  loading: boolean;
  token: string;
  forma:FormGroup;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,
              private FormBuilder: FormBuilder,
              public snackBar: MatSnackBar,) 
  { 
    console.log(this.storage.get('TOKEN') || 'Local storage is empty');
    this.token = this.storage.get('TOKEN');

    this.loading = true;

    this.forma = this.FormBuilder.group({
      fechaDesde: new FormControl(),
      fechaHasta: new FormControl(),
      soloPendientes: new FormControl()
    });
    this.forma.controls['soloPendientes'].setValue(true);

    this.filterValues = {
      fechaPagoDesde: '',
      fechaPagoHasta: '',
      descripcion: '',
      medioPago: '',
      estado: 'Pendiente'
    }

    console.log('Filtros iniciales: ', this.filterValues);

    //suscripciones a fechas y checkbox
    this.forma.controls['fechaDesde'].valueChanges.subscribe(fechaDesde => {
      // this.filterValues.fechaPagoDesde = fechaDesde;
      this.filterValues.fechaPagoDesde = this.extraerFecha(<FormControl>this.forma.controls['fechaDesde']);
      // this.applyFilter();
      this.filtrar();
    });
    this.forma.controls['fechaHasta'].valueChanges.subscribe(fechaHasta => {
      // this.filterValues.fechaPagoHasta = fechaHasta;
      this.filterValues.fechaPagoHasta = this.extraerFecha(<FormControl>this.forma.controls['fechaHasta']);
      // this.applyFilter();
      this.filtrar();
    });
    this.forma.controls['soloPendientes'].valueChanges.subscribe(valor => {
      // this.filterValues.estado = this.forma.controls['soloPendientes'].value == true ? 'Pendiente' : '';
      this.filterValues.estado = valor == true ? 'Pendiente' : '';
      // this.applyFilter();
      this.filtrar();
    });

    // this.applyFilter();
    //
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Artículos por página:';
    this.constLiqs.sort = this.sort;
    this.constLiqs.paginator = this.paginator;

    this.liqsAll = [
      {fechaPago: '13/12/2018', descripcion: 'Transferencias varias DIC 18',  medioPago: 'TRANSF', monto: '14.568', estado: 'Pendiente'},
      {fechaPago: '11/12/2018', descripcion: 'Transferencias BAEHOST',        medioPago: 'TRANSF', monto: '27.450', estado: 'Pendiente'},
      {fechaPago: '10/11/2018', descripcion: 'Transferencias varias NOV 18',  medioPago: 'TRANSF', monto: '17.500', estado: 'Pagado'},
      {fechaPago: '06/12/2018', descripcion: 'Pagos a prv CHEQUE',            medioPago: 'CHEQUE 30/60/90', monto: '47.300', estado: 'Pendiente'},
    ];

    /*
    if (this.forma.controls['soloPendientes'].value == true){
      this.constLiqs = new MatTableDataSource(this.liqsAll.filter(liq => liq.estado == 'Pendiente'));
    }
    else{
      this.constLiqs = new MatTableDataSource(this.liqsAll);
    }
    */
    // this.applyFilter();

    //cargar datos/inicializar
    // this.sortedLiqs = this.liqsAll.slice();

      this.filtrar();//todo mover dentro de la carga, después de la respuesta a la suscripcion
  }

  //#region funcionesTabla
  filtrar(){
    // let listaTemp = this.liqsAll.slice();
    this.sortedLiqs = this.liqsAll.slice();


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
            this.sortedLiqs = this.sortedLiqs.filter(temp => temp[atributo] >= valores[key]);
          }
          else{
            let atributo = key.slice(0, key.indexOf('Hasta'));
            // listaTemp = listaTemp.filter(temp => temp.fechaPago >= valores[key]);
            console.log('trayendo los que tienen ' + atributo + ' <= ' + valores[key]);
            this.sortedLiqs = this.sortedLiqs.filter(temp => temp[atributo] <= valores[key]);
          }
        }
        else{
          console.log('trayendo los que tienen ' + key + ' = ' + valores[key]);
          this.sortedLiqs = this.sortedLiqs.filter(temp => temp[key] == valores[key]);
        }
      }
    }
    this.constLiqs = new MatTableDataSource(this.sortedLiqs);
  }
  applyFilter(){
    // this.liqsAll.filter(liq => liq.estado == 'Pendiente')
    // this.constLiqs = new MatTableDataSource(this.liqsAll.filter(liq => liq.estado == 'Pendiente'));
    /* console.log('filtrando con ', this.filterValues);
    console.log('keys p1', Object.keys(this.filterValues));
    console.log(this.filterValues[0]); */
    /* for (var key in this.filterValues){
      console.log('keys p2', Object.keys(this.filterValues));
    } */
    let filtros = Object.keys(this.filterValues);
    let key: string;
    let valores = this.filterValues;
    this.constLiqs = new MatTableDataSource(this.liqsAll.filter(function(item) {
      // for (var key in this.filterValues) {
      // for (var key in Object.keys(this.filterValues)) {
      // for (key in filtros) {
      for (let index = 0; index < filtros.length; index++) {
        key = filtros[index];
        console.log('filtrando por ' + key);
        // console.log('filtrando por ' + key + ' con ' + this.filterValues[key]);
        if (key.includes('Desde')||key.includes('Hasta')){
          // console.log('el filtro es desde/hasta');
          if (key.includes('Desde')){
            let atributo = key.slice(0, key.indexOf('Desde'));
            // console.log('el atributo para comparar es: '+atributo);
            // console.log('valor de atributo: ', item[atributo]);
            // console.log('valor de filtro actual: ', valores[key]);

            // if (item[atributo] === undefined || item[atributo] < this.filterValues[key])
            if (item[atributo] === undefined || item[atributo] < valores[key]){
              console.log('falso => ' + 'atributo = ' + atributo + ', item[atributo] = ' + item[atributo] + ', valores[key] = ' +valores[key]);
              return false;
            }
            else {
              console.log('verdadero => ' + 'atributo = ' + atributo + ', item[atributo] = ' + item[atributo] + ', valores[key] = ' +valores[key]);
              return true;
            }
          }
          else{
            let atributo = key.slice(0, key.indexOf('Hasta'));
            // console.log('el atributo para comparar es: '+atributo);
            // console.log('valor de atributo: ', item[atributo]);
            // console.log('valor de filtro actual: ', valores[key]);
            // if (item[atributo] === undefined || item[atributo] > this.filterValues[key])
            if (item[atributo] === undefined || item[atributo] > valores[key]){
              console.log('falso => ' + 'atributo = ' + atributo + ', item[atributo] = ' + item[atributo] + ', valores[key] = ' +valores[key]);
              return false;
            }
            else {
              console.log('verdadero => ' + 'atributo = ' + atributo + ', item[atributo] = ' + item[atributo] + ', valores[key] = ' +valores[key]);
              return true;
            }
          }
        }
        else {
          
          // console.log('el atributo para comparar es: '+key);
          // console.log('valor de atributo: ', item[key]);
          // console.log('valor de filtro actual: ', valores[key]);
          // if (item[key] === undefined || item[key] != this.filterValues[key]){
          if (item[key] === undefined || item[key] != valores[key]){
            console.log('falso => ' + 'key = ' + key + ', item[key] = ' + item[key] + ', valores[key] = ' +valores[key]);
            return false;
          }
          else {
            console.log('verdadero => ' + 'key = ' + key + ', item[key] = ' + item[key] + ', valores[key] = ' +valores[key]);
            return true;
          }
        }
      }
      // return true;
    }));
    
  }

  sortData(sort: Sort) {
    console.log('llamado al sort: ', sort);
    // const data = this.liqsAll.slice(); //todo cambiar por liquidaciones filtradas
    const data = this.sortedLiqs.slice(); //todo cambiar por liquidaciones filtradas
    if (!sort.active || sort.direction === '') {
      this.sortedLiqs = data;
      return;
    }

    this.sortedLiqs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fechaPago': return compare(a.fechaPago, b.fechaPago, isAsc);
        case 'descripcion': return compare(a.descripcion, b.descripcion, isAsc);
        case 'medioPago': return compare(a.medioPago, b.medioPago, isAsc);
        default: return 0;
      }
    });
    this.constLiqs = new MatTableDataSource(this.sortedLiqs);
  }

  modificar(liquidacion: any){
    console.log('clickeado modificar', liquidacion);
    if (liquidacion.estado =="Pendiente"){
      this.openSnackBar('TODO Modificar');
    }
    else{
      this.openSnackBar('No se puede modificar la liquidación (no es "Pendiente")');
    }
  }
  consultar(liquidacion: any){
    console.log('clickeado consultar', liquidacion);
    this.openSnackBar('TODO consultar');
    
  }
  baja(liquidacion: any){
    console.log('clickeado baja', liquidacion);
    if (liquidacion.estado =="Pendiente"){
      this.openSnackBar('TODO baja');
    }
    else{
      this.openSnackBar('No se puede dar de baja a la liquidación (no es "Pendiente")');
    }
  }
  //#endregion funcionesTabla

  //#region otros
  extraerFecha(control: FormControl){
    console.log('control a usar para fecha: ', control)
    let auxFecha: string;
    if (control.value != null){
      let ano = control.value.getFullYear().toString();
      let mes = (control.value.getMonth()+1).toString();
      if(mes.length==1){mes="0"+mes};
      let dia = control.value.getDate().toString();
      if(dia.length==1){dia="0"+dia};
      // auxFecha = ano+"-"+mes+"-"+dia;
      auxFecha = dia+'/'+mes+'/'+ano;
      console.log('string de fecha generado: ', auxFecha);
      return auxFecha;
    }
    else{
      return null;
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }
  //#endregion otros
}

  function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

