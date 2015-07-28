var getPropertyInfo = require('./get-property-info/htmldom');
var propertySetters = require('./property-setters');

var getPropertySetter = function (propInfo) {
    if (propInfo.mustUseAttribute) {
        return propertySetters.attribute;
    }
    else {
        // Anything we don't set as an attribute is treated as a property
        return propertySetters.property;
    }
};

var convertTagAttributes = function (tag) {
    var attributes = tag.attribs;

    var vNodeProperties = {
        attributes: {}
    };

    Object.keys(attributes).forEach(function (attributeName) {
        var value = attributes[attributeName];
        var propInfo = getPropertyInfo(attributeName);

        var propertySetter = getPropertySetter(propInfo);
        propertySetter.set(vNodeProperties, propInfo, value);
    });

    return vNodeProperties;
};

module.exports = convertTagAttributes;
