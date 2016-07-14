/*
    Adapted from https://github.com/facebook/react/blob/c265504fe2fdeadf0e5358879a3c141628b37a23/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
 */

var masks = require('./masks');

var MUST_USE_ATTRIBUTE = masks.MUST_USE_ATTRIBUTE;
var MUST_USE_PROPERTY = masks.MUST_USE_PROPERTY;

var HAS_BOOLEAN_VALUE = masks.HAS_BOOLEAN_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE = masks.HAS_OVERLOADED_BOOLEAN_VALUE;

var HAS_NUMERIC_VALUE = masks.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE = masks.HAS_POSITIVE_NUMERIC_VALUE;

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
        autocomplete: null,
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
    },
    PropertyToAttributeMapping: {
        'className': 'class',
        'htmlFor': 'for',
        'httpEquiv': 'http-equiv',
        'acceptCharset': 'accept-charset'
    }
};

module.exports = HTMLDOMPropertyConfig;
