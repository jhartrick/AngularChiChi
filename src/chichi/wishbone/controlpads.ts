import * as Pads from '../wishbone/keyboard/wishbone.controlpad';
import { defaultBindings } from '../wishbone/keyboard/wishbone.keybindings';
import { WishboneIO, Wishbone } from './wishbone';

export interface KeyboardHandlingComponent {
    onkeydown(event: any): void;
    onkeyup(event: any): void;
  }
  
  
const setupKeyboards = (comp: KeyboardHandlingComponent) => (wishbone?: Wishbone) => {
    // higher order function creates keyboard event handlers and binds them to angular component
    const padOne: Pads.WishBoneControlPad = Pads.createControlPad(defaultBindings)('one');
    // TODO: setup some default player two bindings
    // const padTwo: Pads.WishBoneControlPad = Pads.createControlPad(defaultBindings)('two');

    comp.onkeydown = (event) => Pads.handleKeyDownEvent(padOne, event);
    comp.onkeyup = (event) => Pads.handleKeyUpEvent(padOne, event);

    // Then returns a function which can attach polling functions to a ChiChiIO object
    return (io: WishboneIO) => {
        const newIo = Object.assign({}, io);
        newIo.padOneState = () => padOne.padOneState;
        newIo.padTwoState = () => 0;
        return Object.freeze(newIo);
    }
};

export const WishboneControlPads = {
    setupKeyboards
}