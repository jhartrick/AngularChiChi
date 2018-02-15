import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, NgZone, Input, Output, EventEmitter } from '@angular/core';
import * as THREE from 'three';
import * as WB from '../wishbone/wishbone';
import { drawFrameWebGL } from '../threejs/threejs.drawframe';
import { setupIO } from '../chichi.io';
import { defaultBindings } from '../wishbone/keyboard/wishbone.keybindings';
import { BaseCart, WavSharer, PixelBuffers } from 'chichi';
import { ThreeJSAudioSettings, chichiPlayer } from '../threejs/audio.threejs';
import { WishboneRuntime, Wishbone } from '../wishbone/wishbone';

@Component({
    selector: 'chichi-viewer',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css']
})
export class ChiChiComponent implements AfterViewInit {
    chichiDrawer: (wishbone: WB.Wishbone) => () => void;
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') chichiPig: ElementRef;
    @ViewChild('chichiCanvas') canvasRef: ElementRef;

    @Input('wishbone')
    set wishbone(wishbone: Wishbone) {
        if (wishbone === undefined) {
            return;
        }
                // set up a raw format pixel buffer and have wishbone set it
        wishbone.setPixelBuffer(PixelBuffers.createRawPixelBuffer((new ArrayBuffer(256 * 256 * 4))));
        // set up the drawframe method
        wishbone.io.drawFrame = this.chichiDrawer(wishbone);
    
    };

    private renderer: THREE.WebGLRenderer;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    constructor(private zone: NgZone) {
    }

    ngAfterViewInit(): void {

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
        
        // this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
        // create function to render nes video
        this.chichiDrawer = drawFrameWebGL(this.renderer);
        
        // setTimeout(() => {
        //     this.onResize();
        // }, 1);
    }

    // @HostListener('window:resize', ['$event'])
    // onResize(event?: any) {
    //     const ccElem = this.chichiHolder.nativeElement;
    //     const canvElem = this.canvasRef.nativeElement;
    //     if (canvElem.offsetHeight < canvElem.offsetWidth) {
    //         this.renderer.setSize(canvElem.offsetHeight * 4 / 3, canvElem.offsetHeight);
    //         this.canvasLeft = ((ccElem.offsetWidth - (canvElem.offsetHeight * 4 / 3)) / 2) + 'px';
    //         this.canvasTop = '0px';
    //     } else {
    //         this.renderer.setSize(canvElem.offsetWidth, canvElem.offsetWidth * 3 / 4);
    //         this.canvasLeft = '0px';
    //         this.canvasTop = ((ccElem.offsetWidth - (canvElem.offsetWidth * 3 / 4)) / 2) + 'px';
    //     }
    //     // console.log("Width: " + event.target.innerWidth);
    // }

}

