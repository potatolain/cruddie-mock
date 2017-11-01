/**
 * Does a deep copy of an object, so any changes to it are not reflected on the original object.
 * Not the most efficient way to go about this, but it works.
 * @param {object} obj The object to clone.
 * @return {object} The same object, but cloned.
 */
module.exports.deepCopy = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}