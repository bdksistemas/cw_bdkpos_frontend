import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  inject,
  signal,
  effect,
} from '@angular/core';
import { Chart } from 'chart.js';
import { ApiServiceService } from '../../services/api-service.service';
import { Licencia } from '../../interfaces/Licencia';
import { AuthService } from '../../auth/auth.service';
import {
  Dashboard,
  DatosIniciales,
  Top10clientesAdeudo,
  TopProducto,
  VentasDiariasUltimos10Dia,
  VentasPorCategoria,
  VentasPorMe,
} from '../../interfaces/Dashboard';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.None, // Permite que los estilos de ANGULAR MATERIAL se apliquen correctamente DESDE NUESTRO CSS
})
export class DashboardComponent {
  //Subjects
  public salesDataSubject = new Subject<void>();
  //create a signal to change sucursal
  sucursal$ = signal(1);

  //Injects
  private changeDetectorRef = inject(ChangeDetectorRef);
  private apiService = inject(ApiServiceService);
  private authService = inject(AuthService);

  //! Datos
  public sucursales: Licencia[] = [];
  datosIniciales$ = signal<DatosIniciales | null>(null);
  ventasPorMes$ = signal<VentasPorMe[]>([]);
  ventasA10Dias$ = signal<VentasDiariasUltimos10Dia[]>([]);
  ventasCategoria$ = signal<VentasPorCategoria[]>([]);
  top10ProductsData$ = signal<TopProducto[]>([]);
  top10ClientesAdeudo$ = signal<Top10clientesAdeudo[]>([]);

  constructor() {

    // Intervalo para actualizar datos cada 5 segundos

    interval(5000)
      .pipe(
        switchMap(() => this.apiService.getInitialData(this.sucursal$())),
        takeUntil(this.salesDataSubject)
      )
      .subscribe((data) => {
        this.setInitialData(data);
      });

    // Efecto para reaccionar al cambio de sucursal
    effect(() => {
      const sucursal = this.sucursal$();
      this.getInitialData(sucursal);
    });
  }
  ngOnDestroy() {
    this.salesDataSubject.next();
    this.salesDataSubject.complete();
  }

  ngOnInit(): void {
    this.obtenerSucursales();

    this.getInitialData(this.sucursal$());

  }

  getInitialData(sucursal: any) {
    //Vaciamos todas las graficas para volver a cargarlas.
    this.apiService.getInitialData(sucursal).subscribe((res: Dashboard) => {
      this.setInitialData(res);
    });
  }
  setInitialData(res: any) {
    this.datosIniciales$.set(res.datosIniciales);
    this.top10ProductsData$.set(res.topProductos);
    this.ventasPorMes$.set(res.ventasPorMes);
    this.ventasA10Dias$.set(res.ventasDiariasUltimos10Dias);
    this.ventasCategoria$.set(res.ventasPorCategorias);
    this.top10ClientesAdeudo$.set(res.top10clientesAdeudo);
  }

  salesData = [
    { nomcategoria: 'Electrónica', cantidad: 15, total: 5000 },
    { nomcategoria: 'Ropa', cantidad: 10, total: 3000 },
    { nomcategoria: 'Alimentos', cantidad: 25, total: 7500 },
  ];
  processSalesData = (data: any[]) => {
    const labels = data.map(
      (item) => `${item.nomcategoria} (${item.cantidad})`
    );
    const values = data.map((item) => item.total);
    return { labels, data: values };
  };

  processSalesForMonthData = (data: any[]) => {
    const labels = data.map((item) => `${item.mes}: $${item.total}`);
    const values = data.map((item) => item.total);
    return { labels, data: values };
  };

  processDialySalesData = (data: any[]) => {
    const labels = data.map((item) => `${this.dateBecomeToday(item.fecha) }: $${item.total}`);
    const values = data.map((item) => item.total);
    return { labels, data: values };
  };

  processCategorySalesData = (data: any[]) => {
    const labels = data.map(
      (item) => `${item.nomcategoria} (${item.total_ventas})`
    );
    const values = data.map((item) => item.total_ventas);
    return { labels, data: values };
  };

  processSalesTop10Data = (data: any[]) => {
    const labels = data.map(
      (item) => `${item.nomproducto} (${item.total_producto_vendido})`
    );
    const values = data.map((item) => item.total_producto_vendido);
    return { labels, data: values };
  };

  // optionsTop10Products = {
  //   indexAxis: 'y',
  //   elements: {
  //     bar: {
  //       borderWidth: 2,
  //     },
  //   },
  //   responsive: true,
  // };


  optionCategorySales = {
    cales: {
      y: {
        ticks: {
          
        }
      }
    }
  }
  toggleCollapse(cardId: string) {
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.toggle('collapsed');
    }
  }
  //Obtener sucursales

  obtenerSucursales() {
    const sucursales = this.authService.getLicencias();
    this.sucursales = sucursales || this.authService.setLicencias();
  }

  cambioSucursal(event: any) {
    this.sucursal$.set(event.target.value);
  }

  dateBecomeToday(date: string) {
    // Example: 2021-08-01 -> Lunes 1 de Agosto
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'long', day: 'numeric' };
    return dateObject.toLocaleDateString('es-MX', options);

  }
}
