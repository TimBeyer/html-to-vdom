var createConverter = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');

module.exports = function initializeHtmlToVdom (VTree, VText, mapTagToKey) {
    var htmlparserToVdom = createConverter(VTree, VText, mapTagToKey);
    return function convertHTML(html) {
        var tags = parseHTML(html);
        return htmlparserToVdom.convertTag(tags[0]);
    };
};
