import * as WB from './wishbone/wishbone';
import * as Pads from './wishbone/keyboard/wishbone.controlpad';
import { defaultBindings } from './wishbone/keyboard/wishbone.keybindings';

export interface ChiChiIO {
    // sets up keyboard handlers, 
    keydown: (f: (e: any) => void) => void;
    keyup: (f: (e: any) => void) => void;

    //takes a wishbone, an returns a new function to draw the current frame on that wishbone
    drawFrame:  () => void;
}


export const setupIO = (io: ChiChiIO) => {
    {
        const padOne: Pads.WishBoneControlPad = Pads.createControlPad(defaultBindings)('one');

        io.keydown((event) => Pads.handleKeyDownEvent(padOne, event));
        io.keyup((event) => Pads.handleKeyUpEvent(padOne, event));

        return (wishbone: WB.Wishbone) => {
            return WB.runAChichi(wishbone, io, padOne);
        }
    }
};