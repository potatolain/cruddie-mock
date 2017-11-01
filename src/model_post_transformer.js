var postTransformers = require('./post_transformers'),
    util = require('./util');

/**
 * Apply post-transformations to the given model. This expects the model to be fully transformed, so we can look at
 * the data in the model to figure this information out.
 * @param {string} modelName The model name to update.
 * @param {object} model The model to update.
 * @param {object} allModels A collection of all models.
 * @return The model, transformed.
 */
module.exports.postTransformModel = function(modelName, model, allModels) {
    model = util.deepCopy(model);

    Object.keys(model).forEach(function(key) {
        model[key] = postTransformObject(modelName, model, key, allModels);
    });
    return model;
}

/**
 * Run any transformations meant to take place after objects have already been created and transformed.
 * @param {string} modelName The name of the model
 * @param {object} model The model to transform.
 * @param {string} key The key to look up this value from.
 * @param {object} allModels All models that have been transformed.
 * @return The transformed version of this object.
 */
function postTransformObject(modelName, model, key, allModels) {
    if (typeof model[key] === 'string') {
        // If the value exactly matches {{any.thing}}, replace it with the transformed version, getting its type.
        if (/^\{\{(\w|\.|_|\(|\))+\}\}$/.test(model[key])) {
            var parenPos = model[key].indexOf('(');
            if (parenPos === -1)
                return model[key];

            var name = model[key].substr(2, parenPos - 2);
            if (typeof postTransformers[name] !== 'undefined') {
                return postTransformers[name](model[key], key, model, allModels);
            }
        }
    } else if (Array.isArray(model[key])) {
        model[key].forEach(function(obj, subKey) {
            model[key][subKey] = postTransformObject(modelName, model[key], subKey, allModels);
        });
    } else if (typeof model[key] === 'object') {
        model[key] = module.exports.postTransformModel(modelName, model[key], allModels);
    }

    return model[key];
}
