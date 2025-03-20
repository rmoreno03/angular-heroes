import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  standalone: false,
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {
  public sideBarItems = [
    { label: 'Listado', icon: 'list', route: './list' },
    { label: 'Añadir', icon: 'add', route: './new-hero' },
    { label: 'Buscador', icon: 'search', route: './search' }
  ]
}
