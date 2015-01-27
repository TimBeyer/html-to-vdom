html-to-vdom [![Build Status](https://travis-ci.org/TimBeyer/html-to-vdom.svg?branch=master)](https://travis-ci.org/TimBeyer/html-to-vdom)
============

About
-----

This is yet another library to convert HTML into a [vtree](https://github.com/Matt-Esch/vtree).
It's used in conjunction with [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to convert template based views into `virtual-dom` views.

Note
----

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

Thanks to [@mattferrin](https://github.com/mattferrin) for noticing that promises could be removed from the API and contributing a PR to do so.  
Thanks to [@tiagorg](https://github.com/tiagorg) for contributing a PR for style attribute parsing.
