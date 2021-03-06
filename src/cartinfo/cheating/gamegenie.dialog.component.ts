import { Component, Inject, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Wishbone } from '../../chichi/wishbone/wishbone';
import { GameGenieCode } from 'chichi';

@Component({
  selector: 'cheating-gamegeniedialog',
  templateUrl: './gamegenie.dialog.component.html',
  styleUrls: ['./gamegenie.dialog.component.css']
})
export class GameGenieDialogComponent {
    wishbone: Wishbone;
    cheats: Array<GameGenieCode> = new Array<GameGenieCode>();
    constructor(
        public dialogRef: MatDialogRef<GameGenieDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef
    ) {
        this.wishbone = data.wishbone;
        this.cheats = data.codes;
    }

    apply() {
        // TODO:
        // this.wishbone.setCheats(this.cheats);
        for (let i = 0; i < this.cheats.length; ++i) {
            console.log(this.cheats[i].code + ' ' + this.cheats[i].active);
        }
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
   }
}
