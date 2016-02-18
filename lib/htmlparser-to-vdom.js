var decode = require('ent').decode;
var convertTagAttributes = require('./convert-tag-attributes');
var svg = require('./get-property-info/svg');
var SVGAttributeHook = require('./get-property-info/svg/svg-attribute-hook');

module.exports = function createConverter (VNode, VText) {
    var converter = {
        convert: function (node, getVNodeKey) {
            if (node.type === 'tag' || node.type === 'script' || node.type === 'style') {
                return converter.convertTag(node, getVNodeKey);
            } else if (node.type === 'text') {
                return new VText(decode(node.data));
            } else {
                // converting an unsupported node, return an empty text node instead.
                return new VText('');
            }
        },
        convertTag: function (tag, getVNodeKey) {
            var attributes = convertTagAttributes(tag);
            var key;

            if (getVNodeKey) {
                key = getVNodeKey(attributes);
            }

            var children = Array.prototype.map.call(tag.children || [], function(node) {
                return converter.convert(node, getVNodeKey);
            });

            if(svg.thisIsSVGTag(tag.name)) {
                return convertSvg(tag, attributes, children, key);
            }

            return new VNode(tag.name, attributes, children, key);
        }
    };

    function convertSvg(tag, attributes, children, key) {
        var _attributes = attributes.attributes;

        for(var _key in _attributes) {
            if (!_attributes.hasOwnProperty(_key)) {
                continue;
            }

            var namespace = svg.SVGAttributeNamespace(_key);

            if (namespace === void 0) { // not a svg attribute
                continue;
            }

            var value = _attributes[_key];

            if (typeof value !== 'string' &&
                typeof value !== 'number' &&
                typeof value !== 'boolean'
            ) {
                continue;
            }

            if (namespace !== null) { // namespaced attribute
                attributes[_key] = SVGAttributeHook(namespace, value);
                _attributes[_key] = void 0;
                continue;
            }
        }

        return new VNode(tag.name, attributes, children, key, svg.getSVGNamespace());
    }
    
    
    return converter;
};
