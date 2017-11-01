describe('id transformer', function() {

    var transformer = require('./id'),
        model;
    beforeEach(function() {
        model = {
            id: '{{id}}'
        };
    });

    it('Should respond with a numeric id.', function() {
        expect(typeof transformer('puppy', 'id', "{{id}}", model)).toBe('number');
    });
    it('Should not return the same id twice for the same model', function() {
        var id1 = transformer('puppy', 'id', "{{id}}", model),
            id2 = transformer('puppy', 'id', "{{id}}", model);
        expect(id1).not.toEqual(id2);
    });
});