var htmlparserToVdom = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');

module.exports = function convertHTML(html) {
    return parseHTML(html).then(function (tags) {
        return htmlparserToVdom.convertTag(tags[0]);
    });
};