var createConverter = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');
var _ = require('lodash');

module.exports = function initializeHtmlToVdom (VTree, VText) {
    var htmlparserToVdom = createConverter(VTree, VText);
    return function convertHTML(options, html) {
    	var noOptions = _.isUndefined(html) && _.isString(options);
    	var hasOptions = !noOptions;

    	// was html supplied as the only argument?
    	var htmlToConvert = noOptions ? options : html;
    	var getVNodeKey = hasOptions ? options.getVNodeKey : undefined;

    	var tags = parseHTML(htmlToConvert);

    	var convertedHTML = htmlparserToVdom.convertTag(tags[0], getVNodeKey);

    	return convertedHTML;
    };
};
