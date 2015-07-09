var convertTagAttributes = require('../../../../lib/convert-tag-attributes');
var parseHTML = require('../../../../lib/parse-html');

describe('convertTagAttributes', function () {
    describe('when dealing with naming difference edge cases', function () {
        it('sets class correctly as attribute', function () {
            var tag = parseHTML('<input class="foo bar"/>')[0];

            var converted = convertTagAttributes(tag);
            converted.should.eql({
                attributes: {
                    'class': 'foo bar'
                }
            });
        });

        it('sets for correctly as the htmlFor property', function () {
            var tag = parseHTML('<label for="foo"/>')[0];

            var converted = convertTagAttributes(tag);
            converted.should.eql({
                htmlFor: 'foo',
                attributes: {}
            });
        });

        it('sets accept-charset correctly as the acceptCharset property', function () {
            var tag = parseHTML('<form accept-charset="ISO-8859-1"></form>')[0];
            var converted = convertTagAttributes(tag);
            converted.should.eql({
                acceptCharset: 'ISO-8859-1',
                attributes: {}
            });
        });

        it('sets http-equiv correctly as the httpEquiv property', function () {
            var tag = parseHTML('<meta http-equiv="refresh">')[0];

            var converted = convertTagAttributes(tag);
            converted.should.eql({
                httpEquiv: 'refresh',
                attributes: {}
            });
        });
    });
});
