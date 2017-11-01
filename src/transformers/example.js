/**
 * Transformer: Generates the word "example" based on nothing. Use this file for up-to-date documentation on
 * the interface and available fields. All transformers in this directory have the same method signature, and
 * always return the value you want this key replaced with. 
 * 
 * The name of your file is also the name that you can use within {{mustache}} syntax. 
 * You can invoke the "example" transformer using the string "{{example}}"
 * @param {string} modelKey The name of the model. Can be used to store data (such as an auto-incrementing id)
 *                          for the given model.
 * @param {string} key The key on the model that is being provided.
 * @param {string} context The full string for the field being translated. (Including other tags)
 * @param {object} model The full model being interpolated.
 * @return An object described by the name of the transformer.
 */
module.exports = function(modelKey, key, context, model) {
    return 'example';
}