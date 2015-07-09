html-to-vdom [![Build Status](https://travis-ci.org/TimBeyer/html-to-vdom.svg?branch=master)](https://travis-ci.org/TimBeyer/html-to-vdom) [![Coverage Status](https://coveralls.io/repos/TimBeyer/html-to-vdom/badge.svg?branch=master&service=github)](https://coveralls.io/github/TimBeyer/html-to-vdom?branch=master)
============

About
-----

This is yet another library to convert HTML into a [vtree](https://github.com/Matt-Esch/vtree).
It's used in conjunction with [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to convert template based views into `virtual-dom` views.

Note
----

As of v0.7.0, HTML attribute parsing has been improved by using [React's list of attributes and properties](https://github.com/facebook/react/blob/c265504fe2fdeadf0e5358879a3c141628b37a23/src/renderers/dom/shared/HTMLDOMPropertyConfig.js) to decide what to set on the VNode. This means that you should experience better compatibility and full support for HTML5. Custom attributes are also no longer lower cased automatically. Inline SVG is not yet supported, but will be worked on for the next version.

As of v0.6.0, converting sibling nodes without an enclosing parent tag returns an array of type `VNode` instead of throwing an error

As of v0.5.1, `html-to-vdom` no longer supports browsers without a full ES5 implementation.

As of v0.3.0, the VNode and VText classes need to be passed in during library initialization from the `virtual-dom` module you are using.  
This is to reduce incompatibilties you might have due to depending on a different version of `virtual-dom` than the one this library would use. 

Usage
-----

```javascript
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

var html = '<div>Foobar</div>';

var vtree = convertHTML(html);
var createElement = require('virtual-dom/create-element');
var el = createElement(vTree);
document.body.appendChild(el);
```

#### Specifying a key
In order for `virtual-dom` to detect moves it needs a key. To specify your own custom method of finding a key pass in a method that takes the current tag and returns the key.

```javascript
var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

convertHTML({
    getVNodeKey: function (attributes) {
        return attributes.id;
    }
}, '<div id="foo"></div>');
```

If you have a single key method you can also pass the options first, allowing you to create a single bound method for all key lookups:

```javascript
var convertHTMLWithKey = convertHTML.bind(null, {
    getVNodeKey: function (attributes) {
        return attributes.id;
    }   
});

convertHTMLWithKey('<div id="foo"></div>');
```

Credits
-------

Thanks to:  
* [@nkzawa](https://github.com/nkzawa) for making me aware of attribute lowercasing problems and submitting a PR to fix it
* [@mattferrin](https://github.com/mattferrin) for noticing that promises could be removed from the API and contributing a PR to do so
* [@tiagorg](https://github.com/tiagorg) for contributing a PR for style attribute parsing
* [@dariusriggins](https://github.com/dariusriggins) for adding VNode key support
* [@jsyang](https://github.com/jsyang) for removing the `lodash` dependency for a leaner build and [improved performance](http://jsperf.com/html-to-vdom-lodash-vs-native)
* [@bregenspan](https://github.com/bregenspan) for making the dataset conversion standards-compliant
* [@jesseditson](https://github.com/jesseditson) for adding `<script>` and `<style>` tag support and contributing to achieve better attribute/property handling
