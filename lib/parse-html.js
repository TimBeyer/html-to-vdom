var htmlparser = require('htmlparser');

var parseHTML = function parseHTML (html) {
	var handler = new htmlparser.DefaultHandler(function (error, dom) {
        return dom;
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    return handler.dom;
};

module.exports = parseHTML;