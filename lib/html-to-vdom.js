var createConverter = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');

module.exports = function initializeHtmlToVdom (VTree, VText) {
    var htmlparserToVdom = createConverter(VTree, VText);
    return function convertHTML(options, html) {
        var noOptions = typeof html === 'undefined' && typeof options === 'string';
        var hasOptions = !noOptions;

        // was html supplied as the only argument?
        var htmlToConvert = noOptions ? options : html;
        var getVNodeKey = hasOptions ? options.getVNodeKey : undefined;

        var tags = parseHTML(htmlToConvert);

        if (tags.length > 1) {
            throw new Error('Input must always have only one root node. You cannot convert multiple siblings without a wrapping tag around them.');
        }

        var convertedHTML = htmlparserToVdom.convert(tags[0], getVNodeKey);

        return convertedHTML;
    };
};
