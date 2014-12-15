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

    var promise = new Promise(function(resolve, reject) {

        google(query, function(err, next, links){

            if (err) {
                return reject(err);
            }

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

/*
find('webbyrå malmö', 'http://www.24hr.se').then(function(result) {
    console.log(result);
});
*/




