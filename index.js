var convertHTML = require('./lib/html-to-vdom');
module.exports = function initializeConverter (dependencies) {
    if (!dependencies.VNode || !dependencies.VText) {
        throw new Error('html-to-vdom needs to be initialized with VNode and VText');
    }
    return convertHTML(dependencies.VNode, dependencies.VText);
};
