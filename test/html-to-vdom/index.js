var convertHTML = require('../../lib/html-to-vdom');

describe('htmlparser-to-vdom', function () {

    describe('when converting a tag', function () {

        it('parses a plain div correctly', function () {

            var html = '<div></div>';

            var converted = convertHTML(html)
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
    })
});
