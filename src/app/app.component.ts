import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';

import { loadCartFromFile } from '../chichi/wishbone/filehandler';

import { BaseCart  } from 'chichi';

import * as THREE from 'three';
import { DialogService } from './dialog.service';
import { createWishboneFromCart, Wishbone,  WishboneIO } from '../chichi/wishbone/wishbone';


import { WishboneVideo } from '../chichi/wishbone/video';
import { WishboneAudio } from '../chichi/wishbone/audio';
import { WishboneControlPads } from '../chichi/wishbone/controlpads';

import { LocalAudioSettings } from '../chichi/threejs/audio.localsettings';
import { WishboneRuntime, createWishboneRuntime } from '../chichi/wishbone/runtime';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    host: {
        '(document:keydown)': 'onkeydown($event)',
        '(document:keyup)': 'onkeyup($event)'
    }
})
export class AppComponent implements OnInit {

  builders: ((wishbone?: Wishbone) => (io: WishboneIO) => Readonly<WishboneIO>)[];
  title = 'ChiChiNg';

  @ViewChild('chichiCanvas') chichiCanvas;

  cart: BaseCart;
  audio: LocalAudioSettings;
  runtime: WishboneRuntime;

  paused: boolean = false;
  muted = false;

  constructor(private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.builders = [
      WishboneControlPads.setupKeyboards(this),
      WishboneAudio.setupAudioThreeJS(),
      WishboneVideo.setupVideoCanvas({ canvas: this.chichiCanvas.nativeElement })
    ];

  }

  mute (value: boolean) {
    value ?  this.audio.mute() : this.audio.unmute();
  }

  pause(value: boolean) {
    if (this.runtime) {
        this.runtime.pause(value);
    }
  }
  
  onkeydown(event) { }

  onkeyup(event) { } 

  loadfile(e: Event) {
    // loadCartFromUrl(this.url).then(cart => this.cart = cart);
    this.audio ? this.audio.stop() : ()=>{};
    (async ()=> {
      const cart = await loadCartFromFile((<HTMLInputElement>e.target).files[0]);
      this.cart = cart;
      await this.runCart(cart);
    })();
  }

  private runCart(value: BaseCart) {

      return (async () => {
        if (this.runtime) {
          this.runtime = undefined
        }

        const wishbone = createWishboneFromCart(value);

        const setupRuntime = createWishboneRuntime(wishbone);

        const wbBuilders = this.builders.map(b => b(wishbone));

        const runchi = () => {
          // build IO object
          let wbio = undefined;
          wbBuilders.forEach(builder => {
            wbio = builder(wbio)
          });
          // set up audio hooks
          this.audio = wbio.audio();
          return setupRuntime(wbio);
        }

        wishbone.cart = value;

        this.runtime = runchi();
      })();
  }
}

