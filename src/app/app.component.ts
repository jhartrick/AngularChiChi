import { Component, ChangeDetectionStrategy, ViewChild, OnInit, NgZone } from '@angular/core';

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

  chichiIO: (wishbone: Wishbone) => WishboneIO;
  title = 'ChiChiNg';

  @ViewChild('chichiCanvas') chichiCanvas;

  cart: BaseCart;
  audio: LocalAudioSettings;
  runtime: WishboneRuntime;
  wishbone: Wishbone;

  paused: boolean = false;
  muted = false;

  constructor(public zone: NgZone, public dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.chichiIO = updateIO([
      WishboneControlPads.setupKeyboards(this),
      WishboneAudio.setupAudioThreeJS(),
      WishboneVideo.setupVideoThreeJS({ canvas: this.chichiCanvas.nativeElement })
    ])(undefined);
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
    
    (async ()=> {
      const cart = await loadCartFromFile((<HTMLInputElement>e.target).files[0]);
      this.cart = cart;
      await this.runCart(cart);
    })();
  }

  private runCart(value: BaseCart) {

      return (async () => {
        if (this.runtime) {
          await this.runtime.teardown();
        }

        const wishbone = loadWishbone(value);

        const setupRuntime = createWishboneRuntime(wishbone);

        const wbio = this.chichiIO(wishbone);

        this.wishbone = wishbone;
        this.audio = wbio.audio;
        this.zone.runOutsideAngular(()=> {
          this.runtime = setupRuntime(wbio);
        });
      })();
  }
}

const loadWishbone = createWishboneFromCart();

const updateIO = (updaters: Array<(wishbone:Wishbone) => (io: WishboneIO) => WishboneIO>) => (wbio: WishboneIO) => (wishbone: Wishbone) =>  {
  const ioBuilders = updaters.map(fact => fact(wishbone));
  ioBuilders.forEach(builder => {
      wbio = builder(wbio)
  });
  return wbio;
}