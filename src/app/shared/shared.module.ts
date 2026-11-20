import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TituloPaginaComponent } from './titulo-pagina/titulo-pagina.component';



@NgModule({
  declarations: [
    NavbarComponent,
    BreadcrumbsComponent,
    FooterComponent,
    TituloPaginaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    NavbarComponent,
    BreadcrumbsComponent,
    FooterComponent,
    TituloPaginaComponent,

  ]
})
export class SharedModule { }
