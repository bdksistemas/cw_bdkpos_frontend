export interface Dashboard {
  top10clientesAdeudo:        Top10clientesAdeudo[];
  ventasDiariasUltimos10Dias: VentasDiariasUltimos10Dia[];
  ventasPorMes:               VentasPorMe[];
  datosIniciales:             DatosIniciales;
  ventasPorCategorias:        VentasPorCategoria[];
  topProductos:               TopProducto[];
}

export interface DatosIniciales {
  totalVentas:     number;
  gastosYCompras:  number;
  ingresosDiarios: number;
  cotizaciones:    number;
}

export interface TopProducto {
  producto:               number;
  nomproducto:            string;
  total_producto_vendido: number;
}

export interface VentasDiariasUltimos10Dia {
  fecha: Date;
  total: number | string;
}

export interface VentasPorCategoria {
  id_categoria:            number;
  nomcategoria:            string;
  total_ventas:            number;
  total_productos_vendido: number;
}

export interface VentasPorMe {
  mes:   string;
  total: number;
}

export interface Top10clientesAdeudo {
  cliente: number;
  nomcliente:  string;
  total_saldo:   number;
}
