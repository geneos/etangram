import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CompGen } from 'src/app/interfaces/comp-gen.interface';
import { ConsultaDinamicaService } from 'src/app/services/i2t/consulta-din.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements CompGen, OnInit, AfterViewInit, OnChanges {
  @Input() data: any;
  // @Output() datosSalida:string;
  // @Output() datosSalida=  new EventEmitter<string>();

  @ViewChild('datosUsuario') datosUsuario: ElementRef;
  datosInternos: string = '';
  datosInternosMap: Map<string, string> ;

  suscripcionConsDin: Subscription;

  constructor(private  consultaDinService: ConsultaDinamicaService,
              public ngxSmartModalService: NgxSmartModalService,
              public snackBar: MatSnackBar,) {
    console.log('constructor de consulta recibió: ', this.data);
    this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap=  new Map<string, string>();
    // this.datosInternosMap.set('','');
    // console.log('datos recibidos por componente de texto: ');
    // console.log(this.data);
  }
  
  ngOnInit(){
    console.log('constructor de consulta ngoninit: ', this.data);
    // this.datosInternos = 'test seteo literal';
    this.datosInternos = this.data.datos.valor;
    // this.datosInternos = this.data.valor;
  } 

  ngAfterViewInit() {
    // this.datosUsuario.nativeElement.value = 'test datos iniciales';
    console.log('constructor de consulta afterviewinit: ', this.data);
    // this.datosInternos = 'test seteo literal';
  }

  cambio(){
    
    console.log('ejecutando cambio(keyup) consulta', this.data);
    this.datosInternosMap.set(this.data.datos.columna,this.datosInternos);
    // this.consultaDinService.actualizarDatos(this.datosInternos);
    this.consultaDinService.actualizarDatos(this.datosInternosMap);
    console.log('mapeado: ', this.datosInternosMap);
    console.log('guardado: ', this.datosInternos);
  }

  ngOnChanges(){
    // this.datosSalida.emit(this.datosUsuario.nativeElement.value);
    this.consultaDinService.actualizarDatos(this.data);
    console.log('ejecutado cambios');
  }
  /* 
  ngOnInit() {
  } */

  openSnackBar(message: string) {
    this.snackBar.open(message,"Cerrar", {
      duration: 3000,
    });
  }

  
  abrirConsulta(consulta: string){
    if (consulta == '')
    {
      consulta = this.data.datos.valores;
      console.log('se usará ', this.data.datos.valores)
      console.log('revisar para elegir: ', this.data)
    }
    // console.clear();
    let datosModal : {
      consulta: string;
      permiteMultiples: boolean;
      selection: any;
      // valores: any;
      // columnSelection: any
    }
    datosModal = {
      consulta: consulta,
      permiteMultiples: false,
      selection: null
    }
    
    console.log('enviando datosModal: ');
    console.log(datosModal);
    
    // datosModal.columnSelection = this.columnSelection;
    console.log('Lista de modales declarados: ', this.ngxSmartModalService.modalStack);
    this.ngxSmartModalService.resetModalData('consDinModalN2');
    this.ngxSmartModalService.setModalData(datosModal, 'consDinModalN2');
    console.log('seteados datos como: ', this.ngxSmartModalService.getModalData('consDinModalN2'))
    
    this.suscripcionConsDin = this.ngxSmartModalService.getModal('consDinModalN2').onClose.subscribe((modal: NgxSmartModalComponent) => {
      console.log('Cerrado el modal de consulta dinamica n2: ', modal.getData());

      let respuesta = this.ngxSmartModalService.getModalData('consDinModalN2');
      console.log('Respuesta del modal n2: ', respuesta);

      if (respuesta.estado === 'cancelado'){
        this.openSnackBar('Se canceló la selección');
      }
      else{
        // this.forma.controls['proveedor'].setValue(respuesta.selection[0].codigo);
        // this.datosInternos = 
        console.log('respuesta: ',  respuesta);
        // this.openSnackBar('Se seleccionó el id: ' + respuesta.selection[0].id)
        this.datosInternos = respuesta.selection[0].id;
        this.cambio();
        // this.buscarProveedor();
      }
      // this.establecerColumnas();
      // this.ngxSmartModalService.getModal('consDinModal').onClose.unsubscribe();
      this.suscripcionConsDin.unsubscribe();
      console.log('se desuscribió al modal de consulta dinamica n2');
    });
    console.log('llamado al segundo nivel de modal de consulta dinamica')
    this.ngxSmartModalService.open('consDinModalN2');
  }

}