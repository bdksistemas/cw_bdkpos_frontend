import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip);

export interface DonaItem {
  label: string;
  valor: number;
}

interface DonaFila {
  label: string;
  valor: number;
  porcentaje: number;
  color: string;
}

// Colores fijos (no aleatorios): el mismo concepto siempre se pinta igual.
const PALETA = ['#d9001d', '#2563eb', '#059669', '#f59e0b', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#ea580c', '#64748b'];
const COLOR_OTROS = '#9ca3af';

// Gráfica de dona con total al centro y leyenda "valor · %".
// Si hay más de maxItems elementos, el resto se junta en "Otros".
@Component({
  selector: 'donut-graph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="donut-card">
      <h3 class="donut-title">{{ title }}</h3>

      @if (filas.length) {
        <div class="donut-wrap">
          <canvas #canvas></canvas>
          <div class="donut-centro">
            <strong>{{ formato(total) }}</strong>
            <small>{{ caption }}</small>
          </div>
        </div>
        <ul class="donut-leyenda">
          @for (f of filas; track f.label) {
            <li>
              <span class="donut-muestra" [style.background]="f.color"></span>
              <span class="donut-nombre" [title]="f.label">{{ f.label }}</span>
              <span class="donut-valor">{{ formato(f.valor) }} · {{ f.porcentaje }}%</span>
            </li>
          }
        </ul>
      } @else {
        <p class="donut-vacio">Sin datos en este periodo.</p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; flex: 1 1 420px; min-width: 0; }
    .donut-card {
      height: 100%;
      padding: 20px;
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
    .donut-title {
      margin: 0 0 16px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .donut-wrap { position: relative; width: 220px; height: 220px; margin: 0 auto 20px; }
    .donut-centro {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .donut-centro strong { font-size: 18px; color: var(--ink); }
    .donut-centro small { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
    .donut-leyenda { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .donut-leyenda li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink); }
    .donut-muestra { flex: none; width: 14px; height: 14px; border-radius: 3px; }
    .donut-nombre { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .donut-valor { flex: none; color: var(--muted); font-variant-numeric: tabular-nums; }
    .donut-vacio { margin: 0; color: var(--muted); font-size: 14px; }
  `],
})
export class DonutGraphComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) title = '';
  @Input({ required: true }) items: DonaItem[] = [];
  @Input() maxItems = 8;
  @Input() moneda = true; // true = pesos; false = cantidades (piezas)
  @Input() caption = 'Total';

  // El canvas solo existe cuando hay datos (@if): el setter corre cada vez que aparece o desaparece.
  private canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas') set canvasRef(ref: ElementRef<HTMLCanvasElement> | undefined) {
    this.canvas = ref;
    this.dibujar();
  }

  filas: DonaFila[] = [];
  total = 0;
  private chart?: Chart<'doughnut'>;

  ngOnChanges(): void {
    this.calcular();
    this.dibujar(); // actualiza la dona si el canvas ya existe
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  formato(n: number): string {
    return this.moneda
      ? n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })
      : n.toLocaleString('es-MX', { maximumFractionDigits: 2 });
  }

  private calcular(): void {
    const validos = this.items.filter((i) => i.valor > 0).sort((a, b) => b.valor - a.valor);
    const visibles = validos.slice(0, this.maxItems);
    const otros = validos.slice(this.maxItems).reduce((s, i) => s + i.valor, 0);

    this.total = validos.reduce((s, i) => s + i.valor, 0);
    const base = visibles.map((i, n) => ({ label: i.label || 'Sin nombre', valor: i.valor, color: PALETA[n % PALETA.length] }));
    if (otros > 0) base.push({ label: 'Otros', valor: otros, color: COLOR_OTROS });
    this.filas = base.map((f) => ({ ...f, porcentaje: Math.round((f.valor / this.total) * 100) }));
  }

  private dibujar(): void {
    const el = this.canvas?.nativeElement;
    if (!el) {
      this.chart?.destroy();
      this.chart = undefined;
      return;
    }
    const datos = {
      labels: this.filas.map((f) => f.label),
      datasets: [{ data: this.filas.map((f) => f.valor), backgroundColor: this.filas.map((f) => f.color), borderColor: '#fff', borderWidth: 2 }],
    };
    if (this.chart && this.chart.canvas === el) {
      this.chart.data = datos;
      this.chart.update();
      return;
    }
    this.chart?.destroy();
    this.chart = new Chart(el, {
      type: 'doughnut',
      data: datos,
      options: {
        cutout: '62%',
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.label}: ${this.formato(Number(c.raw))}` } },
        },
      },
    });
  }
}
