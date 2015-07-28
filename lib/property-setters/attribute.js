var getAttributeValue = function (propInfo, value) {
    if (propInfo.hasBooleanValue) {
        return '';
    }
    else {
        return value;
    }
};

var setVNodeAttribute = function (properties, propInfo, value) {
    properties.attributes[propInfo.attributeName] = getAttributeValue(propInfo, value);
};

module.exports = {
    set: setVNodeAttribute
};
