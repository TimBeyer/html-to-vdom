var htmlparser = require('htmlparser2');

var parseHTML = function parseHTML (html) {
    var handler = new htmlparser.DomHandler(function (error, dom) {
        if (error) {
            throw new Error(error);
        }
    });

    var parser = new htmlparser.Parser(handler, { lowerCaseAttributeNames: false });
    parser.parseComplete(html);
    return handler.dom;
};

module.exports = parseHTML;
