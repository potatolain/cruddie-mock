var proxyquire = require('proxyquire'),
    util = require('./util');
describe('model post-transformer', function() {
    describe('postTransformModel method', function() {

        var model, objectTransformers, transformedModel, transformer, allModels;
        beforeEach(function() {
            model = {
                "unsupported": "{{my.name}}",
                "otherThing": "{{dance(fish)}}",
                "array": ["{{dance(fish)}}"],
                "obj": {
                    "sub": "{{dance(fish)}}"
                }
            };

            allModels = {
                "model": [model],
                "other": [{"id": 1}, {"id": 2}]
            };
            
            objectTransformers = {
                "dance": jasmine.createSpy('id').and.returnValue(54)
            };
            transformer = proxyquire('./model_post_transformer', {
                './post_transformers': objectTransformers
            });
        });

        it('Does not touch original object', function() {
            var existingModel = util.deepCopy(model);
            transformedModel = transformer.postTransformModel('puppies', model, allModels);
            expect(existingModel).toEqual(model);
        });

        it('Does not mangle normal strings', function() {
            transformedModel = transformer.postTransformModel('puppies', model, allModels);
            expect(transformedModel.sentence).toEqual(model.sentence);
        });

        it('Leaves unsupported mustache syntax alone', function() {
            transformedModel = transformer.postTransformModel('puppies', model, allModels);
            expect(transformedModel.unsupported).toEqual(model.unsupported);
        });

        it('Transforms a string containing a single mustache object', function() {
            transformedModel = transformer.postTransformModel('puppies', model);
            expect(transformedModel.otherThing).toEqual(54);
        });

        it('Retains the type of the mustache object', function() {
            transformedModel = transformer.postTransformModel('puppies', model, allModels);
            expect(typeof transformedModel.otherThing).toBe('number');
        });

        it('Passes the correct data to the transformer', function() {
            transformedModel = transformer.postTransformModel('puppies', model, allModels);
            expect(objectTransformers.dance).toHaveBeenCalledWith('{{dance(fish)}}', 'otherThing', jasmine.any(Object), allModels);
        });

        it('Transforms objects in arrays', function() {
            transformedModel = transformer.postTransformModel('puppies', model);
            expect(transformedModel.array[0]).toEqual(54);
        });
        it('Transforms objects in other objects', function() {
            transformedModel = transformer.postTransformModel('puppies', model);
            expect(transformedModel.obj.sub).toEqual(54);
        });

    });
});