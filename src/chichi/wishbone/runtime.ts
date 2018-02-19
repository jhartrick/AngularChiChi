export interface WishboneRuntime {
    teardown: () => Promise<{}>; 
    pause: (val: boolean) => void; 
    setFrameTime: (n: number) => void; 
}

interface runLoop  {
    paused: boolean; 
    interval: any;
    frameTime: number;
}


import { Wishbone, WishboneIO } from "./wishbone";

const runFrame = (wishbone: Wishbone) => (io: WishboneIO)  => () => {
    wishbone.padOne.ControlPad.padOneState = io.padOneState();
    wishbone.runframe();
    io.drawFrame();
}

const runInterval =  (runMe: () => void) => (loop: runLoop): runLoop => {
    
    clearInterval(loop.interval);
    const result = Object.assign({}, loop);

    result.interval = setInterval(p => {
        if (!loop.paused) { 
            runMe(); 
        }
    }, result.frameTime);

    return result;
};

const silence = (wb: Wishbone) => {
    wb.wavSharer.SharedBuffer.fill(0)
}

// returns options for running emulator
export const createWishboneRuntime = (wishbone: Wishbone) => (io: WishboneIO): WishboneRuntime => {

    let paused = false;
    let frameTime = 1000.0/60;
    const runMe = runFrame(wishbone)(io);

    const nesLoop = runInterval(runMe);
    let runloop = nesLoop({ paused: false, interval: undefined, frameTime });
    
    const pause = (val: boolean) => { 
        runloop.paused = val;
        runloop = nesLoop(runloop);
        if (runloop.paused ) silence(wishbone);
    }

    const setFrameTime = (time: number) => {
        runloop.frameTime = time;
        runloop = nesLoop(runloop);
    }

    function updateIO(proc: (io: WishboneIO) => WishboneIO) {
        io = proc(io);
    }

    const teardown = () => {
        return new Promise((resolve)=> {
            clearInterval(runloop.interval);
            resolve();
        })
    }

    return { pause, setFrameTime, teardown };
}
