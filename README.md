# ChiChiNg 

I suppose you could import { ChiChiModule } into your Enterprise Angular Application and then use it like so:

<chichi-viewer [wishbone]='wishbone'></chichi-viewer>

Or maybe this if you dont trust webgl:

<chichi-canvasviewer [wishbone]='wishbone'></chichi-canvasviewer>

In either case you would need a wishbone.  That's easily accomplished.

          const wishbone = createWishboneFromCart(cart);

Look to app.component.ts for more information.
