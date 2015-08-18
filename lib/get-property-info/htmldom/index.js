/*
    Adapted from https://github.com/facebook/react/blob/c265504fe2fdeadf0e5358879a3c141628b37a23/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
 */

var masks = require('./masks');
var HTMLDOMPropertyConfig = require('./property-config');

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}


var getPropertyInfo = (function () {
    var propInfoByAttributeName = {};

    Object.keys(HTMLDOMPropertyConfig.Properties).forEach(function (propName) {
        var propConfig = HTMLDOMPropertyConfig.Properties[propName];
        var attributeName = HTMLDOMPropertyConfig.PropertyToAttributeMapping[propName] || propName.toLowerCase();

        var propertyInfo = {
            attributeName: attributeName,
            propertyName: propName,

            mustUseAttribute: checkMask(propConfig, masks.MUST_USE_ATTRIBUTE),
            mustUseProperty: checkMask(propConfig, masks.MUST_USE_PROPERTY),
            hasBooleanValue: checkMask(propConfig, masks.HAS_BOOLEAN_VALUE),
            hasNumericValue: checkMask(propConfig, masks.HAS_NUMERIC_VALUE),
            hasPositiveNumericValue: checkMask(propConfig, masks.HAS_POSITIVE_NUMERIC_VALUE),
            hasOverloadedBooleanValue: checkMask(propConfig, masks.HAS_OVERLOADED_BOOLEAN_VALUE)
        };

        propInfoByAttributeName[attributeName] = propertyInfo;
    });

    return function getPropertyInfo (attributeName) {
        var lowerCased = attributeName.toLowerCase();
        var propInfo;

        if (propInfoByAttributeName.hasOwnProperty(lowerCased)) {
            propInfo = propInfoByAttributeName[lowerCased];
        }
        else {
            propInfo = {
                attributeName: attributeName,
                mustUseAttribute: true,
                isCustomAttribute: true
            };
        }

        return propInfo;
    };
})();

module.exports = getPropertyInfo;
