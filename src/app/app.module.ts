import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LOCALE_ID} from '@angular/core';

// rutas
import { APP_ROUTING } from "./app.routes";

//antes de importar esto de abajo:
//npm install --save angular-webstorage-service
import { StorageServiceModule } from 'angular-webstorage-service';

//material
import { MyMaterialModule } from "./material";
//modales
import {MatDialogModule} from '@angular/material';
import { NgxSmartModalModule } from 'ngx-smart-modal';

//animations material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//manejo de fechas
import { MAT_DATE_LOCALE } from '@angular/material/core';

//tabla dinamica
import { CdkTableModule } from '@angular/cdk/table';

//
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AbmComprasComponent } from './components/pages/abm-compras/abm-compras.component';
import { AbmArticulosComponent } from './components/pages/abm-articulos/abm-articulos.component';
import { AltaArticuloComponent } from './components/pages/abm-articulos/alta-articulo/alta-articulo.component';
import { AbmProveedoresComponent } from './components/pages/abm-proveedores/abm-proveedores.component';
import { AltaProveedorComponent } from './components/pages/abm-proveedores/alta-proveedor/alta-proveedor.component';
import { AbmRefContablesComponent } from './components/pages/abm-ref-contables/abm-ref-contables.component';
import { AltaRefContableComponent } from './components/pages/abm-ref-contables/alta-ref-contable/alta-ref-contable.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { AbmPlanDeCuentasComponent } from './components/pages/abm-plan-de-cuentas/abm-plan-de-cuentas.component';
import { AltaPlanDeCuentasComponent } from './components/pages/abm-plan-de-cuentas/alta-plan-de-cuentas/alta-plan-de-cuentas.component';
import { TreeComponent } from './components/pages/prueba/tree/tree.component';
import { AbmMinContablesComponent } from './components/pages/abm-min-contables/abm-min-contables.component';
import { AltaMinContableComponent } from './components/pages/abm-min-contables/alta-min-contable/alta-min-contable.component';
import { TablapcComponent } from './components/shared/tablapc/tablapc.component';
import { ConsultaDinamicaComponent } from './components/pages/consulta-dinamica/consulta-dinamica.component';
import { BotonEditarComponent } from './components/shared/boton-editar/boton-editar.component';
import { ConsultaCrdComponent } from './components/pages/consulta-crd/consulta-crd.component';
import { AnclaParaFiltrosDirective } from './directives/ancla-para-filtros.directive';
import { AnclaParaAvanzadosDirective } from './directives/ancla-para-avanzados.directive';
import { AnclaParaColumnasDirective } from './directives/ancla-para-columnas.directive';
import { TextoComponent } from './components/shared/generics/texto/texto.component';
import { ListaComponent } from './components/shared/generics/lista/lista.component';
import { FechaComponent } from './components/shared/generics/fecha/fecha.component';
import { ConsultaComponent } from './components/shared/generics/consulta/consulta.component';
import { NumeroComponent } from './components/shared/generics/numero/numero.component';
import { KeysPipe } from './pipes/keys.pipe';
import { ConsultaComprobantesComponent } from './components/pages/consulta-comprobantes/consulta-comprobantes.component';
import { CdAvanzadoComponent } from './components/shared/modals/cd-avanzado/cd-avanzado.component';
import { ConsultaRetencionesComponent } from './components/pages/consulta-retenciones/consulta-retenciones.component';
import { TablaComponent } from './components/shared/generics/tabla/tabla.component';
import { CdFiltrosComponent } from './components/shared/modals/cd-filtros/cd-filtros.component';
import { CdTablaComponent } from './components/shared/modals/cd-tabla/cd-tabla.component';
import { ConsultaOrdPagosComponent } from './components/pages/consulta-ord-pagos/consulta-ord-pagos.component';
//import { ErrorHandlerService } from './services/error-handler.service';
import { ConsDinComponent } from './components/shared/modals/cons-din/cons-din.component';
import { ConsDinN2Component } from './components/shared/modals/cons-din-n2/cons-din-n2.component';
import { CdFiltrosN2Component } from './components/shared/modals/cd-filtros-n2/cd-filtros-n2.component';
import { CdTablaN2Component } from './components/shared/modals/cd-tabla-n2/cd-tabla-n2.component';
import { from } from 'rxjs';
import { DatosProveedoresComponent } from './components/pages/datos-proveedores/datos-proveedores.component';
import { LoginComponent } from './components/pages/login/login.component';
import { OrdenesPublicidadComponent } from './components/pages/ordenes-publicidad/ordenes-publicidad.component';
import { ImageComponent } from './components/pages/prueba/image/image.component';
import { EvidenciasComponent } from './components/shared/modals/evidencias/evidencias.component';
import { RegistroEvidenciaComponent } from './components/pages/registro-evidencia/registro-evidencia.component';
import { FormulariosComponent } from './components/shared/modals/formularios/formularios.component';
import { CargaFormularioComponent } from './components/pages/carga-formulario/carga-formulario.component';
import { ConfirmarComponent } from './components/shared/modals/confirmar/confirmar.component';
import { ConsDinService } from './classes/cons-din-service';
import { ImgComponent } from './components/shared/modals/img/img.component';
import { RefContablesService } from './services/i2t/ref-contables.service';


@NgModule({
  declarations: [
    AppComponent,
    AbmComprasComponent,
    NavbarComponent,
    AbmArticulosComponent,
    AltaArticuloComponent,
    AbmProveedoresComponent,
    AltaProveedorComponent,
    AbmRefContablesComponent,
    AltaRefContableComponent,
    LoadingComponent,
    AbmPlanDeCuentasComponent,
    AltaPlanDeCuentasComponent,
    TreeComponent,
    AbmMinContablesComponent,
    AltaMinContableComponent,
    ConsultaDinamicaComponent,
    BotonEditarComponent,
    TablapcComponent,
    ConsultaCrdComponent,
    AnclaParaFiltrosDirective,
    AnclaParaAvanzadosDirective,
    AnclaParaColumnasDirective,
    TextoComponent,
    ListaComponent,
    FechaComponent,
    ConsultaComponent,
    NumeroComponent,
    ConsultaCrdComponent,
    TablaComponent,
    KeysPipe,
    ConsultaComprobantesComponent,
    ConsDinComponent,
    CdAvanzadoComponent,
    CdFiltrosComponent,
    CdTablaComponent,
    CdAvanzadoComponent,
    ConsultaRetencionesComponent,
    ConsultaOrdPagosComponent,
    ConsDinN2Component,
    CdFiltrosN2Component,
    CdTablaN2Component,
    DatosProveedoresComponent,
    LoginComponent,
    OrdenesPublicidadComponent,
    ImageComponent,
    EvidenciasComponent,
    RegistroEvidenciaComponent,
    FormulariosComponent,
    CargaFormularioComponent,
    ConfirmarComponent,
    ImgComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    MatDialogModule,
    APP_ROUTING,
    CdkTableModule,
    NgxSmartModalModule.forRoot(),
    StorageServiceModule,
    
  ],
  entryComponents: [
    TextoComponent,
    NumeroComponent,
    FechaComponent,
    ListaComponent,
    ConsultaComponent,
    TablaComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
    {provide: ConsDinService, useFactory: ConsDinServiceFactory, deps: [HttpClient]}
   // { provide: LOCALE_ID, useValue: 'es-AR' }
    // {provide: ErrorHandler, useClass: ErrorHandlerService}
  ],
  bootstrap: [AppComponent],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})

export class AppModule { }

//#region factories
export function ConsDinServiceFactory(http: HttpClient){
  
  console.log('inyectando servicio');

  return new RefContablesService(http);
}
//#endregion factories