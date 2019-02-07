import { RouterModule, Routes } from '@angular/router';

import { AbmComprasComponent } from './components/pages/abm-compras/abm-compras.component';
import { AbmArticulosComponent } from './components/pages/abm-articulos/abm-articulos.component';
import { AltaArticuloComponent } from './components/pages/abm-articulos/alta-articulo/alta-articulo.component';
import { AbmProveedoresComponent } from './components/pages/abm-proveedores/abm-proveedores.component';
import { AltaProveedorComponent } from './components/pages/abm-proveedores/alta-proveedor/alta-proveedor.component';
import { AbmRefContablesComponent } from './components/pages/abm-ref-contables/abm-ref-contables.component';
import { AltaRefContableComponent } from './components/pages/abm-ref-contables/alta-ref-contable/alta-ref-contable.component';
import { AbmPlanDeCuentasComponent } from './components/pages/abm-plan-de-cuentas/abm-plan-de-cuentas.component';
import { AltaPlanDeCuentasComponent } from './components/pages/abm-plan-de-cuentas/alta-plan-de-cuentas/alta-plan-de-cuentas.component';
import { TreeComponent } from './components/pages/prueba/tree/tree.component';
import { AbmMinContablesComponent } from './components/pages/abm-min-contables/abm-min-contables.component';
import { AltaMinContableComponent } from './components/pages/abm-min-contables/alta-min-contable/alta-min-contable.component';
import { ConsultaDinamicaComponent } from './components/pages/consulta-dinamica/consulta-dinamica.component';
import { ConsultaCrdComponent } from './components/pages/consulta-crd/consulta-crd.component';
import { ConsultaComprobantesComponent } from './components/pages/consulta-comprobantes/consulta-comprobantes.component';
import { ConsultaRetencionesComponent } from './components/pages/consulta-retenciones/consulta-retenciones.component';
import { ConsultaOrdPagosComponent } from './components/pages/consulta-ord-pagos/consulta-ord-pagos.component';
import { DatosProveedoresComponent } from './components/pages/datos-proveedores/datos-proveedores.component';
import { LoginComponent } from './components/pages/login/login.component';
import { OrdenesPublicidadComponent } from './components/pages/ordenes-publicidad/ordenes-publicidad.component';

const APP_ROUTES: Routes = [
  { path: 'compra', component: AbmComprasComponent },
  { path: 'compra/:id', component: AbmComprasComponent },
  { path: 'compra/:id/:expediente', component: AbmComprasComponent },
  { path: 'articulos', component: AbmArticulosComponent },
  { path: 'articulos/:id', component: AltaArticuloComponent },
  { path: 'proveedores', component: AbmProveedoresComponent },
  { path: 'proveedores/:id', component: AltaProveedorComponent },
  { path: 'ref-contables', component: AbmRefContablesComponent },
  { path: 'ref-contables/:id', component: AltaRefContableComponent },
  { path: 'plan-cuentas', component: AbmPlanDeCuentasComponent },
  { path: 'plan-cuentas/:id', component: AltaPlanDeCuentasComponent },
  { path: 'plan-cuentas/:id/:padre', component: AltaPlanDeCuentasComponent },
  { path: 'prueba', component: TreeComponent },
  { path: 'min-contables', component: AbmMinContablesComponent },
  { path: 'min-contables/:id', component: AltaMinContableComponent },
  { path: 'consulta', component: ConsultaDinamicaComponent },
  { path: 'consulta/:id', component: ConsultaDinamicaComponent },
  { path: 'consulta-crd/:id', component: ConsultaCrdComponent },
  { path: 'consulta-comprobantes/:id', component: ConsultaComprobantesComponent },
  { path: 'consulta-retenciones/:id', component: ConsultaRetencionesComponent },
  { path: 'consulta-ord-pago/:id', component: ConsultaOrdPagosComponent },
  { path: 'datos-proveedores/:id', component: DatosProveedoresComponent },
  { path: 'ordenes-publicidad', component: OrdenesPublicidadComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
