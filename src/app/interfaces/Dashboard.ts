import { ClienteConSaldo } from '../shared/cuentas-clientes/cuentas-clientes.component';

export interface Dashboard {
  datosIniciales:      DatosIniciales;
  agrupacionVentas:    'hora' | 'dia' | 'mes';
  serieVentas:         SerieVenta[];
  ventasPorCategorias: VentasPorCategoria[];
  topProductos:        TopProducto[];
  adeudos:             CuentasClientes;
  apartados:           CuentasClientes;
}

export interface DatosIniciales {
  totalVentas:    number;
  gastosYCompras: number;
  ingresos:       number;
  saldoCredito:   number;
  saldoApartados: number;
  cotizaciones:   number;
}

// etiqueta: "10:00" (hora), "2026-11-20" (día) o "Noviembre 2026" (mes)
export interface SerieVenta {
  etiqueta: string;
  total:    number;
}

export interface TopProducto {
  producto:               number;
  nomproducto:            string;
  total_producto_vendido: number;
}

export interface VentasPorCategoria {
  id_categoria:            number;
  nomcategoria:            string;
  total_ventas:            number;
  total_productos_vendido: number;
}

// Clientes con saldo pendiente (los primeros) y cuántos hay en total.
export interface CuentasClientes {
  clientes: ClienteConSaldo[];
  total:    number;
}
