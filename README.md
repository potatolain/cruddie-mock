# Cruddie Mock

Dead simple API mocking tool. Supply a folder full of json files describing your models, get a working REST API 
with CRUD methods for mock data. Cruddie Mock was built with simplicity in mind, so it should set you up for success.

For an example server, [check out the live demo](http://cruddie-mock-demo.cpprograms.net/)

# Quickstart Guide

  1. Install cruddie-mock globally: `npm install -g cruddie-mock`
  2. Create your models using json objects in your project. (See [examples folder](./examples))
  3. From the command line, open the folder your json files are in
  4. Start the server: `cruddie-mock`
  5. Open http://localhost:3009/

# Command Line Usage

```
Usage: cruddie-mock [options] [directory path]

[directory path] should be a directory with json files describing your models. If
omitted, the current working directory will be used instead. Regular require-style
javascript (.js) files will also work - export your model.
```

## Options

cruddie-mock provides a number of command-line options to make configuring it simple
for most use cases. All options are also available as environment variables. If both
are provided, command line options override environment variables.

| Argument         | Short Arg | Environment Var | Description                                                                |
|------------------|-----------|-----------------|----------------------------------------------------------------------------|
|  --port          | -p        | PORT            | Port to run process on (default 3009)                                      |
| --result-count   | -r        | RESULT_COUNT    | Number of results to put in an API by default. (default 50)                |
| --host           | _n/a_     | HOST            | Host to bind to. (Default 0.0.0.0, or all interfaces)                      |
| --no-cors        | _n/a_     | NO_CORS         | Disable Cross-Origin Resource Sharing                                      |
| --no-gzip        | _n/a_     | NO_GZIP         | Disable ZIP compression in responses                                       |
| --swagger-url    | _n/a_     | SWAGGER_URL     | Domain/port used for API. Use if hosting on a domain instead of localhost. |
| --read-only      | _n/a_     | READ_ONLY       | Only allow GET requests                                                    |
| --version        | _v_       | _n/a_           | Print version and exit                                                     |



# Model Format

Models are simply json files with a special syntax for anything you want to be randomized.
A plain json file will also work. For some live examples, check the `examples` folder.

## Built-in variables

| Key       | Example | Description |
|-----------|---------|--------------
| `{{id}}`      | 1       | Auto-incrementing ID. Unique per model
| `{{example}}` | example | The word example. Used for documentation.
| `{{foreign_id(model_name}}` | 5 | A valid id that links to the model named in parenthesis

## Faker-powered Variables 

### Address
| Key      | Example | Description |
|----------|---------|-------------|
| `{{address.zipCode}}` | 86966 | zipCode object. |
| `{{address.city}}` | Gradybury | city object. |
| `{{address.cityPrefix}}` | Lake | cityPrefix object. |
| `{{address.citySuffix}}` | borough | citySuffix object. |
| `{{address.streetName}}` | Bridget Village | streetName object. |
| `{{address.streetAddress}}` | 411 Dare Canyon | streetAddress object. |
| `{{address.streetSuffix}}` | Key | streetSuffix object. |
| `{{address.streetPrefix}}` | c | streetPrefix object. |
| `{{address.secondaryAddress}}` | Suite 116 | secondaryAddress object. |
| `{{address.county}}` | Avon | county object. |
| `{{address.country}}` | Tokelau | country object. |
| `{{address.countryCode}}` | CI | countryCode object. |
| `{{address.state}}` | Alabama | state object. |
| `{{address.stateAbbr}}` | MS | stateAbbr object. |
| `{{address.latitude}}` | -51.6628 | latitude object. |
| `{{address.longitude}}` | 126.4665 | longitude object. |


### Commerce
| Key      | Example | Description |
|----------|---------|-------------|
| `{{commerce.color}}` | orange | color object. |
| `{{commerce.department}}` | Electronics | department object. |
| `{{commerce.productName}}` | Fantastic Granite Gloves | productName object. |
| `{{commerce.price}}` | 151.00 | price object. |
| `{{commerce.productAdjective}}` | Sleek | productAdjective object. |
| `{{commerce.productMaterial}}` | Fresh | productMaterial object. |
| `{{commerce.product}}` | Ball | product object. |


### Company
| Key      | Example | Description |
|----------|---------|-------------|
| `{{company.suffixes}}` | Inc,and Sons,LLC,Group | suffixes object. |
| `{{company.companyName}}` | Rosenbaum Inc | companyName object. |
| `{{company.companySuffix}}` | Group | companySuffix object. |
| `{{company.catchPhrase}}` | Optional cohesive approach | catchPhrase object. |
| `{{company.bs}}` | next-generation whiteboard vortals | bs object. |
| `{{company.catchPhraseAdjective}}` | Polarised | catchPhraseAdjective object. |
| `{{company.catchPhraseDescriptor}}` | context-sensitive | catchPhraseDescriptor object. |
| `{{company.catchPhraseNoun}}` | forecast | catchPhraseNoun object. |
| `{{company.bsAdjective}}` | end-to-end | bsAdjective object. |
| `{{company.bsBuzz}}` | incubate | bsBuzz object. |
| `{{company.bsNoun}}` | e-commerce | bsNoun object. |


### Database
| Key      | Example | Description |
|----------|---------|-------------|
| `{{database.column}}` | name | column object. |
| `{{database.type}}` | decimal | type object. |
| `{{database.collation}}` | cp1250_bin | collation object. |
| `{{database.engine}}` | MEMORY | engine object. |


### Date
| Key      | Example | Description |
|----------|---------|-------------|
| `{{date.past}}` | Fri Aug 04 2017 12:01:40 GMT-0400 (Eastern Daylight Time) | past object. |
| `{{date.future}}` | Mon Jan 01 2018 19:15:34 GMT-0500 (Eastern Standard Time) | future object. |
| `{{date.recent}}` | Fri Sep 08 2017 18:23:21 GMT-0400 (Eastern Daylight Time) | recent object. |
| `{{date.month}}` | March | month object. |
| `{{date.weekday}}` | Sunday | weekday object. |


### Finance
| Key      | Example | Description |
|----------|---------|-------------|
| `{{finance.account}}` | 81777179 | account object. |
| `{{finance.accountName}}` | Credit Card Account | accountName object. |
| `{{finance.mask}}` | 0926 | mask object. |
| `{{finance.amount}}` | 275.73 | amount object. |
| `{{finance.transactionType}}` | deposit | transactionType object. |
| `{{finance.currencyCode}}` | VEF | currencyCode object. |
| `{{finance.currencyName}}` | Zimbabwe Dollar | currencyName object. |
| `{{finance.currencySymbol}}` | £ | currencySymbol object. |
| `{{finance.bitcoinAddress}}` | 1632O02TB7R9R2CXJQMWVMBL23K4 | bitcoinAddress object. |
| `{{finance.iban}}` | LV51LLBW360H89FZ74H3I | iban object. |
| `{{finance.bic}}` | FFVEHRE1 | bic object. |


### Hacker
| Key      | Example | Description |
|----------|---------|-------------|
| `{{hacker.abbreviation}}` | SAS | abbreviation object. |
| `{{hacker.adjective}}` | 1080p | adjective object. |
| `{{hacker.noun}}` | bandwidth | noun object. |
| `{{hacker.verb}}` | back up | verb object. |
| `{{hacker.ingverb}}` | hacking | ingverb object. |
| `{{hacker.phrase}}` | You can't copy the microchip without navigating the open-source GB program! | phrase object. |


### Image
| Key      | Example | Description |
|----------|---------|-------------|
| `{{image.image}}` | http://lorempixel.com/640/480/abstract | image object. |
| `{{image.avatar}}` | https://s3.amazonaws.com/uifaces/faces/twitter/charliegann/128.jpg | avatar object. |
| `{{image.imageUrl}}` | http://lorempixel.com/640/480 | imageUrl object. |
| `{{image.abstract}}` | http://lorempixel.com/640/480/abstract | abstract object. |
| `{{image.animals}}` | http://lorempixel.com/640/480/animals | animals object. |
| `{{image.business}}` | http://lorempixel.com/640/480/business | business object. |
| `{{image.cats}}` | http://lorempixel.com/640/480/cats | cats object. |
| `{{image.city}}` | http://lorempixel.com/640/480/city | city object. |
| `{{image.food}}` | http://lorempixel.com/640/480/food | food object. |
| `{{image.nightlife}}` | http://lorempixel.com/640/480/nightlife | nightlife object. |
| `{{image.fashion}}` | http://lorempixel.com/640/480/fashion | fashion object. |
| `{{image.people}}` | http://lorempixel.com/640/480/people | people object. |
| `{{image.nature}}` | http://lorempixel.com/640/480/nature | nature object. |
| `{{image.sports}}` | http://lorempixel.com/640/480/sports | sports object. |
| `{{image.technics}}` | http://lorempixel.com/640/480/technics | technics object. |
| `{{image.transport}}` | http://lorempixel.com/640/480/transport | transport object. |
| `{{image.dataUri}}` | [Data URI goes here] | A Data URI object. |


### Internet
| Key      | Example | Description |
|----------|---------|-------------|
| `{{internet.avatar}}` | https://s3.amazonaws.com/uifaces/faces/twitter/j04ntoh/128.jpg | avatar object. |
| `{{internet.email}}` | Thurman_Howell@yahoo.com | email object. |
| `{{internet.exampleEmail}}` | Derrick.Blick@example.com | exampleEmail object. |
| `{{internet.userName}}` | Marge_Hettinger | userName object. |
| `{{internet.protocol}}` | https | protocol object. |
| `{{internet.url}}` | http://genoveva.net | url object. |
| `{{internet.domainName}}` | birdie.com | domainName object. |
| `{{internet.domainSuffix}}` | biz | domainSuffix object. |
| `{{internet.domainWord}}` | lacy | domainWord object. |
| `{{internet.ip}}` | 164.123.119.107 | ip object. |
| `{{internet.ipv6}}` | c58a:23c6:39f8:ad74:2e72:28ac:8f96:3b3f | ipv6 object. |
| `{{internet.userAgent}}` | Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/7.0; .NET CLR 2.0.57178.2) | userAgent object. |
| `{{internet.color}}` | #5b2c38 | color object. |
| `{{internet.mac}}` | 48:4e:65:ff:a6:7b | mac object. |
| `{{internet.password}}` | aqb0BbU44XSkgbV | password object. |


### Lorem
| Key      | Example | Description |
|----------|---------|-------------|
| `{{lorem.word}}` | qui | word object. |
| `{{lorem.words}}` | accusantium earum qui | words object. |
| `{{lorem.sentence}}` | Quo quas omnis assumenda libero. | sentence object. |
| `{{lorem.slug}}` | saepe-est-sunt | slug object. |
| `{{lorem.sentences}}` | Lorem ipsum... | A few sentences. |
| `{{lorem.paragraph}}` | Lorem ipsum... | A paragraph. |
| `{{lorem.paragraphs}}` | Lorem ipsum... | A few paragraphs. |
| `{{lorem.text}}` | Lorem ipsum... | Lorem ipsum text with newline characters. |
| `{{lorem.lines}}` | Lorem ipsum... | Lorem ipsum text with newline characters. |


### Name
| Key      | Example | Description |
|----------|---------|-------------|
| `{{name.firstName}}` | Fletcher | firstName object. |
| `{{name.lastName}}` | Blick | lastName object. |
| `{{name.findName}}` | Hiram Hoeger | findName object. |
| `{{name.jobTitle}}` | Dynamic Accountability Assistant | jobTitle object. |
| `{{name.prefix}}` | Dr. | prefix object. |
| `{{name.suffix}}` | Sr. | suffix object. |
| `{{name.title}}` | Senior Metrics Planner | title object. |
| `{{name.jobDescriptor}}` | Dynamic | jobDescriptor object. |
| `{{name.jobArea}}` | Web | jobArea object. |
| `{{name.jobType}}` | Technician | jobType object. |


### Phone
| Key      | Example | Description |
|----------|---------|-------------|
| `{{phone.phoneNumber}}` | 681.712.3445 x781 | phoneNumber object. |
| `{{phone.phoneNumberFormat}}` | 273-435-5932 | phoneNumberFormat object. |
| `{{phone.phoneFormats}}` | (###) ###-#### x### | phoneFormats object. |


### Random
| Key      | Example | Description |
|----------|---------|-------------|
| `{{random.number}}` | 30148 | number object. |
| `{{random.arrayElement}}` | c | arrayElement object. |
| `{{random.objectElement}}` | bar | objectElement object. |
| `{{random.uuid}}` | b0223f3a-48af-4aaa-aecc-eda906c19304 | uuid object. |
| `{{random.boolean}}` | false | boolean object. |
| `{{random.word}}` | Credit Card Account | word object. |
| `{{random.words}}` | Avon olive Fish | words object. |
| `{{random.image}}` | http://lorempixel.com/640/480/food | image object. |
| `{{random.locale}}` | ko | locale object. |
| `{{random.alphaNumeric}}` | n | alphaNumeric object. |


### System
| Key      | Example | Description |
|----------|---------|-------------|
| `{{system.fileName}}` | next_generation_best_of_breed.atc | fileName object. |
| `{{system.commonFileName}}` | tangible_central_tools.mpga | commonFileName object. |
| `{{system.mimeType}}` | application/cals-1840 | mimeType object. |
| `{{system.commonFileType}}` | video | commonFileType object. |
| `{{system.commonFileExt}}` | wav | commonFileExt object. |
| `{{system.fileType}}` | image | fileType object. |
| `{{system.fileExt}}` | csml | fileExt object. |
| `{{system.semver}}` | 9.5.3 | semver object. |

## Linking models together

If you define multiple models, the `foreign_id` field will let you link them together, similar to a join in 
mysql. cruddie-mock will look at the other model you reference, and pick a random id to link it to.
Here's what it looks like, with an excerpt from `upload.json` in the `application` example:

```json
{
  "name": "{{system.fileName}}",
  "userId": "{{foreign_id(user)}}"
}
```

As long as you have a user model, this will find a valid user id to put into this field. This by itself is kinda
useful, but you can also use the API to fetch all uploads owned by a user, or fetch the user object with your 
upload. Run the `application` demo and look at the swagger documentation to see how.

## Meta information

Models can have a special `_meta` field, which can customize settings about how cruddie-mock handles the model.

Right now, the only option available is `count`, which will change the number of results generated, instead of
using the default. There is an example in [the uploads model](./examples/application/uploads.json) in the 
[applications example](./examples/application).

# Node API?

The module doesn't have a nodejs API, at least not yet. This is a planned feature, but I have no estimate for when 
it might be implemented. 

# Contributing

The short answer is, send a PR! There are plenty of guides online to help you do this if
you're new to it. I don't have any hard-and-fast rules - just please try to write tests if you 
are adding complex logic. I'm sure we can figure out a way to get your changes in.

# Publishing new versions

This is mainly a note for myself, and any other contributors that might come along. Publishing is 
currently a manual process. Run the following commands, filling in details as needed.

```sh
npm version [patch|minor|major] -m "This is what we did"
git push && git push --tags
```

After this, please fill out the release notes on github. (Yes, manually. Sorry!)

# A few words on testing...

This is the first personal project I've ever put effort into writing tests for. They probably are not super great, 
but my hope is that they will give contributors some confidence in their changes. 

That said, I am *not* a firm believer in 100% test coverage, nor in complicating code to write better unit tests.

Don't let tests hold you up from submitting a PR! Whether you feel like some are missing, or you have tests failing
for no reason - just note it in the PR and we'll get things working. My tests may need to be rewritten, or scrapped
completely.

# Modules we use and love

- [json-server](https://github.com/typicode/json-server): Great little script that creates express-friendly 
  CRUD endpoints for a given object or json file.
- [faker.js](https://github.com/Marak/faker.js): Has a ton of methods to create believable fake data.
- [swagger-ui](https://github.com/swagger-api/swagger-ui): Functional UI around the OpenAPI specification, 
  makes testing APIs simple and intuitive.

# License 

This software is released under the MIT license, detailed in the LICENSE file. Note that included modules such
as [swagger-ui](https://github.com/swagger-api/swagger-ui), [faker.js](https://github.com/Marak/faker.js), 
and [json-server](https://github.com/typicode/json-server) may use separate licenses, such as the Apache license.
