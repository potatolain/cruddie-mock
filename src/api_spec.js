// Don't allow callthru, as we use require programmatically to load json files, and we want to mock those out.
var proxyquire = require('proxyquire').noCallThru();

describe('api', function() {
    var api, modelTransformer, modelPostTransformer, fs, path, directory, files, options;
    beforeEach(function() {
        fs = require('fs');
        path = require('path');
        directory = '/destiny/potato';
        files = ['a.json', 'b.js', 'c.png', 'd.jpeg', '../../../../dev/null'];
        modelTransformer = require('./model_transformer');
        modelPostTransformer = require('./model_post_transformer');

        options = {
            defaultResultCount: 32
        };
        
        spyOn(fs, 'readdir').and.callFake(function(dir, cb) {
            cb(null, files);
        });
        
        spyOn(fs, 'existsSync').and.returnValue(true);
        spyOn(console, 'warn');
        spyOn(modelTransformer, 'transformModel').and.callFake(function(a, b) { 
            return b; 
        });
        spyOn(modelPostTransformer, 'postTransformModel').and.callFake(function(a, b) { 
            return b;
         });

        var mockRequires = {};
        mockRequires[path.join(directory, 'a.json')] = {a: true};
        mockRequires[path.join(directory, 'b.js')] = {b: true, _meta: {count: 12}};
        mockRequires[path.join(directory, 'package.json')] = {ohnoes: 'running in a node project'};
        api = proxyquire('./api', mockRequires);
    });

    describe('getModelData method', function() {

        it('reads files from the provided directory', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(fs.readdir).toHaveBeenCalledWith(directory, jasmine.any(Function));
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Bubbles up an filesystem errors', function(done) {
            fs.readdir.and.callFake(function(unused, cb) {
                cb('ERROR: hard drive is currently hovering 6 feet above the computer');
            });

            api.getModelData(directory, options).then(function(result) {
                done.fail('Uhh, this should not work?');
            }).catch(function(err) {
                expect(err instanceof Error).toBeTruthy();
                done();
            });
        });

        it('Loads json files', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.a[0].a).toEqual(true);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Loads .js files', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.b[0].b).toEqual(true);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Blurts out an error if it finds a package.json, and node_modules exists', function(done) {
            files.push('package.json');

            api.getModelData(directory, options).then(function(result) {
                expect(console.warn).toHaveBeenCalled();
                expect(console.warn.calls.mostRecent().args[0].indexOf('root of a node')).not.toEqual(-1);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Does not blab to console.warn in a normal case', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(console.warn).not.toHaveBeenCalled();
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Ignores unknown extensions', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.c).not.toBeDefined();
                expect(result.data['c.png']).not.toBeDefined();
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Uses options.defaultResultCount if no meta count is provided', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.a.length).toEqual(options.defaultResultCount);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Uses the provided meta count if available', function(done) {
            api.getModelData(directory, options).then(function(result) {
                // value set on the meta flag on 12.
                expect(result.data.b.length).toEqual(12);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Does not include the _meta field in produced models', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.a._meta).not.toBeDefined();
                expect(result.data.b._meta).not.toBeDefined();
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Calls modelTransformer with the correct params', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(modelTransformer.transformModel).toHaveBeenCalledWith('a', {a: true});
                expect(modelTransformer.transformModel).toHaveBeenCalledWith('b', {b: true});
                // b.json has a call count of 12 - easier to add a comment and recreate the number here.
                expect(modelTransformer.transformModel.calls.count()).toEqual(options.defaultResultCount + 12);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });
        it('Calls modelPostTransformer with parsed models', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(modelPostTransformer.postTransformModel).toHaveBeenCalledWith('a', {a: true}, jasmine.objectContaining({a: jasmine.any(Array), b: jasmine.any(Array)}));
                expect(modelPostTransformer.postTransformModel).toHaveBeenCalledWith('b', {b: true}, jasmine.anything());
                // b.json has a call count of 12 - easier to add a comment and recreate the number here.
                expect(modelPostTransformer.postTransformModel.calls.count()).toEqual(options.defaultResultCount + 12);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });

        it('Rejects if there are no models available', function(done) {
            files = ['/dev/null', 'not.a.json.file'];
            api.getModelData(directory, options).then(function(result) {
                done.fail('Supposed to fail if no models available');
            }).catch(function(e) {
                done();
            });
        });

        it('Handles require failures gracefully', function(done) {
            files.push('broke.json');
            api.getModelData(directory, options).then(function(result) {
                done.fail('A corrupted file should cause failures');
                done();
            }).catch(function(e) {
                done();
            });
        });
        it('Response data object has entries for each model.', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.data.a[5].a).toEqual(true);
                expect(result.data.b[10].b).toEqual(true);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });
        it('Response documentation object has an entry for each model.', function(done) {
            api.getModelData(directory, options).then(function(result) {
                expect(result.documentation.a.a).toEqual(true);
                expect(result.documentation.b.b).toEqual(true);
                done();
            }).catch(function(e) {
                done.fail(e);
            });
        });
    });
});