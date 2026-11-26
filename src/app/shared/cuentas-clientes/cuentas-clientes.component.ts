import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ClienteConSaldo {
  cliente: number;
  nomcliente: string;
  tel1: string;
  tel2: string;
  total_saldo: number;
  total_vendido: number;
  cuentas: number;
  desde: string;
  fecha_ref: string | null; // 'YYYY-MM-DD': último pago (crédito) o vencimiento (apartado)
}

// Una tarjeta por cliente con saldo pendiente (ventas a crédito o apartados) y botón "Ver todos" hacia su reporte.
@Component({
  selector: 'cuentas-clientes',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cuentas-clientes.component.html',
  styleUrl: './cuentas-clientes.component.css',
})
export class CuentasClientesComponent {
  @Input({ required: true }) titulo = '';
  @Input({ required: true }) clientes: ClienteConSaldo[] = [];
  @Input() total = 0; // clientes en total (puede ser mayor a los que se muestran)
  @Input({ required: true }) rutaReporte = '';
  @Input() etiquetaFecha = 'Último pago';
  @Input() conVencido = false; // solo si la fecha es un vencimiento real (apartados), no un último pago
  @Input() etiquetaVencido = 'Vencido';
  @Input() etiquetaCuenta = 'Cuenta abierta';
  @Input() etiquetaCuentas = 'Cuentas abiertas';
  @Input() textoVacio = 'No hay cuentas con adeudo.';

  // Vencido: la fecha ya pasó (fechas 'YYYY-MM-DD', se comparan como texto; 'sv-SE' da ese formato en hora local).
  vencido(c: ClienteConSaldo): boolean {
    return this.conVencido && !!c.fecha_ref && c.fecha_ref < new Date().toLocaleDateString('sv-SE');
  }

  porcentajeAbonado(c: ClienteConSaldo): number {
    return c.total_vendido ? ((c.total_vendido - c.total_saldo) / c.total_vendido) * 100 : 0;
  }
}
