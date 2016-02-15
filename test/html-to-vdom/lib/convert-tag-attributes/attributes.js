var convertTagAttributes = require('../../../../lib/convert-tag-attributes');
var parseHTML = require('../../../../lib/parse-html');

describe('convertTagAttributes', function () {
    describe('when dealing with attributes that need to be set as attributes on the DOM node', function () {
        describe('when converting boolean standard attributes', function () {
            it('sets a the attribute to the empty string', function () {
                var tag = parseHTML('<input seamless disabled="disabled" />')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    attributes: {
                        seamless: '',
                        disabled: ''
                    }
                });
            });
        });

        describe('when converting non-boolean standard attributes', function () {
            it('sets them', function () {
                var tag = parseHTML('<input width="10" />')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    attributes: {
                        width: '10'
                    }
                });
            });
        });

        describe('when converting non-standard attributes', function () {
            it('sets them', function () {
                var tag = parseHTML('<input aria-labelledby="foobar" data-foo="bar" custom-thing="baz" fooBar="barFoo" />')[0];

                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    attributes: {
                        'aria-labelledby': 'foobar',
                        'data-foo': 'bar',
                        'custom-thing': 'baz',
                        'fooBar': 'barFoo'
                    }
                });
            });
        });

        describe('when converting an svg', function() {
            
            it('sets them', function() {
                var tag = parseHTML('<svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="180.903" width="220.34801" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" />')[0];
                
                var converted = convertTagAttributes(tag);
                converted.should.eql({
                    attributes: {
                        'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                        'xmlns': 'http://www.w3.org/2000/svg',
                        'xml:space': 'preserve',
                        'height': '180.903',
                        'width': '220.34801',
                        'version': '1.1',
                        'xmlns:cc': 'http://creativecommons.org/ns#',
                        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
                    }
                });

            });

        });

    });

});
