#!/usr/bin/env node

// Simple little server wrapper for the API - easiest way to use the program.

var jsonServer = require('json-server'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    args = require('minimist')(process.argv.slice(2));
    server = jsonServer.create(),
    api = require('../src/api.js'),
    packageInfo = require('../package.json'),
    documentation = require('../src/documentation');

// Default configuration, with overrides from CLI params and environment variables.
var config = {
    port: args.port || args.p || process.env.PORT || 3009,
    host: args.host || process.env.HOST || '0.0.0.0',
    directory: (args._ && args._[0] ? args._[0] : false) || process.env.DIRECTORY,
    defaultResultCount: args['result-count'] || args.r || process.env.RESULT_COuNT || 50,
    noCors: args['no-cors'] || process.env.NO_CORS || false,
    noGzip: args['no-gzip'] || process.env.NO_GZIP || false,
    readOnly: args['read-only'] || process.env.READ_ONLY || false
};
config.swaggerUrl = args['swagger-url'] || process.env.SWAGGER_URL || '127.0.0.1:' + config.port;

// Directory is treated a little differently, as we want user-provided directories to be relative
// to their current directory, not to the cruddie-mock directory.
if (config.directory) {
    config.directory = path.join(process.cwd(), config.directory);
} else {
    config.directory = process.cwd();
}

// Help text... I think you can probably figure this one out ;)
if (args.h || args.help) {
    console.info('cruddie-mock v'+packageInfo.version);
    console.info();
    console.info('A quick and easy API mocking tool using json files for model definitions.');
    console.info('Usage: cruddie-mock [options] [directory path]');
    console.info();
    console.info('[directory path] should be a directory with json files describing your models. If');
    console.info('omitted, the current working directory will be used instead.');
    console.info();
    console.info('Options: ');
    console.info('  --port (-p)            Port to run process on (default 3009)');
    console.info('  --result-count (-r)    Number of results to put in an API by default. (default 50)');
    console.info('  --host                 Host to bind to. (Default 0.0.0.0, or all interfaces)');
    console.info('  --no-cors              Disable Cross-Origin Resource Sharing');
    console.info('  --no-gzip              Disable ZIP compression in responses');
    console.info('  --swagger-url          Domain/port used for API. Use if hosting on a domain');
    console.info('                         instead of localhost.');
    console.info('  --read-only            Only allow GET requests');
    console.info('  --version (-v)         Print version and exit');
    console.info();
    console.info('All options are also supported as environment variables, using SNAKE_CASE');
    console.info('Find more complete documentation on Github!');
    console.info('https://github.com/cppchriscpp/cruddie-mock');
    process.exit();
}

if (args.version || args.v) {
    console.info('cruddie-mock v' + packageInfo.version);
    process.exit();
}


// Build up all express routes for the json files in the user's directory.
api.getModelData(config.directory, config).then(function(modelData) {
    var middlewareOpts = {};
    // If you don't have your own static files, inject our own that override json-server's
    if (!fs.existsSync(path.join(process.cwd(),'public'))) {
        middlewareOpts.static = path.resolve(path.join(__dirname, '/../public'));
    }
    if (config.noCors) {
        middlewareOpts.noCors = true;
    }

    if (config.noGzip) {
        middlewareOpts.noGzip = true;
    }

    if (config.readOnly) {
        middlewareOpts.readOnly = true;
    }

    middleware = jsonServer.defaults(middlewareOpts);
    server.use(middleware);
    
    documentation.registerRoutes(modelData, server, config);

    // Set up jsonserver to point at our generated data.
    server.use(jsonServer.router(modelData.data));
    
    // Aaaand we're live!
    server.listen(config.port, function() {
        console.log('Test server started on port ' + config.port);
    });
}).catch(function(error) {
    console.error('Failed starting up the app', error);
    throw new Error(error);
});