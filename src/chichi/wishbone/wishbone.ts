import { ChiChiMachine, BaseCart, WavSharer, ChiChiInputHandler, PixelBuffer, ChiChiPPU } from "chichi";
import { ChiChiIO } from "../chichi.io";
import { WishBoneControlPad } from "./keyboard/wishbone.controlpad";
import { ChiChiCPPU } from "chichi";


export interface WishboneRuntime {
    teardown: () => Promise<void>; 
    pause: (val: boolean) => void; 
    setFrameTime: (n: number) => void; 
    wishbone: Wishbone;
}

export interface Wishbone
{
    wavSharer: WavSharer;
    padOne: ChiChiInputHandler;
    padTwo: ChiChiInputHandler;

    io: ChiChiIO;
    chichi?: ChiChiMachine;
    cart?: BaseCart;
    runtime?: WishboneRuntime;

    poweron: () => void;
    poweroff: () => void;
    reset: () => void;
    runframe: () => void;
    setpads: () => void;

    getPixelBuffer: ()=> PixelBuffer;
    setPixelBuffer: (buffer: any) => void;

}

const createWishboneLoader = (cart: BaseCart) => {
    const chichi = new ChiChiMachine();

    const setPixelBuffer = (ppu: ChiChiPPU) => (buffer: any) => {
        ppu.pixelBuffer = buffer;
    }
    const getPixelBuffer = (ppu: ChiChiPPU) => (): PixelBuffer => ppu.pixelBuffer;

    const result: Wishbone = {
        chichi: chichi,
        cart: cart,
        wavSharer: chichi.SoundBopper.writer,
        getPixelBuffer: getPixelBuffer(chichi.Cpu.ppu),
        setPixelBuffer: setPixelBuffer(chichi.Cpu.ppu),
        padOne:  chichi.Cpu.PadOne,
        padTwo:  chichi.Cpu.PadOne,
        poweron:  chichi.PowerOn.bind(chichi),
        poweroff:  chichi.PowerOff.bind(chichi),
        reset:  chichi.Reset.bind(chichi),
        runframe:  chichi.RunFrame.bind(chichi),
        setpads: () => undefined,
        io: undefined
    }
    chichi.loadCart(cart);
    chichi.PowerOn();
    return result;
}

const updatePadState = (dest: any, src: any) => () => dest.padOneState = src.padOneState;

export const createWishboneFromCart = (cart: BaseCart) => {
    const wishbone = createWishboneLoader(cart);
    wishbone.cart = cart;
    wishbone.poweron();
    return wishbone;
};

// returns options for running emulator
export const runAChichi = (wishbone: Wishbone, io: ChiChiIO, padOne: WishBoneControlPad): WishboneRuntime => {


    wishbone.setpads = updatePadState(wishbone.padOne.ControlPad, padOne);
    let paused = false;
    let frameTime = 1000.0/60;
    const run = () => {        
        wishbone.setpads();
        wishbone.runframe();
        io.drawFrame();
    }
    let interval;

    const runInterval = () => {
        interval = setInterval(p => {
            if (!paused) { 
                run(); 
            }
        }, frameTime);
    };
    runInterval();

    const teardown =  (): Promise<void> => {
        clearInterval(interval);
        return (async function() {
            setTimeout(()=> {
                wishbone.setpads = null,
                wishbone.wavSharer = null,
                wishbone.poweroff();
            }, 60);
        }())
    }

    const pause = (val: boolean) => { 
        paused = val;
        if (paused) {
            wishbone.wavSharer.SharedBuffer.fill(0)
        }
    }

    const setFrameTime = (time: number) => {
        
        clearInterval(interval);
        frameTime = time;
        runInterval();
    }
    wishbone.runtime = { teardown, pause, wishbone, setFrameTime };
    return { teardown, pause, wishbone, setFrameTime };
}