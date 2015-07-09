var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('../../../../lib/html-to-vdom')(VNode, VText);

describe('html-to-vdom', function () {

    describe('when converting a single text node', function () {
        it('parses the text node correctly', function () {
            var html = 'test';

            var converted = convertHTML(html);
            converted.text.should.eql('test');
        });
    });

    describe('when converting multiple sibling nodes without a wrapper', function () {
        it('returns an array of vnodes', function () {
            var html = '<div id="foo"></div><div id="bar"></div>';

            var converted = convertHTML(html);
            converted.should.be.an('array');
            converted[0].properties.id.should.equal('foo');
            converted[1].properties.id.should.equal('bar');
        });

    });

    describe('when converting a tag', function () {
        it('parses a plain div correctly', function () {

            var html = '<div></div>';

            var converted = convertHTML(html);
            converted.tagName.should.equal('div');
        });
    });

    describe('when converting a tag containing text', function () {
        it('converts to a tag with a child VText node correctly', function () {
            var html = '<div>Test</div>';
            var converted = convertHTML(html);

            should.exist(converted.children);
            converted.children.length.should.eql(1);
            converted.children[0].text.should.eql('Test');
        });
    });

    describe('when converting a tag containing a child tag', function () {
        it('converts to a tag with a child node correctly', function () {
            var html = '<div class="parent"><span class="child"></span></div>';
            var converted = convertHTML(html);

            converted.tagName.should.eql('div');
            converted.properties.attributes.class.should.eql('parent');

            should.exist(converted.children);
            converted.children.length.should.eql(1);
            converted.children[0].tagName.should.eql('span');
            converted.children[0].properties.attributes.class.should.eql('child');
        });
    });

    describe('when converting a tag containing a child tag with text', function () {
        it('converts to a tag with a child node correctly', function () {
            var html = '<div class="parent"><span class="child">Test</span></div>';
            var converted = convertHTML(html);

            converted.tagName.should.eql('div');
            converted.properties.attributes.class.should.eql('parent');

            should.exist(converted.children);
            converted.children.length.should.eql(1);
            converted.children[0].tagName.should.eql('span');
            converted.children[0].properties.attributes.class.should.eql('child');

            converted.children[0].children[0].text.should.eql('Test');
        });
    });

    describe('when specifying a custom method for key', function () {
        it('sets key when specified via mapTagToKey', function () {
            var html = '<div id="key1">Test</div>';
            var converted = convertHTML({
                getVNodeKey: function (attribs) {
                    return attribs.id;
                }
            }, html);
            
            should.exist(converted.key);
            converted.key.should.eql('key1');
        });

        it('allows binding value of getVNodeKey in convertHTML', function(){

            var keyedConvertHTML = convertHTML.bind(null, {
                getVNodeKey: function (attribs) {
                    return attribs.id;
                }
            });

            var html = '<div id="key1">Test</div>';
            var converted = keyedConvertHTML(html);
            
            should.exist(converted.key);
            converted.key.should.eql('key1');
        });
    });


    describe('when converting HTML containing html entities', function () {
        it('converts them back to characters', function () {
            var html = '<span>&lt;a href&equals;&quot;foobar.com&quot;&gt;test&lt;&sol;a&gt;</span>';
            var converted = convertHTML(html);
            converted.tagName.should.eql('span');
            converted.children.length.should.eql(1);
            converted.children[0].text.should.eql('<a href="foobar.com">test</a>');
        });
    });

    describe('when converting HTML containing a script tag', function () {
        it('converts to a virtualdom node', function () {
            var html = '<div><script src="foo.js">alert("bar!");</script></div>';
            var converted = convertHTML(html);
            var script = converted.children[0];
            should.exist(script);
            script.tagName.should.eql('script');
            script.children.length.should.eql(1);
            script.children[0].text.should.eql('alert("bar!");');
        });
    });

    describe('when converting HTML containing a style tag', function () {
        it('converts to a virtualdom node', function () {
            var html = '<div><style>h1 {color:red;} p {color:blue;} </style></div>';
            var converted = convertHTML(html);
            var script = converted.children[0];
            should.exist(script);
            script.tagName.should.eql('style');
            script.children.length.should.eql(1);
            script.children[0].text.should.eql('h1 {color:red;} p {color:blue;} ');
        });
    });

    describe('when converting HTML containing CDATA', function () {
        it('returns an empty string instead (cdata is unsupported)', function () {
            var html = '<![CDATA[ Within this Character Data block I can\
                        use double dashes as much as I want (along with <, &, \', and ")\
                        *and* %MyParamEntity; will be expanded to the text\
                        "Has been expanded" ... however, I can\'t use\
                        the CEND sequence (if I need to use it I must escape one of the\
                        brackets or the greater-than sign).\
                        ]]>';
            var converted = convertHTML(html);
            converted.text.should.eql('');
        });
    });

    describe('when converting HTML containing a directive', function () {
        it('returns an empty string instead (directives are unsupported)', function () {
            var html = '<!DOCTYPE html>';
            var converted = convertHTML(html);
            converted.text.should.eql('');
        });
    });

    describe('when converting HTML containing a comment', function () {
        it('returns an empty string instead (comments are unsupported)', function () {
            var html = '<div><!-- some comment --></div>';
            var converted = convertHTML(html);
            var comment = converted.children[0];
            comment.text.should.eql('');
        });
    });
});
