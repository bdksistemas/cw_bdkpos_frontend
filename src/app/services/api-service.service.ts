import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { Dashboard } from '../interfaces/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService  {

  private dominio= environment.DOMINIO_API_LOCAL;
  constructor(private http:HttpClient) {
  }

  // Headers armados en cada petición: el token se lee al momento y se le quitan las comillas con que se guarda.
  // Las credenciales de BD ya no viajan: el backend las resuelve en el servidor con el idcw del token.
  get httpOptions(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token')?.replace(/['"]+/g, '') ?? ''),
    });
  }

  // Se conserva porque los métodos la llaman; el getter httpOptions ya arma los headers.
  setHeaders(){}

  getInitialData($sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){

    this.setHeaders();

    
    let url = 'dashboard/datosDashboard'
    let data = {
      'id_usuario': $usuario,
      'sucursal': $sucursal
    }
    return this.http.post<Dashboard>(`${this.dominio}${url}`, data, {headers: this.httpOptions})

    // return this.http.post<Dashboard>(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getReporteTickets($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, categoria:any =null ,$usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rtickets/obtenerRegistrosTickets'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'id_usuario': $usuario,
      'sucursal': $sucursal,
      'categoria': categoria,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getReporteVentasDetalle($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $cajero: any = null, fp:any = null){
    let url = 'rtickets/obtenerRegistroVentasDetallado'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'cajero': $cajero,
      'sucursal': $sucursal,
      'fp': fp,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getReporteVentasProducto($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $categoria=0 ,$usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rtickets/ventas-detallado'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'id_usuario': $usuario,
      'sucursal': $sucursal,
      'categoria': $categoria

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getCotizaciones($fechaInicial:any =null, $fechaFinal:any =null, sucursal: number = 1, $categoria=0 ,$usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rtickets/getCotizaciones'
    let data = {
      'sucursal': sucursal,
    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions});
  }


  getSeparateSales($fechaInicial:any =null, $fechaFinal:any =null, sucursal: number = 1, $categoria=0 ,$usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rtickets/getSeparateSales'
    let data = {
      'sucursal': sucursal,
    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions});
  }

  getReporteVentasCategoria($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $categoria=1 ,$usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rventas/getVentasCategoria'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'id_usuario': $usuario,
      'sucursal': $sucursal,
      'categoria': $categoria

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getReporteVentasProdCancelados($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rventas/getProductosCancelados'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'id_usuario': $usuario,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getReporteAlmacenExistencias($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $categoria:number =0, $usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'ralmacen/getExistencias'
    let data = {
      'sucursal': $sucursal,
      'categoria': $categoria,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getEntradasAlmacen($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, provedor:any=0){
    let url = 'ralmacen/getEntradasAlmacen'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'provedor': provedor,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }
  getSalidasAlmacen($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'ralmacen/getSalidasAlmacen'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      // 'id_usuario': $usuario,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getAlmacenOrdenesCompra($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, provedor:any=null, estatus:any=null){
    let url = 'ralmacen/getAlmacenOrdenesCompra'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'provedor': provedor,
      'sucursal': $sucursal,
      'estatus': estatus

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getGastos($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, concepto:any =0, provedor:any =0, tmovimiento:any =null){
    let url = 'ralmacen/getGastos'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'sucursal': $sucursal,
      'concepto': concepto,
      'proveedor': provedor,
      'producto': tmovimiento

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }
  getSalidasEfectivo($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $cajero:any =0){
    let url = 'ralmacen/getSalidasEfectivo'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'cajero': $cajero,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }


  getCategorias(sucursal:any){
    let url = 'general/getCategorias'
    let data = {
      'sucursal': sucursal,
    }

    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }
  getCategoriasCliente(sucursal:any){
    let url = 'general/getCategoriasCliente'
    let data = {
      'sucursal': sucursal,
    }

    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getCajeros(sucursal:any){

    let url = 'general/getCajeros'
    let data = {
      'sucursal': sucursal,
    }

    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }



  getListaSociosActivos($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, categoria:number =0){
    let url = 'rsocios/getListaSociosActivos'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'categoria': categoria,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getVentasCredito($fechaInicial:any =null, $fechaFinal:any =null, $sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){
    let url = 'rventas/getVentasCredito'
    let data = {
      'fecha_inicial': $fechaInicial,
      'fecha_final': $fechaFinal,
      'id_usuario': $usuario,
      'sucursal': $sucursal,

    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }



  getProveedores( $sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){

    let url = 'general/getProveedores'

    let data = {
      'id_usuario': $usuario,
      'sucursal': $sucursal,
    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getConceptos( $sucursal: number = 1, $usuario: string = localStorage.getItem('id_usuario')!){

    let url = 'general/getConceptos'

    let data = {
      'id_usuario': $usuario,
      'sucursal': $sucursal,
    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

  getEstatus(sucursal:any =1){
    let url = 'general/getEstatus'
    let data = {
      'sucursal': sucursal,
    }
    return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
  }

getFormasPago(sucursal:any =1){
  let url = 'general/formasPago'
  let data = {
    'sucursal': sucursal,
  }
  return this.http.post(`${this.dominio}${url}`, data, {headers: this.httpOptions})
}



}
