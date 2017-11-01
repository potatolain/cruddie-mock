describe('util.js utilities', function() {
    describe('deepCopy', function() {
        var util = require('./util'),
            exampleObject;

        beforeEach(function() {
            exampleObject = {
                hello: 'world', 
                zebra: 45, 
                horses: 42.444,
                nestedStuff: {
                    cat: 'kitten',
                    dog: 'puppy',
                    nestingDoll: {
                        furtherNested: true
                    }
                }
            }
        });

        it('Should provide an object that is functionally identical', function() {
            var dupe = util.deepCopy(exampleObject);
            expect(dupe).toEqual(exampleObject);
            expect(dupe.nestedStuff.cat).toEqual('kitten');
            expect(dupe.nestedStuff.nestingDoll.furtherNested).toEqual(true);
        });

        it('Should provide an object with no links to the original object', function() {
            var dupe = util.deepCopy(exampleObject);
            dupe.nestedStuff.cat = 'an apathetic dog with whiskers';
            dupe.nestedStuff.nestingDoll.furtherNested = 'my cat is a good cat. Kitty!';
            expect(exampleObject.nestedStuff.cat).toEqual('kitten');
            expect(exampleObject.nestedStuff.nestingDoll.furtherNested).toEqual(true);
        });
    });
});