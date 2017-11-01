var fs = require('fs'),
    path = require('path'),
    transformerFiles = fs.readdirSync(path.join(__dirname));

// Perhaps a bit non-traditional - this class takes all transformers in this directory, and
// maps them to an object, so require('transformers')['id'] is the transformer function.
// No real public API... not sure if there's anything to do with jsdoc here.
for (var i = 0; i < transformerFiles.length; i++) {
    if (transformerFiles[i] !== 'index.js' && !transformerFiles[i].endsWith('_spec.js') && transformerFiles[i].endsWith('.js')) {
        var transformerName = transformerFiles[i].replace('.js', '');
        module.exports[transformerName] = require(path.join(__dirname, transformerFiles[i]));
    }
}