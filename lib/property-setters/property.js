var decode = require('ent').decode;

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

var propertyValueConversions = {
    'style': parseStyles,
    'placeholder': decode,
    'title': decode,
    'alt': decode
};

var propertyIsTrue = function (propInfo, value) {
    if (propInfo.hasBooleanValue) {
        return  (value === '' || value.toLowerCase() === propInfo.attributeName);
    }
    else if (propInfo.hasOverloadedBooleanValue) {
        return (value === '');
    }
    return false;
};

var getPropertyValue = function (propInfo, value) {
    var isTrue = propertyIsTrue(propInfo, value);
    if (propInfo.hasBooleanValue) {
        return isTrue ? true : false;
    }
    else if (propInfo.hasOverloadedBooleanValue) {
        return isTrue ? true : value;
    }
    else if (propInfo.hasNumericValue || propInfo.hasPositiveNumericValue) {
        return Number(value);
    }
    else {
        return value;
    }
};

var setVNodeProperty = function (properties, propInfo, value) {
    var propName = propInfo.propertyName;
    var valueConverter;

    if (propName && propertyValueConversions.hasOwnProperty(propName)) {
        valueConverter = propertyValueConversions[propInfo.propertyName];
        value = valueConverter(value);
    }

    properties[propInfo.propertyName] = getPropertyValue(propInfo, value);
};

module.exports = {
    set: setVNodeProperty
};


