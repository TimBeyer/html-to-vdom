var htmlparser = require('htmlparser');
var Promise = require('bluebird');

var parseHTML = function parseHTML (html) {
    return new Promise(function (resolve, reject) {
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
            if (error)
                reject(error)
            else
                resolve(dom);
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(html);
    })
};

module.exports = parseHTML;