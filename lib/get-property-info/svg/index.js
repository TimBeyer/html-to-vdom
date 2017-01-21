var SVG_NAMESPACE = require('./svg-namespaces.js').SVG_NAMESPACE;
var SVG_ELEMENTS = require('./svg-namespaces.js').SVG_ELEMENTS;
var SVG_PROPERTIES = require('./svg-namespaces.js').SVG_PROPERTIES;

function thisIsSVGTag(tag) {
    return SVG_ELEMENTS.hasOwnProperty(tag);
}

function getSVGNamespace() {
    return SVG_NAMESPACE;
}

function SVGAttributeNamespace(value) {
    if (SVG_PROPERTIES.hasOwnProperty(value)) {
        return SVG_PROPERTIES[value];
    }
}

module.exports.thisIsSVGTag = thisIsSVGTag;
module.exports.getSVGNamespace = getSVGNamespace;
module.exports.SVGAttributeNamespace = SVGAttributeNamespace;
