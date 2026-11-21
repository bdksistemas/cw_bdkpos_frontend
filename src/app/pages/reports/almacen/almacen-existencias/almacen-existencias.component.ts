import { Component, ViewChild } from '@angular/core';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as xlsx from 'xlsx';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { sumarColumna } from '../../../../shared/sumar-columna';
import { ApiServiceService } from '../../../../services/api-service.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthService, sucursalInicial } from '../../../../auth/auth.service';
import { alCambiarSucursal } from '../../../../services/sucursal.service';

@Component({
  selector: 'app-almacen-existencias',
  templateUrl: './almacen-existencias.component.html',
  styleUrl: './almacen-existencias.component.css',
})
export class AlmacenExistenciasComponent {
  titulo: string = 'Reporte de Almacén - Existencias';

  verde: string = 'var(--verde)';

  displayedColumns: any[] = [
    'NombreCategoria',
    'NombreProducto',
    // 'TipoProducto',
    // 'Seccion',
    'Costo',
    'Venta',
    'Existencia',
    'MinimoRequerido',
    'MaximoPermitido',
    'Importe'
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Obtenemos la tabla, para poder usarla y descargar en PDF y Excel
  @ViewChild(MatTable) table!: MatTable<any>;
  rowData: any;

  constructor(
    private MatPaginatorIntl: MatPaginatorIntl,
    private apiService: ApiServiceService,
    private toast: ToastrService,
    private authService: AuthService
  ) {
    this.MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this.MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this.MatPaginatorIntl.previousPageLabel = 'Anterior';
  }

  ngOnInit() {
    this.obtenerCategorias();
    this.traerDatosFiltradosAPI(this.fechaInicial, this.fechaFinal, false);
  }

  categorias: any[] = [];
  obtenerCategorias(){
    let sucursal = this.sucursal;
    this.apiService.getCategoriasCliente(sucursal).subscribe((data: any) => {
      this.categorias = data.data;
    });

  }
  categoria: any = 0;
  cambioCategoria(event: any) {
    this.categoria = event.target.value;
  }

  getTotalCost(columna: string) {
    return sumarColumna(this.dataSource, columna);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  downloadPDF() {
    const doc = new jsPDF('landscape'); // Establece la orientación a landscape
    doc.text(' ', 10, 10);
    // Suponiendo que tienes una tabla con id 'my-table' en tu HTML
    const htmlTable = document.getElementById('my-table') as HTMLTableElement;
    if (htmlTable) {
      autoTable(doc, { html: htmlTable });
      doc.save('reporte-almacen-existencias.pdf');
    } else {
      console.error('No se encontró la tabla con el ID "my-table"');
    }
  }

  downloadExcel() {
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(
      this.dataSource.filteredData
    );
    const workbook: xlsx.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'reporte-almacen-existencias');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  //Variables para fecha inicial y fecha final
  sucursal: any = sucursalInicial();
  private _alCambiarSucursal = alCambiarSucursal((s) => this.cambioSucusal(s));
  fechaInicial: string = '';
  fechaFinal: string = '';
  validarFechaInicial(event: any) {
    this.fechaInicial = event.value;

    //Si la fecha inicial es mayor a la fecha final, mostramos un mensaje de error
    if (this.fechaInicial > this.fechaFinal) {
      this.toast.warning('La fecha FINAL no puede ser menor.', 'Advertencia', {
        positionClass: 'toast-bottom-center',
        timeOut: 5000,
      });
    }
  }
  validarFechaFinal(event: any) {
    this.fechaFinal = event.value;

    //Si la fecha inicial esta vacia, mostramos un mensaje de error
    if (this.fechaInicial == null || this.fechaInicial == undefined) {
      this.toast.error('La fecha inicial no puede estar vacía.', 'Error', {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
      return;
    }

    //Evaluamos la fecha final, si es menor a la fecha inicial, mostramos un mensaje de error
    if (this.fechaFinal < this.fechaInicial) {
      this.fechaFinal = this.fechaInicial;
      this.toast.error('La fecha FINAL no puede ser menor.', 'Error', {
        positionClass: 'toast-bottom-center',
        timeOut: 5000,
      });
      return;
    }
  }

  //Los filtros solo guardan su valor; la consulta se hace al presionar "Aplicar filtros"
  aplicarFiltros() {
    this.traerDatosFiltradosAPI(this.fechaInicial, this.fechaFinal);
  }

  private consulta?: Subscription;
  traerDatosFiltradosAPI(fecjaInicial: string, fechaFinal: string, avisar: boolean = true) {
    this.consulta?.unsubscribe();
    this.consulta = this.apiService
      .getReporteAlmacenExistencias(fecjaInicial, fechaFinal, this.sucursal, this.categoria)
      .subscribe((data: any) => {

        //Mandamos llamar nuevamente las categorias, si es que esa sucursal tiene otras.
        this.obtenerCategorias();

        this.MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
        this.MatPaginatorIntl.nextPageLabel = 'Siguiente';
        this.MatPaginatorIntl.previousPageLabel = 'Anterior';
        this.dataSource = new MatTableDataSource(data.data);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        //Mostramos un toast en medio de la pantalla para indicar que se ha filtrado la tabla
        if (avisar) {
          this.toast.success('Se ha filtrado la tabla.', 'Filtrado', {
            /// Mostramos en la parte inferior y en el centro
            positionClass: 'toast-bottom-center',
            // Tiempo de duración del toast
            timeOut: 9000,
            // Mostramos el botón de cerrar
            closeButton: true,
          });
        }
      });
  }

  //Obtener sucursales
  cambioSucusal(valor: any) {
      this.sucursal = Number(valor);
      this.categoria = 0;
      this.obtenerCategorias();
      this.traerDatosFiltradosAPI(this.fechaInicial, this.fechaFinal, false);
    }

}
