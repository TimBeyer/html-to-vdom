var createConverter = require('./htmlparser-to-vdom');
var parseHTML = require('./parse-html');

module.exports = function initializeHtmlToVdom (VTree, VText) {
    var htmlparserToVdom = createConverter(VTree, VText);
    return function convertHTML(html, options) {
    	// Allow specifying the options as the first argument to allow binding of this function. 
    	// This is useful to support specifying options to all calls with a single bound function.
    	if (typeof html !== 'string' && options) {
    		var args = Array.prototype.slice.call(arguments);
    		options = args[0];
    		html = args[1];
    	}

        var tags = parseHTML(html);

        if (options && options.getVNodeKey){
        	htmlparserToVdom.getVNodeKey = options.getVNodeKey;
        }

        var convertedHTML = htmlparserToVdom.convertTag(tags[0]);
        htmlparserToVdom.getVNodeKey = null;
        return convertedHTML;
    };
};
