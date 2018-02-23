import * as FILES from './filehandler';

// TODO: fix this dataurl to be a valid file, not just a header - create a .zip version
const testFile = 'data:;base64,TkVTGggAEQAAAE5JIDEuM6UfyRWwIaUSKRDwFqAAhNE=';

// tslint:disable-next-line:max-line-length
const customMatchers: any = {
  toBeAPromise: function (util, customEqualityTesters) {
    return function (actual, expected) {
      return {
          pass: actual instanceof Promise,
          message: actual instanceof Promise ? 'passed' : 'Expected a Promise'
      };
    };
  }
};

describe('loadCartFromUrl', () => {
    beforeEach(function() {
        jasmine.addMatchers(customMatchers);
    });

    it('should return a promise', () => {
      const result = FILES.loadCartFromUrl(testFile);
      expect(result);
    });

    it('should return a basecart', () => {
      const result = FILES.loadCartFromUrl(testFile);
      result.then(cart => {

        expect(cart).toBeTruthy();
        // just a high order test to see if this is ac art, more explicit testing of decoding file belongs elsewhere
        expect(cart.mapperId).toBe(1);
      });
    });

    it('should throw error on noexistent file', () => {
      const result = FILES.loadCartFromUrl('');
      result.then().catch(reason => {
        console.log('reason: ' + reason);
        expect(reason).toThrowError();
      });
  });

});

describe('loadCartFromFile', () => {
  beforeEach(function() {
      jasmine.addMatchers(customMatchers);
  });

  const file = new File(['hello i am a file'], 'testfile.txt');

  it('should return a promise', () => {
    const result = FILES.loadCartFromFile(file);
    expect(result);
  });

  it('should throw error on noexistent file', () => {
    const result = FILES.loadCartFromFile(undefined);

    expect(result.then).toThrowError();
  });

  it('should throw error on invalid file', () => {
    const result = FILES.loadCartFromFile(file);

    expect(result.then).toThrowError();
  });


});
