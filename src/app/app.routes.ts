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
import { RegistroEvidenciaComponent } from './components/pages/registro-evidencia/registro-evidencia.component';
import { ImageComponent } from './components/pages/prueba/image/image.component';
import { AccesoFormulariosComponent} from './components/pages/acceso-formularios/acceso-formularios.component';
import { ListaDeRemesasComponent } from './components/pages/lista-de-remesas/lista-de-remesas.component';
import { AltaRemesaComponent } from './components/pages/lista-de-remesas/alta-remesa/alta-remesa.component';
import { AbmLiquidacionesComponent } from './components/pages/abm-liquidaciones/abm-liquidaciones.component';
import { ImputarComprobantesComponent } from './components/pages/imputar-comprobantes/imputar-comprobantes.component';
import { LiquidacionPorLoteComponent } from './components/pages/abm-liquidaciones/liquidacion-por-lote/liquidacion-por-lote.component';

const APP_ROUTES: Routes = [
  { path: 'test', component: ImageComponent },
  { path: 'compra', component: AbmComprasComponent },
  { path: 'compra/:id', component: AbmComprasComponent },
  { path: 'compra/:id/:expediente', component: AbmComprasComponent },
  { path: 'compra/:id/:expediente/:orden', component: AbmComprasComponent },
  { path: 'articulos', component: AbmArticulosComponent },
  { path: 'articulos/:id', component: AltaArticuloComponent },
  { path: 'proveedores', component: AbmProveedoresComponent },
  { path: 'proveedores/:id', component: AltaProveedorComponent },
  { path: 'ref-contables', component: AbmRefContablesComponent },
  { path: 'ref-contables/:id', component: AltaRefContableComponent },
  { path: 'plan-cuentas', component: AbmPlanDeCuentasComponent },
  { path: 'plan-cuentas/:id', component: AbmPlanDeCuentasComponent },
  { path: 'plan-cuentas/alta/:id', component: AltaPlanDeCuentasComponent },
  { path: 'plan-cuentas/alta/:id/:padre', component: AltaPlanDeCuentasComponent },
  { path: 'prueba', component: TreeComponent },
  /*{ path: 'min-contables', component: AbmMinContablesComponent },*/
  { path: 'min-contables/:id', component: AltaMinContableComponent },
  { path: 'consulta', component: ConsultaDinamicaComponent },
  { path: 'consulta/:id', component: ConsultaDinamicaComponent },
  { path: 'consulta-crd/:id', component: ConsultaCrdComponent },
  { path: 'consulta-comprobantes/:id', component: ConsultaComprobantesComponent },
  { path: 'consulta-retenciones/:id', component: ConsultaRetencionesComponent },
  { path: 'consulta-ord-pago/:id', component: ConsultaOrdPagosComponent },
  { path: 'datos-proveedores/:id', component: DatosProveedoresComponent },
  { path: 'ordenes-publicidad/:id', component: OrdenesPublicidadComponent },
  { path: 'ordenes-publicidad/:id/:ord', component: OrdenesPublicidadComponent },
  { path: 'registo-evidencia', component: RegistroEvidenciaComponent },
  { path: 'formularios', component: AccesoFormulariosComponent },
  { path: 'liquidaciones', component: AbmLiquidacionesComponent },
  { path: 'liq-lote', component: LiquidacionPorLoteComponent },
  { path: 'liq-lote/:id', component: LiquidacionPorLoteComponent },
  { path: 'lista-remesas', component: ListaDeRemesasComponent },
  { path: 'lista-remesas/:id', component: AltaRemesaComponent },
  { path: 'imputar-comprobantes', component: ImputarComprobantesComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
