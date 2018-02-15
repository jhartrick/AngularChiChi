import { Component, ChangeDetectionStrategy } from '@angular/core';
import {  loadCartFromUrl, loadCartFromFile } from '../chichi/wishbone/filehandler';
import { BaseCart, WavSharer } from 'chichi';
import { createWishboneFromCart, WishboneRuntime } from '../chichi/wishbone/wishbone';
import { setupIO } from '../chichi/chichi.io';
import { chichiPlayer, ThreeJSAudioSettings } from '../chichi/threejs/audio.threejs';
import * as THREE from 'three';
import { DialogService } from './dialog.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    host: {
        '(document:keydown)': 'onkeydown($event)',
        '(document:keyup)': 'onkeyup($event)'
    }
})
export class AppComponent {
  audio: ThreeJSAudioSettings;
  chichiPlayer: (wavForms: WavSharer) => ThreeJSAudioSettings;
  
  runtime: WishboneRuntime;
  wishbone: any;
  paused: boolean = false;
  cart: BaseCart;
  title = 'app';
  url='assets/metroid.nes';
  muted = false;

  constructor(private dialogService: DialogService) {
    const listener = new THREE.AudioListener();
    // create function to play nes audio
    this.chichiPlayer  = chichiPlayer(listener);

  }
  mute (value: boolean) {
    if (value) {
      this.audio.mute();
    } else {
      this.audio.unmute();
    }
  }

  pause(value: boolean) {
    if (this.runtime) {
        this.runtime.pause(value);
    }
  }
  onkeydown(event) {
  }

  onkeyup(event) {
  }


  load() {
    loadCartFromUrl(this.url).then(cart => this.cart = cart);
  }

  loadfile(e: Event) {
    (async ()=> {
      const cart = await loadCartFromFile((<HTMLInputElement>e.target).files[0]);
      await this.runCart(cart);
      this.cart = cart;
    })();
  }

  private runCart(value: BaseCart) {

        return (async()=>{
          if (this.runtime) {
            await this.runtime.teardown();
          }
          const wishbone = createWishboneFromCart(value);
          this.audio = this.chichiPlayer(wishbone.wavSharer);
          wishbone.io = {
              keydown: (val: (e: any) => void) => this.onkeydown = val,
              keyup: (val: (e: any) => void) => this.onkeyup = val,
              drawFrame: undefined
          };
          const runchi = setupIO(wishbone.io);
          this.wishbone = wishbone;
          wishbone.cart = value;
          this.runtime = runchi(wishbone);

          this.runtime.setFrameTime(1000/60);
        })();
    }

}
