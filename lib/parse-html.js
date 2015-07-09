var htmlparser = require('htmlparser2');

var parseHTML = function parseHTML (html) {
    var handler = new htmlparser.DomHandler();

    var parser = new htmlparser.Parser(handler, {
        lowerCaseAttributeNames: false
    });
    parser.parseComplete(html);
    return handler.dom;
};

module.exports = parseHTML;
