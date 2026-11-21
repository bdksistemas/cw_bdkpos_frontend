import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../material/primeng.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { BarGraphComponent } from '../shared/bar-graph/bar-graph.component';

import { TablaDatosComponent } from './reports/ingres/tabla/tabla-datos.component';
import { TituloPaginaComponent } from '../shared/titulo-pagina/titulo-pagina.component';

// VENTAS
import { VentasCategoriaComponent } from './reports/ventas/ventas-categoria/ventas-categoria.component';
import { VentasProductosCanceladosComponent } from './reports/ventas/ventas-productos-cancelados/ventas-productos-cancelados.component';
import { VentasCreditoComponent } from './reports/ventas/ventas-credito/ventas-credito.component';
import { VentasDetalladoComponent } from './reports/ventas/ventas-detallado/ventas-detallado.component';
import { VentasProductoComponent } from './reports/ventas/ventas-producto/ventas-producto.component';
import { SalidasEfectivoComponent } from './reports/ingres/salidas-efectivo/salidas-efectivo.component';
import { GastosGeneralComponent } from './reports/ingres/gastos-general/gastos-general.component';
//ALMACEN
import { AlmacenSalidasComponent } from './reports/almacen/almacen-salidas/almacen-salidas.component';
import { AlmacenEntradasComponent } from './reports/almacen/almacen-entradas/almacen-entradas.component';
import { AlmacenExistenciasComponent } from './reports/almacen/almacen-existencias/almacen-existencias.component';
import { AlmacenOrdenesCompraComponent } from './reports/almacen/almacen-ordenes-compra/almacen-ordenes-compra.component';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ListadoSociosComponent } from './reports/socios/listado-socios/listado-socios.component';
import { CotizacionesComponent } from './reports/ventas/cotizaciones/cotizaciones.component';
import { SistemaApartadoComponent } from './reports/ventas/sistema-apartado/sistema-apartado.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    TablaDatosComponent,
    VentasCategoriaComponent,
    VentasProductosCanceladosComponent,
    VentasCreditoComponent,
    VentasDetalladoComponent,
    VentasProductoComponent,
    SalidasEfectivoComponent,
    GastosGeneralComponent,
    AlmacenSalidasComponent,
    AlmacenEntradasComponent,
    AlmacenExistenciasComponent,
    AlmacenOrdenesCompraComponent,
    ListadoSociosComponent,
    CotizacionesComponent,
    SistemaApartadoComponent

  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    MaterialModule,
    PrimengModule,
    NgxUiLoaderModule,
    SharedModule,
    BarGraphComponent
]
})
export class PagesModule {

}
