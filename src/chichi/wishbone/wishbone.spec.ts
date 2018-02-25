import { createWishboneFromCart } from "./wishbone";

describe('createWishboneFromCart', () => {

    it('should create a factory function', () => {
      const result = createWishboneFromCart();
      expect(result).toBeDefined();
    });


    it('should return a wishbone when factory function called with null cart', () => {
      const result = createWishboneFromCart();

      expect(result).toBeDefined();

      const bone = result(null);
      expect(bone).toEqual(jasmine.any(Object));
            
    });

});