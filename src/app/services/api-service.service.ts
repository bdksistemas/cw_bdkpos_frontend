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

//Creamos una funcion para setear los headers
  setHeaders(){
    this.httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'X-Client-Database': sessionStorage.getItem('bd_nombre')?.replace(/['"]+/g, '')!,
      'X-Client-User': sessionStorage.getItem('bd_user')?.replace(/['"]+/g, '')!,
      'X-Client-Password': sessionStorage.getItem('bd_psw')?.replace(/['"]+/g, '')!,
      'X-Client-Host': sessionStorage.getItem('hosting')?.replace(/['"]+/g, '')!,
    });
  }

  //Token quitando comillas
  token = localStorage.getItem('token')?.replace(/['"]+/g, '')!;
  bd_nombre = sessionStorage.getItem('bd_nombre')?.replace(/['"]+/g, '')!;
  bd_user = sessionStorage.getItem('bd_user')?.replace(/['"]+/g, '')!;
  bd_psw = sessionStorage.getItem('bd_psw')?.replace(/['"]+/g, '')!;
  hosting = sessionStorage.getItem('hosting')?.replace(/['"]+/g, '')!;

  //Cremos los headers para las peticiones
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Allow-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + this.token,
    'X-Client-Database': this.bd_nombre,
    'X-Client-User': this.bd_user,
    'X-Client-Password': this.bd_psw,
    'X-Client-Host': this.hosting,
  });



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
