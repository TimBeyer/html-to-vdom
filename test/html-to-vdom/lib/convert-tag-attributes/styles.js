var convertTagAttributes = require('../../../../lib/convert-tag-attributes');
var parseHTML = require('../../../../lib/parse-html');

describe('convertTagAttributes', function () {
    describe('when dealing with style attributes', function () {
        it('parses a div with 1 style correctly', function () {

            var html = '<div style="top: -7px;"></div>';
            var styles = {
                top: '-7px'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });

        it('parses a div with 1 style without trailing semicolon correctly', function () {

            var html = '<div style="top: -7px"></div>';
            var styles = {
                top: '-7px'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });

        it('parses a div with styles correctly', function () {

            var html = '<div style="top: -7px; left: -6px; background: rgb(0,0,132);"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });

        it('parses a div with styles without trailing semicolon correctly', function () {

            var html = '<div style="top: -7px; left: -6px; background: rgb(0,0,132)"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });

        it('parses a div with styles correctly when spaces are missing', function () {

            var html = '<div style="top:-7px;left:-6px;background:rgb(0,0,132);"></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb(0,0,132)'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });

        it('parses a div with styles correctly when spaces are abundant', function () {

            var html = '<div style="   top:  -7px  ;    left :  -6px ;   background :  rgb( 0 , 0 , 132 )  ;  "></div>';
            var styles = {
                top: '-7px',
                left: '-6px',
                background: 'rgb( 0 , 0 , 132 )'
            };

            var converted = convertTagAttributes(parseHTML(html)[0]);
            converted.should.eql({
                attributes: {},
                style: styles
            });
        });
    });
});
