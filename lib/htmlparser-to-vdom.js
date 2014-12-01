var VNode = require('vtree/vnode');
var VText = require('vtree/vtext');
var decode = require('ent').decode;
var _ = require('lodash');

var prefixLength = ('data-').length;

var attributesToExclude = ['class', 'for'];
var attributesToDecode = ['placeholder', 'title', 'alt'];

var getDataset = function getDataset (tag) {
    var attributes = tag.attribs;
    if (_.isEmpty(attributes)) {
        return {};
    }
    var attributeNames = Object.keys(attributes);
    var dataAttributeNames = _.filter(attributeNames, function (name) {
        return (/^data-/).test(name);
    });

    if (_.isEmpty(dataAttributeNames)) {
        return {};
    }

    var unprefixedDataAttributeNames = _.map(dataAttributeNames, function (name) {
        return name.slice(prefixLength);
    });
    

    var dataAttributeValues = _.map(dataAttributeNames, function (name) {
        return attributes[name];
    });

    var dataset = _.zipObject(unprefixedDataAttributeNames, dataAttributeValues);

    return dataset;
};

var getClassName = function getClassName (tag) {
    var hasClass = !_.isEmpty(tag.attribs) && !_.isEmpty(tag.attribs.class);
    return hasClass ? tag.attribs.class : '';
};

var getHtmlForAttribute = function getHtmlForAttribute (tag) {
    var hasFor = !_.isEmpty(tag.attribs) && !_.isEmpty(tag.attribs['for']);
    return hasFor ? tag.attribs['for'] : undefined;
};

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

        var attribsToCopy = _.omit(tag.attribs, attributesToExclude);
        var attribsToCopy = _.extend(attribsToCopy, _.mapValues(_.pick(attribsToCopy, attributesToDecode), decode))

        var extraAttributes = {
            dataset: dataset,
            className: getClassName(tag),
            htmlFor: getHtmlForAttribute(tag)
        };

        var attributes = _.extend({}, attribsToCopy, extraAttributes);

        var children = _.map(tag.children, converter.convert);

        return new VNode(tag.name, attributes, children);
    }
};

module.exports = converter;