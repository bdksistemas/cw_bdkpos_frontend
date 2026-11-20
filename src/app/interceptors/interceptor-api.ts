import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  private excludeUrls = ['/api/bdkpos/dashboard/datosDashboard'];

  constructor(private _ngxUiLoaderService: NgxUiLoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Aquí puedes realizar modificaciones a la solicitud antes de enviarla
    // Por ejemplo, agregar encabezados personalizados
    // const modifiedRequest = request.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${localStorage.getItem('token')!}`
    //   }
    // });

    // Continuar con la solicitud modificada
    //return next.handle(modifiedRequest);

    // verify if the url is in the excludeUrls


     // Asegurarse de extraer solo la ruta de la URL
     const requestUrl = new URL(request.url, window.location.origin).pathname;

     const isExclude = this.excludeUrls.some((url) => requestUrl === url);

     if (isExclude) {
      return next.handle(request);
    }

    this._ngxUiLoaderService.start();
    return next.handle(request).pipe(
      finalize(() => {
        this._ngxUiLoaderService.stop();
      })
    );
  }
}
