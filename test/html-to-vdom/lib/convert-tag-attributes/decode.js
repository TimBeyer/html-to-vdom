var convertTagAttributes = require('../../../../lib/convert-tag-attributes');
var parseHTML = require('../../../../lib/parse-html');

describe('convertTagAttributes', function () {
    describe('when dealing with attributes that need html entity decoding', function () {
        it('decodes them', function () {
            var tag = parseHTML('<div title="&auml;" placeholder="&uuml;" alt="&ouml;"></div>')[0];

            var converted = convertTagAttributes(tag);
            converted.should.eql({
                title: 'ä',
                placeholder: 'ü',
                alt: 'ö',
                attributes: {}
            });
        });
    });
});
