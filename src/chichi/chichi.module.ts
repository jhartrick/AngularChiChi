import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChiChiComponent } from './chichiview/chichines.component';
import { ChiChiCanvasComponent } from './canvaschichi/chichi.canvas.component';


@NgModule({
  declarations: [
    ChiChiComponent,
    ChiChiCanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  exports: [
      ChiChiComponent,
      ChiChiCanvasComponent
  ]
})
export class ChiChiModule { }
