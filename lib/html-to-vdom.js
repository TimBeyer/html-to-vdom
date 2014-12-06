var htmlparserToVdom = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');

module.exports = function convertHTML(html) {
    var tags = parseHTML(html);
    return htmlparserToVdom.convertTag(tags[0]);
};