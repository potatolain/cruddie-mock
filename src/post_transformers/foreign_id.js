module.exports = function(value, key, model, allModels) {
    var model = value.replace('{{foreign_id(', '').replace(')}}', '');
    if (allModels[model] && allModels[model].length) {
        var idx = Math.floor(allModels[model].length * Math.random());
        return allModels[model][idx].id;
    } else {
        return -1;
    }
};