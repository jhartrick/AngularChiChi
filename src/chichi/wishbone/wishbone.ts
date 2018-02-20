import { ChiChiMachine, BaseCart, WavSharer, ChiChiInputHandler, PixelBuffer, ChiChiPPU } from "chichi";
import { WishBoneControlPad } from "./keyboard/wishbone.controlpad";
import { ChiChiCPPU } from "chichi";
import { WishboneRuntime } from "./runtime";
import { LocalAudioSettings } from "../threejs/audio.localsettings";



// this interface is used for the emulator to poll/push data to the outside world
export interface WishboneIO {
    // polls current state of controller ports
    padOneState: () => number;
    padTwoState: () => number;

    // when called, should draw the current frame
    drawFrame:  () => void;
    audio: LocalAudioSettings
}

export interface Wishbone
{
    wavSharer: WavSharer;
    padOne: ChiChiInputHandler;
    padTwo: ChiChiInputHandler;

    chichi?: ChiChiMachine;
    cart?: BaseCart;
    runtime?: WishboneRuntime;

    poweron: () => void;
    poweroff: () => void;
    reset: () => void;

    runframe: () => void;

    // TODO: implement this better
    getPixelBuffer: ()=> PixelBuffer;
    setPixelBuffer: (buffer: any) => void;

}

export const createWishboneFromCart = () => {
    const chichi = new ChiChiMachine();

    const setPixelBuffer = (ppu: ChiChiPPU) => (buffer: any) => {
        ppu.pixelBuffer = buffer;
    }
    const getPixelBuffer = (ppu: ChiChiPPU) => (): PixelBuffer => ppu.pixelBuffer;
    const result: Wishbone = {
        chichi: chichi,
        wavSharer: chichi.SoundBopper.writer,
        getPixelBuffer: getPixelBuffer(chichi.Cpu.ppu),
        setPixelBuffer: setPixelBuffer(chichi.Cpu.ppu),
        padOne:  chichi.Cpu.PadOne,
        padTwo:  chichi.Cpu.PadOne,
        poweron:  chichi.PowerOn.bind(chichi),
        poweroff:  chichi.PowerOff.bind(chichi),
        reset:  chichi.Reset.bind(chichi),
        runframe:  chichi.RunFrame.bind(chichi),
    }
    return (cart: BaseCart) => {
        chichi.PowerOff();
        chichi.loadCart(cart);
        chichi.PowerOn();
        return result;
    
    }

}

