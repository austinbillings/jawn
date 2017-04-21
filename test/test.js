const assert = require('assert');
const jawn = require('../dist/jawn.js');

describe('jawn', () => {
  describe('#parseQuery()', () => {
    it ('should split a query string into parts', () => {
      let query = jawn.parseQuery('?test=ok&bool=true&numeric=14.41&integer=55&unknown=&blank');
      let expected = {
        test: 'ok',
        bool: true,
        numeric: 14.41,
        integer: 55,
        unknown: null,
        blank: null
      };
      assert.deepEqual(query, expected);
    });
    
    it ('should work with a single equals assignment', () => {
      let query = jawn.parseQuery('test=ok');
      let expected = { test: 'ok' };
      assert.deepEqual(query, expected);
    });
    
    it ('should return an empty object when given nothing', () => {
      assert.deepEqual(jawn.parseQuery(), {});
      assert.deepEqual(jawn.parseQuery(''), {});
    })
  });
  describe('#pathify()', () => {
    it ('should split up a path how you\'d expect', () => {
      let path = jawn.pathify('/test/ok/third/whatever/myFile.jpg');
      let expected = ['test', 'ok', 'third', 'whatever', 'myFile.jpg'];
      assert.deepEqual(path, expected);
    });
    
    it ('should handle double/triple slashes by throwing them out', () => {
      let path = jawn.pathify('c://test/whatever/example///ok/whatever');
      let expected = ['c:', 'test', 'whatever', 'example', 'ok', 'whatever'];
      assert.deepEqual(path, expected);
    });
    
    it ('should work just as well with other path separators (\\)', () => {
      let path = jawn.pathify('C:\\Windows\\System32\\Caches', '\\');
      let expected = ['C:', 'Windows', 'System32', 'Caches'];
      assert.deepEqual(path, expected);
    });
    
    it ('should throw out leading/trailing slashes', () => {
      let path = jawn.pathify(' /test/whatever/ ');
      let expected = ['test', 'whatever'];
      assert.deepEqual(path, expected);
    })
  });
  describe('#filenameFromPath()', () => {
    it ('should extract a filename', () => {
      let path = jawn.filenameFromPath('assets/photos/example.jpg');
      let expected = 'example.jpg';
      assert.equal(path, expected);
    });
    
    it ('should extract even when no heirarchy exists', () => {
      let path = jawn.filenameFromPath('example.jpg');
      let expected = 'example.jpg';
      assert.equal(path, expected);
    });
    
    it ('should return null when it gets an empty string or nothing', () => {
      assert.equal(jawn.filenameFromPath(), null);
      assert.equal(jawn.filenameFromPath(''), null);
    });
    
    it ('should return null when FORCE & it doesn\'t look like a filename', () => {
      let path = jawn.filenameFromPath('lol/ok/whatever', true);
      let expected = null;
      assert.equal(path, expected);
    });
    
    it ('should work the same way when using a different path separator', () => {
      let path = jawn.filenameFromPath('\\omg\\whatever\\dude.png', null, '\\');
      let expected = 'dude.png';
      assert.equal(path, expected);
    })
  })
  describe('#pathWithoutFilename()', () => {
    it ('should return a path without a filename', () => {
      let path = jawn.pathWithoutFilename('/folder/dir/thing/example.jpg');
      let expected = '/folder/dir/thing/';
      assert.equal(path, expected);
    });
    
    it ('should not return a leading slash if one not given', () => {
      let path = jawn.pathWithoutFilename('test/myFile.png');
      let expected = 'test/';
      assert.equal(path, expected);
    });
    
    it ('should return whole path when FORCE & not a filename', () => {
      let path = jawn.pathWithoutFilename('/myDir/example/testing', true);
      let expected = '/myDir/example/testing';
      assert.equal(path, expected);
    });
    
    it ('should work when provided an alternate separator', () => {
      let path = jawn.pathWithoutFilename('\\dir\\subdir\\sub\\file', false, '\\');
      let expected = '\\dir\\subdir\\sub\\';
      assert.equal(path, expected);
    });
  });
  describe('#getFileExtension()', () => {
    it ('should return a file\'s extension', () => {
      let path = jawn.getFileExtension('/dir/sub/file.jpg');
      let expected = 'jpg';
      assert.equal(path, expected);
    });
    
    it ('should return the given path when not a filename and !FORCE', () => {
      let path = jawn.getFileExtension('/dir/sub/whatever', false);
      let expected = '/dir/sub/whatever';
      assert.equal(path, expected);
    });
    
    it ('should return null when not a filename and FORCE', () => {
      let path = jawn.getFileExtension('/dir/sub/whatever', true);
      let expected = null;
      assert.equal(path, expected);
    });
    
    it ('should only return the last part of the file\'s extension', () => {
      let path = jawn.getFileExtension('test/example.tar.gz');
      let expected = 'gz';
      assert.equal(path, expected);
    });
  });
  describe('#isMap()', () => {
    it ('should recognize populated and empty map-style objects', () => {
      let A = jawn.isMap({});
      let B = jawn.isMap({ myProp: true });
      assert.equal(A, true);
      assert.equal(B, true);
    });
    
    it ('should reject regular and empty arrays', () => {
      let A = jawn.isMap([]);
      let B = jawn.isMap([1, 2, 3]);
      assert.equal(A, false);
      assert.equal(B, false);
    });
    
    it ('should reject functions as maps', () => {
      let A = function () { return true; };
      function B (myArgs) { return true; };
      assert.equal(jawn.isMap(A), false);
      assert.equal(jawn.isMap(B), false);
    });
    
    it ('should reject various primitives', () => {
      let A = 42;
      let B = 'Hello';
      let C = null;
      let D;
      assert.equal(jawn.isMap(A), false);
      assert.equal(jawn.isMap(B), false);
      assert.equal(jawn.isMap(C), false);
      assert.equal(jawn.isMap(D), false);
    });
  });
  describe('#clone()', () => {
    it ('should simply copy primitives', () => {
      assert.equal(jawn.clone(42), 42);
      assert.equal(jawn.clone('HELLO'), 'HELLO');
      assert.equal(jawn.clone(), undefined);
      assert.equal(jawn.clone(null), null);
    });
    
    it ('should clone arrays, not reference them (notEqual + deepEqual)', () => {
      let expected = ['a', 41, 'LOL', null, true, 'whatever']
      let cloned = jawn.clone(expected);
      assert.notEqual(cloned, expected);
      assert.deepEqual(cloned, expected);
    });
    
    it ('should clone objects, not reference them (notEqual + deepEqual)', () => {
      let expected = { prop: 'lol', vasudeva: 'rules', awesome: true, myVal: null, other: 400 };
      let cloned = jawn.clone(expected);
      assert.notEqual(cloned, expected);
      assert.deepEqual(cloned, expected);
    });
    
    it ('should also work for deep nested sub-objects', () => {
      let expected = { first: { second: { third: { fourth: [ 'surprise', 'array' ] } } } };
      let cloned = jawn.clone(expected);
      assert.notEqual(cloned, expected);
      assert.deepEqual(cloned, expected);
      assert.notEqual(cloned.first, expected.first);
      assert.deepEqual(cloned.first, expected.first);
      assert.notEqual(cloned.first.second, expected.first.second);
      assert.deepEqual(cloned.first.second, expected.first.second);
      assert.notEqual(cloned.first.second.third, expected.first.second.third);
      assert.deepEqual(cloned.first.second.third, expected.first.second.third);
      assert.notEqual(cloned.first.second.third.fourth, expected.first.second.third.fourth);
      assert.deepEqual(cloned.first.second.third.fourth, expected.first.second.third.fourth);
    });
  });
  describe('#merge() / #coat()', () => {
    it ('should reject primitive input as null', () => {
      assert.equal(jawn.merge('test', 'other'), null);
      assert.equal(jawn.coat('test', 'other'), null);
      assert.equal(jawn.merge(0, 44), null);
      assert.equal(jawn.coat(0, 44), null);
      assert.equal(jawn.merge(true, false), null);
      assert.equal(jawn.coat(true, false), null);
      assert.equal(jawn.merge({ okay: true }, null), null);
      assert.equal(jawn.coat({ okay: true }, null), null);
    });
    
    it ('should reject arrays as null', () => {
      assert.equal(jawn.merge([1,2,3], [4,5,6]), null);
      assert.equal(jawn.coat([1,2,3], [4,5,6]), null);
      assert.equal(jawn.merge([], []), null);
      assert.equal(jawn.coat([], []), null);
    });
    
    it ('should merge simple objects (notEqual && deepEqual)', () => {
      let objectA = { id: '402014m', name: 'Eric Weiss', age: 33, accidental: true };
      let objectB = { age: 16, wearsAHat: true };
      let merged = jawn.merge(objectA, objectB);
      let coated = jawn.coat(objectA, objectB);
      let expected = { id: '402014m', name: 'Eric Weiss', age: 16, accidental: true, wearsAHat: true };
      assert.notEqual(merged, expected);
      assert.notEqual(coated, expected);
      assert.deepEqual(merged, expected);
      assert.deepEqual(coated, expected);
    });
    let first = {
      sub: { classy: true,
        another: { okay: null,
          whatever: {
            deeper: {
              inside: [1,2,3]
            },
            notDeeper: {
              orIsIt: true
            }
          }
        }
      }
    };
    let second = {
      sub: { weird: true,
        another: { okay: 'YES',
          whatever: {
            deeper: {
              inside: [4,5,6]
            },
            notDeeper: 'lol'
          }
        }
      }
    };
    let third = {
      sub: { another: { whatever: { deeper: { inside: ['MAGIC'] } } }, sick: true }
    };
    
    it ('should merge complex objects (notEqual && deepEqual)', () => {
      
      let merged = jawn.merge(first, second);
      let coated = jawn.coat(first, second);
      let expectedMerger = {
        sub: { classy: true, weird: true, 
          another: { okay: 'YES', 
            whatever: { 
              deeper: { 
                inside: [1,2,3,4,5,6]
              },
              notDeeper: 'lol'
            }
          }
        }
      };
      let expectedCoating = {
        sub: { classy: true, weird: true,
          another: { okay: 'YES',
            whatever: {
              deeper: {
                inside: [4,5,6]
              },
              notDeeper: 'lol'
            }
          }
        }
      };
      
      assert.notEqual(merged, expectedMerger);
      assert.deepEqual(merged, expectedMerger);
      
      assert.notEqual(coated, expectedCoating);
      assert.deepEqual(coated, expectedCoating);
    });
    
    it ('should merge 3+ objects the same way', () => {
      let merged = jawn.merge(first, second, third);
      let coated = jawn.coat(first, second, third);
      let expectedMerger = {
        sub: { classy: true, weird: true, 
          another: { okay: 'YES', 
            whatever: { 
              deeper: { 
                inside: [1,2,3,4,5,6,'MAGIC']
              },
              notDeeper: 'lol'
            }
          },
          sick: true
        }
      };
      let expectedCoating = {
        sub: { classy: true, weird: true, 
          another: { okay: 'YES', 
            whatever: { 
              deeper: { 
                inside: ['MAGIC']
              },
              notDeeper: 'lol'
            }
          },
          sick: true
        }
      };
      assert.notEqual(merged, expectedMerger);
      assert.deepEqual(merged, expectedMerger);
      assert.notEqual(coated, expectedCoating);
      assert.deepEqual(coated, expectedCoating);
    });
  });
  
});