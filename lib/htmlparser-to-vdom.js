var decode = require('ent').decode;
var _ = require('lodash');

var prefixLength = ('data-').length;

var attributesToDecode = {
    'placeholder': true,
    'title': true,
    'alt': true
};

var attributesToRename = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex'
};

var getDataset = function getDataset (tag) {
    var attributes = tag.attribs;
    if (_.isEmpty(attributes)) {
        return {};
    }

    var dataset = {};
    _.each(attributes, function (value, name) {
        if (!(/^data-/).test(name)) {
            return;
        }
        var unprefixed = name.slice(prefixLength);
        dataset[unprefixed] = value;
    });

    return dataset;
};

var parseStyles = function(input) {
    var attributes = input.split(';');
    var styles = _.reduce(attributes, function(object, attribute) {
        var entry = attribute.split(/:(.+)/);
        if (entry[0] && entry[1]) {
            object[entry[0].trim()] = entry[1].trim();
        }
        return object;
    }, {});
    return styles;
};

module.exports = function createConverter (VNode, VText) {
    var converter = {
        convert: function (node) {
            if (node.type === 'tag') {
                return converter.convertTag(node);
            }
            else if (node.type === 'text') {
                return new VText(decode(node.data));
            }
        },
        convertTag: function (tag) {
            var dataset = getDataset(tag);

            var attributes = {
                dataset: dataset
            };
            _.each(tag.attribs, function (value, name) {
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

            var children = _.map(tag.children, converter.convert);

            return new VNode(tag.name, attributes, children);
        }
    };
    return converter;
};
