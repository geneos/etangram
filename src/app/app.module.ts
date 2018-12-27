import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// rutas
import { APP_ROUTING } from "./app.routes";

//material
import { MyMaterialModule } from "./material";
//modales
import {MatDialogModule} from '@angular/material';

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
import { TablePaginationExampleComponent } from './table-pagination-example/table-pagination-example.component';

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
    KeysPipe,
    TablePaginationExampleComponent,
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
  ],
  entryComponents: [  
    TextoComponent,
    NumeroComponent, 
    FechaComponent,  
    ListaComponent, 
    ConsultaComponent 
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
