import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../guards/auth.guard';
import { GastosGeneralComponent } from './reports/ingres/gastos-general/gastos-general.component';
import { autorizationGuard } from '../guards/autorization.guard';
import { SalidasEfectivoComponent } from './reports/ingres/salidas-efectivo/salidas-efectivo.component';
import { AlmacenOrdenesCompraComponent } from './reports/almacen/almacen-ordenes-compra/almacen-ordenes-compra.component';
import { AlmacenSalidasComponent } from './reports/almacen/almacen-salidas/almacen-salidas.component';
import { AlmacenEntradasComponent } from './reports/almacen/almacen-entradas/almacen-entradas.component';
import { AlmacenExistenciasComponent } from './reports/almacen/almacen-existencias/almacen-existencias.component';
import { VentasCreditoComponent } from './reports/ventas/ventas-credito/ventas-credito.component';
import { VentasDetalladoComponent } from './reports/ventas/ventas-detallado/ventas-detallado.component';
import { VentasCategoriaComponent } from './reports/ventas/ventas-categoria/ventas-categoria.component';
import { VentasProductoComponent } from './reports/ventas/ventas-producto/ventas-producto.component';
import { TablaDatosComponent } from './reports/ingres/tabla/tabla-datos.component';
import { ListaClientesComponent } from './reports/clientes/lista-clientes/lista-clientes.component';
import { CotizacionesComponent } from './reports/ventas/cotizaciones/cotizaciones.component';
import { VentasProductosCanceladosComponent } from './reports/ventas/ventas-productos-cancelados/ventas-productos-cancelados.component';
import { SistemaApartadoComponent } from './reports/ventas/sistema-apartado/sistema-apartado.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [authGuard],

    children: [
      {
        path: 'Inicio',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'reportes/tickets',
        component: TablaDatosComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'reportes/ventas-detallado',
        component: VentasDetalladoComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      //VENTAS
      {
        path: 'ventas/ventas-producto',
        component: VentasProductoComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/ventas-categoria',
        component: VentasCategoriaComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/reporte-ingresos',
        component: VentasDetalladoComponent,
        // component: GastosGeneralComponent,

        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/ventas-credito',
        component: VentasCreditoComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/cotizaciones',
        component: CotizacionesComponent,
        data: { animation: 'fadeIn'},
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/productos-cancelados',
        component: VentasProductosCanceladosComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },
      {
        path: 'ventas/apartados',
        component: SistemaApartadoComponent,
        data: { animation: 'fadeIn'},
        canActivate: [autorizationGuard]
      },

      //ALMACEN
      {
        path: 'almacen/existencias',
        component: AlmacenExistenciasComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },
      {
        path: 'almacen/entradas',
        component: AlmacenEntradasComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },
      {
        path: 'almacen/salidas',
        component: AlmacenSalidasComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },
      {
        path: 'almacen/ordenes-compra',
        component: AlmacenOrdenesCompraComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },

      //CLIENTES
      {
        path: 'clientes/lista',
        component: ListaClientesComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]
      },

      //GASTOS

      {
        path: 'gastos/gastos-general',
        component: GastosGeneralComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },
      {
        path: 'gastos/salida-efectivo',
        component: SalidasEfectivoComponent,
        data: { animation: 'fadeIn' },
        canActivate: [autorizationGuard]

      },
      { path: '', redirectTo: '/dashboard/Inicio', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
