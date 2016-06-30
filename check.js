var Promise = require('es6-promise').Promise;
var google = require('google');

google.resultsPerPage = 100;
google.lang = 'sv';
google.tld = 'se';

function find(query, url) {

    var result = {
        query: query,
        url: url,
        found: false
    };

console.log(result);

    var promise = new Promise(function(resolve, reject) {

        google(query, function(err, result) {

console.log(result);

            if (err) {
                return reject(err);
            }

            var links = result.links;

            for (var i = 0; i < links.length; ++i) {

                if (links[i].link === url || links[i].link === url + '/') {
                    result.found = true;
                    result.position = i;
                    return resolve(result);
                }

            }

            return resolve(result);

        });

    });

    return promise;

}

exports.find = find;


//find('webbyrå malmö', 'https://www.24hr.se').then(function(result) {
//    console.log(result);
//});





