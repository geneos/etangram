import { RouterModule, Routes } from '@angular/router';

import { AbmComprasComponent } from './components/pages/abm-compras/abm-compras.component';
import { AbmArticulosComponent } from './components/pages/abm-articulos/abm-articulos.component';
import { AltaArticuloComponent } from './components/pages/abm-articulos/alta-articulo/alta-articulo.component';
import { AbmProveedoresComponent } from './components/pages/abm-proveedores/abm-proveedores.component';
import { AltaProveedorComponent } from './components/pages/abm-proveedores/alta-proveedor/alta-proveedor.component';
//import { SearchComponent } from './components/search/search.component';
//import { ArtistaComponent } from './components/artista/artista.component';

const APP_ROUTES: Routes = [
  { path: 'compra', component: AbmComprasComponent },
  { path: 'articulos', component: AbmArticulosComponent },
  { path: 'articulos/:id', component: AltaArticuloComponent },
  { path: 'proveedores', component: AbmProveedoresComponent },
  { path: 'proveedores/:id', component: AltaProveedorComponent },
  //{ path: 'buscar', component: SearchComponent },
  //{ path: 'artista/:id', component: ArtistaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'compra' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
