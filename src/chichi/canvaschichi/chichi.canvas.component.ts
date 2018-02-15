import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, NgZone, Input } from '@angular/core';
import * as THREE from 'three';
import * as WB from '../wishbone/wishbone';
import { setupIO } from '../chichi.io';
import { defaultBindings } from '../wishbone/keyboard/wishbone.keybindings';
import { BaseCart, WavSharer, PixelBuffers } from 'chichi';
import { ThreeJSAudioSettings, chichiPlayer } from '../threejs/audio.threejs';
import { WishboneRuntime } from '../wishbone/wishbone';

@Component({
    selector: 'chichi-canvasviewer',
    templateUrl: './chichi.canvas.component.html',
    styleUrls: ['./chichi.canvas.component.css'],
    host: {
        '(document:keydown)': 'onkeydown($event)',
        '(document:keyup)': 'onkeyup($event)'
    }
})
export class ChiChiCanvasComponent implements AfterViewInit {
    wishboneRuntime: WishboneRuntime;

    chichiDrawer: (wishbone: WB.Wishbone) => () => void;
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') chichiPig: ElementRef;
    @ViewChild('chichiCanvas') canvasRef: ElementRef;

    @Input('wishbone')
    set wishbone(wishbone: WB.Wishbone) {
        if (wishbone === undefined) {
            return;
        }
            // set up the drawframe method
        wishbone.io.drawFrame = this.chichiDrawer(wishbone);
    };

    constructor(private zone: NgZone) {
    }

   
    private setupScene(): void {


        // create function to render nes video
        this.chichiDrawer = drawFrameCanvas(this.canvasRef.nativeElement.getContext('2d'));
    }

    ngAfterViewInit(): void {
        this.setupScene();
    }

}

const drawFrameCanvas = (canvasCtx: CanvasRenderingContext2D) => (wishbone: WB.Wishbone): () => void =>  {
    const dataBuf = new Uint8ClampedArray(wishbone.getPixelBuffer().buffer);
    const data = canvasCtx.createImageData(256, 266);

    return  () => {
        requestAnimationFrame(()=>{
            data.data.set(dataBuf);
            canvasCtx.putImageData(data,0,0);
        })
    };
};
