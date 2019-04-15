import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  delData: any;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.listaRemesas);

  get fecdesde(): any { return this.forma.get('fecdesde'); }
  get fechasta(): any { return this.forma.get('fechasta'); }
  
  constructor(private _remesasService: RemesasService,
              private route:ActivatedRoute,private router: Router,
              public snackBar: MatSnackBar,
              @Inject(SESSION_STORAGE) private storage: StorageService) { 
    
    this.token = localStorage.getItem('TOKEN')  
    this.forma = new FormGroup({
      'fecdesde': new FormControl(),
      'fechasta': new FormControl(),
      'soloPendientes': new FormControl(true),
    })
    
  }


  ngOnInit() {
    this.obtenerRemesas();
    this.fechaActual.setDate(this.fechaActual.getDate() + 30);
    this.fechaActualMasUno.setDate(this.fechaActual.getDate() + 1);
    this.fechaDesde.setDate(this.fechaActual.getDate() - 30);
    this.forma.controls['fechasta'].setValue(this.fechaActual);
    this.forma.controls['fecdesde'].setValue(this.fechaDesde);

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
   //     this.dataSource.filter = 'Provisorio'
      })
  }
  applyFilter() {

    console.log(this.forma.controls['soloPendientes'].value)
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
}
