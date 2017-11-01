describe('Post-Transformers index file', function() {
    // NOTE: This file would probably be better served tested using something like proxyquire, which
    // can mock out the fs call. 
    // That said, this is low risk, low cost, and simple to understand/maintain. So, it will do for now.
    var transformers;
    beforeEach(function() {
        transformers = require('./index')
    });

    it('Should load files ending in .js', function() {
        expect(typeof transformers['foreign_id']).toBe('function');
    });

    it('Should not load spec files', function() {
        expect(transformers['foreign_id_spec']).not.toBeDefined();
    });

});