var fs = require('fs'),
    path = require('path'),
    util = require('./util'),
    modelTransformer = require('./model_transformer'),
    modelPostTransformer = require('./model_post_transformer');

/**
 * Given a directory to work with and som options, responds with an object mapping model names to model data, as
 * well as openapi data describing the API json-server will produce.
 * The data provided should be able to be plugged into both json-server and swgagger-ui.
 * @param {string} directory The full path to a directory containing one or more json files.
 * @param {object} options An object filled with options for how to handle this model. 
 * @return {object} An object with two keys: data (the data for json-server) and documentation
 *                  (the data for swagger-ui).
 */
module.exports.getModelData = function(directory, options) {
    options = options || {};
    options.defaultResultCount = options.defaultResultCount || 50;

    return new Promise(function(resolve, reject) {
        var documentationModels = {},
            modelData = {};
        fs.readdir(directory, function(err, files) {
            if (err) {
                reject(new Error(err));
                return;
            }

            for (var i = 0; i < files.length; i++) {

                var parsedModel = parseFile(files[i], directory, options);
                if (parsedModel instanceof Error) {
                    reject(parsedModel);
                    return;
                } else if (parsedModel !== null) {
                    modelData[parsedModel.id] = parsedModel.model;
                    documentationModels[parsedModel.id] = parsedModel.model[0];
                }
            }

            if (Object.keys(modelData).length === 0) {
                reject(new Error('No mocked models found'));
                return;
            }
            modelData = postTransformModels(modelData);
            resolve({data: modelData, documentation: documentationModels});
        });
    });
};

/**
 * Runs post-transformations on a given set of model data.
 * @param {object} modelData key/value pair of model names to example data arrays, created elsewhere in this file.
 * @return {object} The same object, but with post-transformations completed.
 */
function postTransformModels(modelData) {
    Object.keys(modelData).forEach(function(modelKey) {
        for (var i = 0; i < modelData[modelKey].length; i++) {
            modelData[modelKey][i] = modelPostTransformer.postTransformModel(modelKey, modelData[modelKey][i], modelData);
        }
    });
    return modelData;
}

/**
 * Given a filename, a directory and some options, respond with an object mapped to arrays of objects with all 
 * fields parsed.
 * Note that this does NOT perform post-transforms. (They need all models parsed first.)
 * @param {string} file The name of the file to parse and generate model data for.
 * @param {string} directory The full path to the directory that the file is in.
 * @param {object} options A set of options that can tell us how many results to create, etc.
 * @return {object} An object with modelName keys mapped to arrays of parsed models. 
 */
function parseFile(file, directory, options) {
    var cleanName = file.replace(/\.[^/.]+$/, "");
    if (file === 'package.json' && fs.existsSync(path.join(directory, 'node_modules'))) {
        console.warn('WARNING: Looks like you ran cruddie-mock in the root of a node project. Pass in a directory name as the first argument to use that directory. This notification means we parsed your package.json file, so the API is serving up "package" objects based on your package.json file.');
    }
    
    if (file.endsWith('.json') || file.endsWith('.js')) {
        var model,
            count = options.defaultResultCount;
        try {
            model = require(path.join(directory, file));
        } catch (e) {
            return new Error(e);
        }
        if (model._meta && model._meta.count) {
            count = model._meta.count;
        }
        delete model._meta;
        return getMockData(cleanName, model, count);
    } else {
        return null;
    }
}

/**
 * Given a model and a count, respond with an array of same models with all fields parsed.
 * @param {string} id The name of the model being transformed.
 * @param {object} model The actual model.
 * @param {number} count How many objects to create.
 * @return {Array} An array containing the specified number of parsed objects.
 */
function getMockData(id, model, count) {
    var obj = [];
    for (var i = 0; i < count; i++) {
        obj.push(modelTransformer.transformModel(id, model));
    }
    return {id: id, model: obj};
}