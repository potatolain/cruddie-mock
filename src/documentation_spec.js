describe('documentation', function() {
    describe('generateSwaggerData', function() {
        var docs, models, config, result;
        beforeEach(function() {
            docs = require('./documentation');
            models = {
                "dog": {"type": "dog", "age": 25},
                "cat": {"type": "cat", "age": 3}
            };
            config = {};
        });

        it('Should result in an object with basic OpenAPI data', function() {
            result = docs.generateSwaggerData(models, config);
            expect(result.swagger).toEqual('2.0');

        });

        it('Should include all methods by default', function() {
            result = docs.generateSwaggerData(models, config);
            expect(result.paths['/dog'].get).toBeDefined();
            expect(result.paths['/cat'].get).toBeDefined();
            expect(result.paths['/dog'].post).toBeDefined();
        });

        it('Should register model data for all modules too', function() {
            result = docs.generateSwaggerData(models, config);
            expect(result.definitions['cat'].properties.type).toEqual('string');
            expect(result.definitions['dog'].properties.age).toEqual('number');
        });

        it('Should only register get routes if readonly mode is active', function() {
            config.readOnly = true;
            result = docs.generateSwaggerData(models, config);
            expect(result.paths['/dog'].get).toBeDefined();
            expect(result.paths['/cat'].get).toBeDefined();
            expect(result.paths['/dog'].post).not.toBeDefined();
        });
    }); 
});