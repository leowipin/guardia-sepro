import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesPage } from './solicitudes.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesPage
  },
  {
    path: 'detalle',
    loadChildren: () => import('../detalle/detalle.module').then( m => m.DetallePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesPageRoutingModule {}
