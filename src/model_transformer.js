var transformers = require('./transformers'),
    util = require('./util'),
    faker = require('faker');

/**
 * Given an object comprised of keys matched with values with one or more mustache-style tags in it, return an 
 * object with those tags parsed. If a tag stands alone in a key, the value in the returned object will be of 
 * the type of that object. (For example, {{random.number}} will return with a Number type, not a string.)
 * Does not touch the original object.
 * Supported transformations documented in the readme, and are provided by faker or the "src/transformers" directory.
 * @param {string} modelName The name of the model to transform. (Used to track state, for auto-incrementing ids, etc.)
 * @param {object} model The model template object. Any mustache-styled values will be replaced with values.
 * @param {boolean} skipId If true, don't add an id to this object - used for sub-objects.
 */
module.exports.transformModel = function(modelName, model, skipId) {
    // Do a deep clone to avoid modifying the original object.
    model = util.deepCopy(model);

    if (!skipId && typeof model.id === 'undefined') {
        model.id = '{{id}}';
    }

    Object.keys(model).forEach(function(key) {
        model[key] = transformObject(modelName, model, key);
    });
    return model;
}

/**
 * Given a string naming a supported type of fake data, respond with that fake data, using the appropriate data type.
 * @param {string} field The original, unmodified string from the object. Used if the data cannot be transformed.
 * @param {string} name The name of the type of transformation to apply.
 * @param {string} modelName The name of the top-level model being transformed.
 * @param {object} model The full model object, for looking up other already-parsed fields.
 * @return An object described by 'name', or the unmodified field object.
 */
function transformWithType(field, name, modelName, model) {
    if (typeof transformers[name] !== 'undefined') {
        return transformers[name](modelName, name, field, model);
    } else {
        // Look up stuff supported by Faker, and pass through its type!
        var nameBits = name.split('.');
        if (nameBits.length == 2 && typeof faker[nameBits[0]] !== 'undefined' && typeof faker[nameBits[0]][nameBits[1]] === 'function') {
            return faker[nameBits[0]][nameBits[1]]();
        }
    }
    return field;
}

/**
 * Given a string with a number of mustache-styled tags, returns a string where the tags are replaced by values for any 
 * known transformations.
 * @param {string} field The original string with mustache syntaxx to replace.
 * @param {string} modelName The name of the top-level model being transformed.
 * @param {object} model The full model object, used for looking up already-parsed fields.
 * @return A string with the interpolated values replaced.
 */
function transformString(field, modelName, model) {
    // Nice little regex that extracts every {{tag.thing}} for us.
    var keys = field.match(/\{\{(\w|\.|_)+\}\}/g);
    if (keys !== null) {
        for (var i = 0; i < keys.length; i++) {
            var transformerName = keys[i].substr(2, keys[i].length - 4);
            if (typeof transformers[transformerName] !== 'undefined') {
                field = field.replace(keys[i], transformers[transformerName](modelName, transformerName, field, model));
            } else {
                // Look up stuff supported by Faker
                var nameBits = transformerName.split('.');
                if (nameBits.length == 2 && typeof faker[nameBits[0]] !== 'undefined' && typeof faker[nameBits[0]][nameBits[1]] === 'function') {
                    field = field.replace(keys[i], faker[nameBits[0]][nameBits[1]]());
                }

            }
        }
    }
    return field;

}

/**
 * Transforms a given object of any type to replace our tags. Intended for recursive use.
 * @param {string} modelName The name of the model we're working with.
 * @param {any} model The model to operate on.
 * @param {string|number} key The key of the object we want to use.
 */
function transformObject(modelName, model, key) {
    if (typeof model[key] === 'string') {
        // If the value exactly matches {{any.thing}}, replace it with the transformed version, getting its type.
        if (/^\{\{(\w|\.|_)+\}\}$/.test(model[key])) {
            var name = model[key].substr(2, model[key].length - 4);
            model[key] = transformWithType(model[key], name, modelName, model);
        } else { // Otherwise, get all tags and insert them into the string.
            model[key] = transformString(model[key], modelName, model);
        }
    } else if (Array.isArray(model[key])) {
        model[key].forEach(function(obj, subKey) {
            model[key][subKey] = transformObject(modelName, model[key], subKey);
        });
    } else if (typeof model[key] === 'object') {
        model[key] = module.exports.transformModel(modelName, model[key], true);
    }

    return model[key];
}