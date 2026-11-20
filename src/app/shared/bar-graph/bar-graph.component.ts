import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'generic-graph',
  standalone: true,
  imports: [],
  template: `
    <div class="card ">
      <div class="card-header card-header-negro">
        <h3 class="card-title">{{title}}</h3>

        <div class="card-tools"></div>
      </div>
      <div class="card-body" id="barChartContainer">
        <canvas [id]="chartId" class="canvas-chart"></canvas>
      </div>
    </div>
  `,
  styleUrl: './bar-graph.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarGraphComponent {
  barChart!: Chart;
  @Input() barOptions:any;
  @Input({ required: true }) title: string = 'Indica el titulo';
  @Input({ required: true }) chartId: string = '00';
  @Input({ required: true }) labelChart: string = 'Ej. Total ventas por';
  @Input({ required: true }) chartData: any[] = [];
  @Input({ required: true }) typeChart: any = 'bar';
  // Función personalizada para procesar los datos
  @Input({ required: true }) processChartData!: (data: any) => {
    labels: string[];
    data: number[];
  };

  ngAfterViewInit() {
    this.loadChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      // Actualizar gráfica si `chartData` cambia
      this.updateChart();
    }
  }

  loadChart() {
    if (!this.processChartData) {
      console.error('No se ha definido la función processChartData');
      return;
    }

    const { labels, data } = this.processChartData(this.chartData);

    if (this.barChart) {
      this.barChart.destroy();
    }
    const randomColors = this.generateColors(data.length);
    console.log('Colores generados:', randomColors);


    this.barChart = new Chart(this.chartId, {
      type: this.typeChart,
      data: {
        labels: labels,
        datasets: [
          {
            label: this.labelChart,
            data: data,
            backgroundColor: randomColors,
            borderColor: randomColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...this.barOptions,
        maintainAspectRatio: false, // Permite un mejor ajuste en pantallas pequeñas
        responsive: true, // Permite que la gráfica se ajuste al tamaño del contenedor
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return value.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                });
              },
            },
          },
        },
      },
    });
  }

  private updateChart(): void {
    if (!this.barChart) {
      return;
    }

    const { labels, data } = this.processChartData(this.chartData);
     // Generar colores dinámicos nuevamente
    const randomColors = this.generateColors(data.length);

    // Actualiza los datos y etiquetas de la gráfica
    this.barChart.data.labels = labels;
    this.barChart.data.datasets[0].data = data;
    this.barChart.data.datasets[0].backgroundColor = randomColors; // Colores dinámicos
    this.barChart.data.datasets[0].borderColor = randomColors;    // Colores dinámicos

    this.barChart.update(); // Actualiza la gráfica sin recrearla
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`; // Transparencia opcional
  }

  private generateColors(count: number): string[] {
    return Array.from({ length: count }, () => this.getRandomColor());
  }

}
