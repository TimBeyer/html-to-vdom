var convertTagAttributes = require('../../../../lib/convert-tag-attributes');
var parseHTML = require('../../../../lib/parse-html');

describe('convertTagAttributes', function () {
    describe('when dealing with attributes that need to be set as properties on the DOM node', function () {
        
        describe('when converting true boolean standard attributes', function () {
            it('sets the property to true', function () {
                var tag = parseHTML('<input readonly muted="muted"/>')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    readOnly: true,
                    muted: true,
                    attributes: {}
                });
            });
        });

        describe('when converting numeric attributes', function () {
            it('sets the properties to numbers', function () {
                var tag = parseHTML('<ol start="10"></ol>')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    start: 10,
                    attributes: {}
                });
            });
        });

        describe('when converting overloaded boolean attributes', function () {
            it('sets the property to true if the value is an empty string', function () {
                var tag = parseHTML('<a href="/foo.pdf" download></a>')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    href: '/foo.pdf',
                    download: true,
                    attributes: {}
                });
            });

            it('sets the property to a string if the value is anything else', function () {
                var tag = parseHTML('<a href="/foo.pdf" download="bar.pdf"></a>')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    href: '/foo.pdf',
                    download: 'bar.pdf',
                    attributes: {}
                });
            });
        });
    });
});
