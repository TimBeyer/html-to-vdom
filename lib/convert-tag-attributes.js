/*
    Adapted from https://github.com/facebook/react/blob/c265504fe2fdeadf0e5358879a3c141628b37a23/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
 */
var decode = require('ent').decode;

var MUST_USE_ATTRIBUTE = 0x1;
var MUST_USE_PROPERTY = 0x2;
var HAS_BOOLEAN_VALUE = 0x8;
var HAS_NUMERIC_VALUE = 0x10;
var HAS_POSITIVE_NUMERIC_VALUE = 0x20 | 0x10;
var HAS_OVERLOADED_BOOLEAN_VALUE = 0x40;

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var isCustomAttribute = RegExp.prototype.test.bind(
    /^(data|aria)-[a-z_][a-z\d_.\-]*$/
);

var HTMLDOMPropertyConfig = {
  
  Properties: {
    /**
     * Standard Properties
     */
    accept: null,
    acceptCharset: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    challenge: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    classID: MUST_USE_ATTRIBUTE,
    // To set className on SVG elements, it's necessary to use .setAttribute;
    // this works on HTML elements too in all browsers except IE8.
    className: MUST_USE_ATTRIBUTE,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    coords: null,
    crossOrigin: null,
    data: null, // For `<object />` acts as `src`.
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formAction: MUST_USE_ATTRIBUTE,
    formEncType: MUST_USE_ATTRIBUTE,
    formMethod: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: MUST_USE_ATTRIBUTE,
    frameBorder: MUST_USE_ATTRIBUTE,
    headers: null,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    high: null,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    is: MUST_USE_ATTRIBUTE,
    keyParams: MUST_USE_ATTRIBUTE,
    keyType: MUST_USE_ATTRIBUTE,
    label: null,
    lang: null,
    list: MUST_USE_ATTRIBUTE,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    low: null,
    manifest: MUST_USE_ATTRIBUTE,
    marginHeight: null,
    marginWidth: null,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    media: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    minLength: MUST_USE_ATTRIBUTE,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: null,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: null,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: null,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    sizes: MUST_USE_ATTRIBUTE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: MUST_USE_ATTRIBUTE,
    start: HAS_NUMERIC_VALUE,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    useMap: null,
    value: MUST_USE_PROPERTY,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,

    /**
     * Non-standard Properties
     */
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: null,
    autoCorrect: null,
    // itemProp, itemScope, itemType are for
    // Microdata support. See http://schema.org/docs/gs.html
    itemProp: MUST_USE_ATTRIBUTE,
    itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    itemType: MUST_USE_ATTRIBUTE,
    // itemID and itemRef are for Microdata support as well but
    // only specified in the the WHATWG spec document. See
    // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
    itemID: MUST_USE_ATTRIBUTE,
    itemRef: MUST_USE_ATTRIBUTE,
    // property is supported for OpenGraph in meta tags.
    property: null,
    // IE-only attribute that controls focus behavior
    unselectable: MUST_USE_ATTRIBUTE
  }
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

var propertyToAttributeMapping = {
    'className': 'class',
    'htmlFor': 'for',
    'httpEquiv': 'http-equiv',
    'acceptCharset': 'accept-charset'
};

var propertyValueConversions = {
    'style': parseStyles,
    'placeholder': decode,
    'title': decode,
    'alt': decode
};

var getPropertyInfo = (function () {
    var propInfoByAttributeName = {};

    Object.keys(HTMLDOMPropertyConfig.Properties).forEach(function (propName) {
        var propConfig = HTMLDOMPropertyConfig.Properties[propName];
        var attributeName = propertyToAttributeMapping[propName] || propName.toLowerCase();

        var propertyInfo = {
            attributeName: attributeName,
            propertyName: propName,

            mustUseAttribute: checkMask(propConfig, MUST_USE_ATTRIBUTE),
            mustUseProperty: checkMask(propConfig, MUST_USE_PROPERTY),
            hasBooleanValue: checkMask(propConfig, HAS_BOOLEAN_VALUE),
            hasNumericValue: checkMask(propConfig, HAS_NUMERIC_VALUE),
            hasPositiveNumericValue:
            checkMask(propConfig, HAS_POSITIVE_NUMERIC_VALUE),
            hasOverloadedBooleanValue:
            checkMask(propConfig, HAS_OVERLOADED_BOOLEAN_VALUE),
        };

        propInfoByAttributeName[attributeName] = propertyInfo;
    });

    return function (attributeName) {
        return propInfoByAttributeName[attributeName];
    };
})();


var convertTagAttributes = function (tag) {
    var attributes = tag.attribs;

    var vdomProperties = {
        attributes: {}
    };

    Object.keys(attributes).forEach(function (attributeName) {
        var lowerCased = attributeName.toLowerCase();
        var propInfo = getPropertyInfo(lowerCased);

        var value = attributes[attributeName];
        if (isCustomAttribute(attributeName) || !propInfo) {
            vdomProperties.attributes[attributeName] = value;
            return;
        }
        
        var valueConverter = propertyValueConversions[propInfo.propertyName];
        if (valueConverter) {
            value = valueConverter(value);
        }

        if (propInfo.mustUseAttribute) {
            if (propInfo.hasBooleanValue) {
                // Boolean attributes come in as an empty string or the 
                vdomProperties.attributes[propInfo.attributeName] = '';
            }
            else {
                vdomProperties.attributes[propInfo.attributeName] = value;
            }
        }
        // Anything we don't set as an attribute is treated as a property
        else {
            var isTrue;
            if (propInfo.hasBooleanValue) {
                isTrue = (value === '' || value.toLowerCase() === propInfo.attributeName);
                vdomProperties[propInfo.propertyName] = isTrue ? true : false;
            }
            else if (propInfo.hasOverloadedBooleanValue) {
                isTrue = (value === '');
                vdomProperties[propInfo.propertyName] = isTrue ? true : value;
            }
            else if (propInfo.hasNumericValue || propInfo.hasPositiveNumericValue) {
                vdomProperties[propInfo.propertyName] = Number(value);
            }
            else {
                vdomProperties[propInfo.propertyName] = value;
            }
        }

    });

    return vdomProperties;
};

module.exports = convertTagAttributes;
