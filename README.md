html-to-vdom [![Build Status](https://travis-ci.org/TimBeyer/html-to-vdom.svg?branch=master)](https://travis-ci.org/TimBeyer/html-to-vdom)
============

About
-----

This is yet another library to convert HTML into a [vtree](https://github.com/Matt-Esch/vtree).
It's used in conjunction with [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to convert template based views into `virtual-dom` views.


Usage
-----

```javascript

var convertHTML = require('html-to-vdom');
var html = '<div>Foobar</div>';

convertHTML(html).then(function (vTree) { 
    // do something with your tree
    var createElement = require('virtual-dom/create-element');
    var el = createElement(vTree);
    document.body.appendChild(el);
});
```

