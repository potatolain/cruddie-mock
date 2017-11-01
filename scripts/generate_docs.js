// Cute little script to take the Faker documentation, and generate documentation for us from it. (With examples!)

var faker = require('faker'),
    request = require('request');

// Stuff that we don't support, for one reason or another...
var BLACKLIST = [
    // Think this one needs params, else I get an invalid date. Not quite ready to sort that out yet.
    'between', 
    // Doesn't really make any sense.
    'helpers', 
    '### API Methods',
    'fake',
    // Not entirely sure why this is undefined on my system, and I don't care enough to find out.
    // PRs/explanations welcome!
    'filePath',
    'directoryPath'];

request.get('https://raw.githubusercontent.com/Marak/faker.js/master/Readme.md', function(err, result) {
    var str = result.body.substr(result.body.indexOf('### API Methods'));
    str = str.substr(0, str.indexOf('## Localization')).split('\n');

    var category = '',
        examples = [],
        failureCount = 0;

    // Key | example | description
    str.forEach(function(current) {
        if (current.trim() == '')
            return;

        if (current[0] == ' ') {
            current = current.replace('*', '').trim();

            if (BLACKLIST.indexOf(current) !== -1 || BLACKLIST.indexOf(category) !== -1)
                return;

            if (current == 'dataUri') {
                examples.push('| `{{image.dataUri}}` | [Data URI goes here] | A Data URI object. |');
                return;
            } else if (current == 'paragraph') {
                examples.push('| `{{lorem.paragraph}}` | Lorem ipsum... | A paragraph. |');
                return;
            } else if (current == 'paragraphs') {
                examples.push('| `{{lorem.paragraphs}}` | Lorem ipsum... | A few paragraphs. |');
                return;
            } else if (current == 'sentences') {
                examples.push('| `{{lorem.sentences}}` | Lorem ipsum... | A few sentences. |');
                return;
            } else if (current == 'text') {
                examples.push('| `{{lorem.text}}` | Lorem ipsum... | Lorem ipsum text with newline characters. |');
                return;
            } else if (current == 'lines') {
                examples.push('| `{{lorem.lines}}` | Lorem ipsum... | Lorem ipsum text with newline characters. |');
                return;
            }

            
            try {
                examples.push('| `{{' + category + '.' + current + '}}` | ' + faker[category][current]() + ' | ' + current + ' object. |');
            } catch (e) {
                // Usually this means there's some new Faker stuff our version doesn't support.
                console.error('Failed adding docs for ' + category + '.' + current + ', does it actually exist? Might need to update Faker!');
                failureCount++;
            }
        } else {
            category = current.replace('*', '').trim();
            var capCat = category[0].toUpperCase() + category.slice(1);
            if (BLACKLIST.indexOf(category) === -1) {
                examples.push('','', '### ' + capCat, '| Key      | Example | Description |', '|----------|---------|-------------|'); 
            }                
        }
    });

    console.info(examples.join('\n'));

    if (failureCount > 0) {
        console.info('\n\nNOTE: there were ' + failureCount + ' errors in this run. Have you tried updating Faker?');
    }

});