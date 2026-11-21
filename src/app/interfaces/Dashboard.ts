export interface Dashboard {
  datosIniciales:      DatosIniciales;
  agrupacionVentas:    'hora' | 'dia' | 'mes';
  serieVentas:         SerieVenta[];
  ventasPorCategorias: VentasPorCategoria[];
  topProductos:        TopProducto[];
  top10clientesAdeudo: Top10clientesAdeudo[];
}

export interface DatosIniciales {
  totalVentas:    number;
  gastosYCompras: number;
  ingresos:       number;
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

export interface Top10clientesAdeudo {
  cliente:     number;
  nomcliente:  string;
  total_saldo: number;
}
