var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('../../index')({
    VNode: VNode,
    VText: VText
});

describe('htmlparser-to-vdom', function () {

    describe('when converting a single text node', function () {
        it('parses the text node correctly', function () {
            var html = 'test';

            var converted = convertHTML(html);
            converted.text.should.eql('test');
        });
    });

    describe('when converting multiple sibling nodes without a wrapper', function () {
        it('throws', function () {
            var html = '    <div></div>';

            should.throw(convertHTML.bind(null, html), 'Input must always have only one root node. You cannot convert multiple siblings without a wrapping tag around them.');
        });

    });

    describe('when converting a tag', function () {
        it('parses a plain div correctly', function () {

            var html = '<div></div>';

            var converted = convertHTML(html);
            converted.tagName.should.equal('div');
        });

        it('parses a div with an ID correctly', function () {

            var html = '<div id="test"></div>';

            var converted = convertHTML(html);
            converted.properties.id.should.equal('test');
        });

        it('parses a div with classes correctly', function () {

            var html = '<div class="foo bar"></div>';

            var converted = convertHTML(html);
            converted.properties.className.should.equal('foo bar');
        });

        it('parses an input with tabIndex correctly', function () {

            var html = '<input tabIndex="1"></input>';

            var converted = convertHTML(html);
            converted.properties.tabIndex.should.equal('1');
        });

        it('parses a div with 1 style correctly', function () {

            var html = '<div style="top: -7px;"></div>';
            var styles = {
                top: '-7px'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with 1 style without trailing semicolon correctly', function () {

            var html = '<div style="top: -7px"></div>';
            var styles = {
                top: '-7px'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with styles correctly', function () {

            var html = '<div style="top: -7px; left: -6px; background: rgb(0,0,132);"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with styles without trailing semicolon correctly', function () {

            var html = '<div style="top: -7px; left: -6px; background: rgb(0,0,132)"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with styles correctly when spaces are missing', function () {

            var html = '<div style="top:-7px;left:-6px;background:rgb(0,0,132);"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with styles correctly when spaces are abundant', function () {

            var html = '<div style="   top:  -7px  ;    left :  -6px ;   background :  rgb( 0 , 0 , 132 )  ;  "></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb( 0 , 0 , 132 )'
            };

            var converted = convertHTML(html);
            converted.properties.style.should.deep.equal(styles);
        });

        it('parses a div with camel case attribute correctly', function () {

            var html = '<div fooBar="hi"></div>';

            var converted = convertHTML(html);
            converted.properties.fooBar.should.equal('hi');
        });

    });

    describe('when converting a tag with data attributes', function () {
        it('converts a single data attribute correctly', function () {

            var html = '<div data-test="foobar"></div>';

            var converted = convertHTML(html);

            should.exist(converted.properties.dataset.test);
            converted.properties.dataset.test.should.eql('foobar');

            should.exist(converted.properties['data-test']);
            converted.properties['data-test'].should.eql('foobar');
        });

        it('converts a single hyphenated data attribute correctly', function () {

            var html = '<div data-test-data="foobar"></div>';

            var converted = convertHTML(html);

            should.exist(converted.properties.dataset.testData);
            converted.properties.dataset.testData.should.eql('foobar');

            should.exist(converted.properties['data-test-data']);
            converted.properties['data-test-data'].should.eql('foobar');

        });

         it('converts multiple data attributes correctly', function () {

            var html = '<div data-test="foobar" data-foobar="test"></div>';

            var converted = convertHTML(html);

            should.exist(converted.properties.dataset.test);
            converted.properties.dataset.test.should.eql('foobar');

            should.exist(converted.properties['data-test']);
            converted.properties['data-test'].should.eql('foobar');

            should.exist(converted.properties.dataset.foobar);
            converted.properties.dataset.foobar.should.eql('test');

            should.exist(converted.properties['data-foobar']);
            converted.properties['data-foobar'].should.eql('test');
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
            converted.properties.className.should.eql('parent');

            should.exist(converted.children);
            converted.children.length.should.eql(1);
            converted.children[0].tagName.should.eql('span');
            converted.children[0].properties.className.should.eql('child');
        });
    });

    describe('when converting a tag containing a child tag with text', function () {
        it('converts to a tag with a child node correctly', function () {
            var html = '<div class="parent"><span class="child">Test</span></div>';
            var converted = convertHTML(html);

            converted.tagName.should.eql('div');
            converted.properties.className.should.eql('parent');

            should.exist(converted.children);
            converted.children.length.should.eql(1);
            converted.children[0].tagName.should.eql('span');
            converted.children[0].properties.className.should.eql('child');

            converted.children[0].children[0].text.should.eql('Test');
        });
    });

    describe('when specifying a custom method for key', function () {
        it('sets key when specified via mapTagToKey', function () {
            var keyedConvertHTML = require('../../index')({
                VNode: VNode,
                VText: VText
            });

            var html = '<div id="key1">Test</div>';
            var converted = keyedConvertHTML({
                getVNodeKey: function (attribs) {
                    return attribs.id;
                }}, html);
            
            should.exist(converted.key);
            converted.key.should.eql('key1');
        });

        it('allows binding value of getVNodeKey in convertHTML', function(){
            var keyedConvertHTML = require('../../index')({
                VNode: VNode,
                VText: VText
            });

            keyedConvertHTML = keyedConvertHTML.bind(null, {
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

    describe('when converting a label containing the `for` attribute', function () {
        it('sets the htmlFor attribute correspondingly', function () {
            var html = '<label for="foobar"></label>';
            var converted = convertHTML(html);
            should.exist(converted.properties.htmlFor);
            converted.properties.htmlFor.should.eql('foobar');
        });
    });

    describe('when converting a label not containing the `for` attribute', function () {
        it('does not set the htmlFor attribute correspondingly', function () {
            var html = '<label></label>';
            var converted = convertHTML(html);
            should.not.exist(converted.properties.htmlFor);
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

    describe('when converting HTML containing html entities in placeholder, alt or title', function () {
        it('converts them to characters', function () {
            var html = '<input type="text" placeholder="&quot;test&quot;" alt="&quot;test&quot;" title="&quot;test&quot;">';
            var converted = convertHTML(html);
            converted.tagName.should.eql('input');
            converted.properties.placeholder.should.eql('"test"');
            converted.properties.alt.should.eql('"test"');
            converted.properties.title.should.eql('"test"');
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
