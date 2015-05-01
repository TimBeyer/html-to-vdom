var decode = require('ent').decode;

var prefixLength = ('data-').length;

var attributesToDecode = {
    'placeholder': true,
    'title': true,
    'alt': true
};

var attributesToRename = {
    'class': 'className',
    'for': 'htmlFor'
};

// Transform a data attribute name to a valid dataset key name
// (See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset)
var dataAttributeToDatasetKey = function dataAttributeToDatasetKey (name) {
    var unprefixed = name.slice(prefixLength);
    return unprefixed.replace(/\-([a-z])/g, function (m, charAfterHyphen) {
        return charAfterHyphen.toUpperCase();
    });
};

var getDataset = function getDataset (tag) {
    var attributes = tag.attribs;
    if (typeof attributes === 'undefined' ||
        attributes === null ||
        Object.keys(attributes).length === 0) {
        return {};
    }

    var dataset = {};
    Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];
        if (!(/^data-/).test(name)) {
            return;
        }
        dataset[dataAttributeToDatasetKey(name)] = value;
    });

    return dataset;
};

var parseStyles = function(input) {
    var attributes = input.split(';');
    var styles = attributes.reduce(function(object, attribute){
        var entry = attribute.split(/:(.+)/);
        if (entry[0] && entry[1]) {
            object[entry[0].trim()] = entry[1].trim();
        }
        return object;
    },{});
    return styles;
};

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
            var dataset = getDataset(tag);
            var key;

            var attributes = {
                dataset: dataset
            };

            Object.keys(tag.attribs).forEach(function (name) {
                var value = tag.attribs[name];

                if (attributesToRename[name]) {
                    attributes[attributesToRename[name]] = value;
                    return;
                }
                if (attributesToDecode[name]) {
                    attributes[name] = decode(value);
                    return;
                }
                if (name === 'style') {
                    attributes[name] = parseStyles(value);
                    return;
                }
                attributes[name] = value;
            });

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
