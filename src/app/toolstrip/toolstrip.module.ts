import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolStripComponent } from './toolstrip.component';
import { PopoverComponent } from './popover/popover.component';
import { PopoverDirective } from './popover/popover.directive';
import { RouterModule } from '@angular/router';

import { PopoverSegmentComponent } from './popover/popover.segment';

@NgModule({
  declarations: [
    ToolStripComponent,
    PopoverComponent,
    PopoverSegmentComponent,
    PopoverDirective
  ],
  entryComponents: [
  ],
  imports: [
      RouterModule,
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule,

  ],
  exports: [
    PopoverComponent,
    PopoverSegmentComponent,
    ToolStripComponent
  ]
})
export class ToolStripModule { }
