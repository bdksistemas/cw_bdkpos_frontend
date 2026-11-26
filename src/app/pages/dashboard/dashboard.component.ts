import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewEncapsulation, computed, signal } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { sucursalInicial } from '../../auth/auth.service';
import { alCambiarSucursal } from '../../services/sucursal.service';
import {
  Dashboard,
  DatosIniciales,
  SerieVenta,
  CuentasClientes,
  TopProducto,
  VentasPorCategoria,
} from '../../interfaces/Dashboard';

// jQuery y moment se cargan como scripts globales (angular.json); el selector de fechas es el plugin daterangepicker.
declare const $: any;
declare const moment: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.None, // Permite que los estilos de ANGULAR MATERIAL se apliquen correctamente DESDE NUESTRO CSS
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Sucursal activa de la barra superior (nunca 1 fijo).
  sucursal: any = sucursalInicial();
  private _alCambiarSucursal = alCambiarSucursal((s) => this.cambioSucusal(s));

  // Periodo de las tarjetas y gráficas que dependen de él (por defecto HOY).
  fechaInicial: string = moment().format('YYYY-MM-DD');
  fechaFinal: string = moment().format('YYYY-MM-DD');
  etiquetaPeriodo: string = 'Hoy';
  agrupacionVentas: string = 'hora';

  datosIniciales$ = signal<DatosIniciales | null>(null);
  serieVentas$ = signal<SerieVenta[]>([]);
  ventasCategoria$ = signal<VentasPorCategoria[]>([]);
  top10ProductsData$ = signal<TopProducto[]>([]);
  // Datos de las gráficas de dona (etiqueta + valor).
  categoriasDona = computed(() =>
    this.ventasCategoria$().map((i) => ({ label: i.nomcategoria, valor: i.total_productos_vendido })),
  );
  productosDona = computed(() =>
    this.top10ProductsData$().map((i) => ({ label: i.nomproducto, valor: i.total_producto_vendido })),
  );
  adeudos$ = signal<CuentasClientes>({ clientes: [], total: 0 });
  apartados$ = signal<CuentasClientes>({ clientes: [], total: 0 });

  constructor(private apiService: ApiServiceService, private zone: NgZone) {}

  ngOnInit(): void {
    this.getInitialData();
  }

  ngAfterViewInit(): void {
    moment.locale('es');
    const ayer = moment().subtract(1, 'days');
    $('#rangoFechas').daterangepicker(
      {
        startDate: moment(),
        endDate: moment(),
        maxDate: moment(),
        opens: 'left',
        alwaysShowCalendars: true,
        ranges: {
          'Hoy': [moment(), moment()],
          'Ayer': [ayer, ayer],
          'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
          'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
          'Este mes': [moment().startOf('month'), moment()],
          'El mes pasado': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
        },
        locale: {
          format: 'DD/MM/YYYY',
          separator: ' - ',
          applyLabel: 'Actualizar',
          cancelLabel: 'Cancelar',
          customRangeLabel: 'Personalizado',
          daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          monthNames: moment.months(),
          firstDay: 1,
        },
      },
      (inicio: any, fin: any, etiqueta: string) => {
        // El plugin llama fuera de la zona de Angular.
        this.zone.run(() => this.cambioFechas(inicio, fin, etiqueta));
      }
    );
  }

  ngOnDestroy(): void {
    $('#rangoFechas').data('daterangepicker')?.remove();
  }

  // Título de la gráfica de ventas según cómo agrupa el backend: 1 día = por hora, hasta 31 días = por día, más = por mes.
  get tituloVentas(): string {
    const titulos: any = { hora: 'VENTAS POR HORA', dia: 'VENTAS POR DÍA', mes: 'VENTAS POR MES' };
    return titulos[this.agrupacionVentas] ?? 'VENTAS';
  }

  cambioFechas(inicio: any, fin: any, etiqueta: string) {
    this.fechaInicial = inicio.format('YYYY-MM-DD');
    this.fechaFinal = fin.format('YYYY-MM-DD');
    this.etiquetaPeriodo =
      etiqueta === 'Personalizado' ? inicio.format('DD/MM/YYYY') + ' - ' + fin.format('DD/MM/YYYY') : etiqueta;
    this.getInitialData();
  }

  cambioSucusal(valor: any) {
    this.sucursal = Number(valor);
    this.getInitialData();
  }

  getInitialData() {
    this.apiService.getInitialData(this.sucursal, this.fechaInicial, this.fechaFinal).subscribe((res: Dashboard) => {
      this.datosIniciales$.set(res.datosIniciales);
      this.agrupacionVentas = res.agrupacionVentas;
      this.serieVentas$.set(res.serieVentas);
      this.ventasCategoria$.set(res.ventasPorCategorias);
      this.top10ProductsData$.set(res.topProductos);
      this.adeudos$.set(res.adeudos);
      this.apartados$.set(res.apartados);
    });
  }

  // Procesadores de las gráficas (etiquetas y valores).
  processSerieVentas = (data: SerieVenta[]) => ({
    labels: data.map((item) => `${this.etiquetaSerie(item.etiqueta)}: ${this.moneda(item.total)}`),
    data: data.map((item) => item.total),
  });

  private moneda(valor: number) {
    return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  }

  // 'dia' llega como 2026-11-20 -> "vie, 20 de noviembre"; 'hora' y 'mes' ya llegan como texto.
  private etiquetaSerie(etiqueta: string) {
    if (this.agrupacionVentas !== 'dia') return etiqueta;
    const [a, m, d] = etiqueta.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString('es-MX', { weekday: 'short', month: 'long', day: 'numeric' });
  }
}
