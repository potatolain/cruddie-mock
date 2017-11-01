var currentIds = {};
/**
 * Transformer: generates an auto-incrementing id based on the model name that is passed in.
 * @see ./example.js For transformer syntax.
 */
module.exports = function(modelKey, key, context, model) {
    var id = currentIds[modelKey] ? currentIds[modelKey] + 1 : 1;
    currentIds[modelKey] = id;
    return id;
}