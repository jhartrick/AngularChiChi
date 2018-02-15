import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameGenieDialogComponent } from './gamegenie.dialog.component';
import { WishboneCheats } from './wishbone.cheats';

@NgModule({
  declarations: [
    GameGenieDialogComponent
  ],
  entryComponents: [
    GameGenieDialogComponent
],
  imports: [
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule
  ],
  providers: [],
  exports: [
    GameGenieDialogComponent
  ]
})
export class CheatingModule { }
