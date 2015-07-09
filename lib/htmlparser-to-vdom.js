var decode = require('ent').decode;
var convertTagAttributes = require('./convert-tag-attributes');

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

            return new VNode(tag.name, attributes, children, key);
        }
    };
    return converter;
};
