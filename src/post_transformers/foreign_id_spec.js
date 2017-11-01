describe('foreign id post-transformer', function() {
    var transformer, result, value, key, model, allModels;
    beforeEach(function() {
        value = "{{foreign_id(monkey)}}";
        key = 'doesntmatter';
        model = {
            "name": "pie",
            "monkeyId": "{{foreign_id(monkey)}}"
        };

        allModels = {
            "monkey": [
                {"id": 1},
                {"id": 2},
                {"id": 3},
                {"id": 4},
                {"id": 5}
            ],
            "banana": [
                model
            ]
        };

        spyOn(Math, 'random').and.returnValue(0.5);

        transformer = require('./foreign_id');
    });

    it('Supplies a random id when a model exists', function() {
        result = transformer(value, key, model, allModels);
        expect(result).toEqual(3);
    });

    it('Supplies lowest id at a minimum', function() {
        Math.random.and.returnValue(0.000001);
        result = transformer(value, key, model, allModels);
        expect(result).toEqual(1);
    });

    it('Supplies the last model at max random value', function() {
        Math.random.and.returnValue(0.999999);
        result = transformer(value, key, model, allModels);
        expect(result).toEqual(5);
    });

    it('Supplies -1 if a model does not exist', function() {
        result = transformer('{{foreign_id(elephant)}}', key, model, allModels);
        expect(result).toEqual(-1);
    });
});