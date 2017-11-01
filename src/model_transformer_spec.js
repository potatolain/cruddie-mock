var proxyquire = require('proxyquire'),
    util = require('./util');
describe('model transformer', function() {
    describe('transformModel method', function() {

        var model, objectTransformers, transformedModel, transformer, faker;
        beforeEach(function() {
            model = {
                "name": "{{my.name}}",
                "number": "{{my.number}}",
                "id": "{{id}}",
                "first": "{{my.name}} is sk... barney?",
                "mid": "my name is {{my.name}}, right?",
                "last": "Yeah, my name is {{my.name}}",
                "multi": "My name is {{my.name}}... wait no its {{my.name}}!",
                "sentence": "This is a dog. He is good.",
                "unsupported": "This sentence just likes {{mustache}} syntax {{a.lot}}.",
                "sub": {
                    "name": "{{my.name}}",
                    "number": "{{my.number}}"
                },
                "array": ['{{my.name}}', '{{my.number}}']
            };
            faker = {
                my: {
                    name: jasmine.createSpy('name').and.returnValue('barney'),
                    number: jasmine.createSpy('number').and.returnValue(32)
                }
            },
            objectTransformers = {
                "id": jasmine.createSpy('id').and.returnValue(54)
            };
            transformer = proxyquire('./model_transformer', {
                'faker': faker,
                './transformers': objectTransformers
            });
        });

        it('Does not touch original object', function() {
            var existingModel = util.deepCopy(model);
            transformedModel = transformer.transformModel('puppies', model);
            expect(existingModel).toEqual(model);
        });

        it('Adds an id field if one does not already exist', function() {
            delete model.id;
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.id).toBeDefined();
        });

        it('Does not mangle normal strings', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.sentence).toEqual(model.sentence);
        });

        it('Leaves unsupported mustache syntax alone', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.unsupported).toEqual(model.unsupported);
        });

        it('Transforms a string containing a single mustache object', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.name).toEqual('barney');
        });

        it('Retains the type of single built-in mustache objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.id).toEqual(54);
            expect(typeof transformedModel.id).toEqual('number');
        });

        it('Passes the correct data to the transformer for built-in mustache objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(objectTransformers.id).toHaveBeenCalledWith('puppies', 'id', '{{id}}', jasmine.any(Object));
        });

        it('Supports replacing faker-styled variables.', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(faker.my.name).toHaveBeenCalled();
            expect(transformedModel.name).toEqual('barney');
        });


        it('Retains the type of single faker-based mustache objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.number).toEqual(32);
            expect(typeof transformedModel.number).toBe('number');
        });

        it('Replaces mustache variables at the beginning of a string', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.first).toEqual('barney is sk... barney?');
        });

        it('Replaces mustache variables at the end of a string', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.last).toEqual('Yeah, my name is barney');
        });

        it('Replaces mustache variables in the middle of the string', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.mid).toEqual('my name is barney, right?');
        });

        it('Replaces multiple of the same mustache variables with different values', function() {
            var hasCalled = false;
            faker.my.name.and.callFake(function() {
                hasCalled = !hasCalled;
                if (hasCalled)
                    return 'meglodon';
                return 'barney';
            });
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.multi).toEqual('My name is meglodon... wait no its barney!');

        });

        it('Replaces mustache syntax in sub-objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.sub.name).toEqual('barney');            
        });

        it('Retains the type of mustache variables in sub-objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(typeof transformedModel.sub.number).toEqual('number');            
        });

        it('Replaces mustache syntax in arrays', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(transformedModel.array[0]).toEqual('barney');            
        });

        it('Retains the type of mustache variables in sub-objects', function() {
            transformedModel = transformer.transformModel('puppies', model);
            expect(typeof transformedModel.array[1]).toEqual('number');            
        });
    })
});