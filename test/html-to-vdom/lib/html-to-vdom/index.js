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
            var html = ['<![CDATA[ Within this Character Data block I can',
                        'use double dashes as much as I want (along with <, &, \', and ")',
                        '*and* %MyParamEntity; will be expanded to the text',
                        '"Has been expanded" ... however, I can\'t use',
                        'the CEND sequence (if I need to use it I must escape one of the',
                        'brackets or the greater-than sign).',
                        ']]>'].join(' ');
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
    
    describe('when converting an svg tag', function () {
        it('converts to the fill tag correctly', function () {
            var html = '<svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" height="180.903" width="220.34801" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">' + 
                           '<metadata>' + 
                                '<rdf:RDF>' + 
                                    '<cc:Work rdf:about="">' + 
                                        '<dc:format>image/svg+xml</dc:format>' + 
                                        '<dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>' + 
                                        '<dc:title/>' + 
                                    '</cc:Work>' + 
                                '</rdf:RDF>' +
                           '</metadata>' + 
                           '<path fill="#000" d="M103.21875,4.53125c-2.30185,0-4.1696,0.7489-5.625,2.28125-1.4554,1.5333-2.1875,3.6656-2.1875,6.375,0,1.4326,0.31335,2.7781,0.9375,4.0625s1.5397,2.32055,2.75,3.0625,2.58791,1.09375,4.125,1.09375c1.41835,0,2.74325-0.32835,3.96875-1s2.17495-1.66155,2.84375-2.96875c0.66786-1.30625,1-2.7826,1-4.4375,0-1.6321-0.33414-3.0868-0.96875-4.375-0.63555-1.2882-1.53969-2.31115-2.75-3.03125-1.2103-0.7201-2.5861-1.0625-4.09375-1.0625zm0.03125,1.84375c1.07636,0,2.04079,0.2672,2.90625,0.8125,0.86544,0.5453,1.5194,1.32165,1.96875,2.3125,0.44934,0.99085,0.6875,2.14065,0.6875,3.46875,0,2.10045-0.54305,3.73215-1.59375,4.875-1.05164,1.14285-2.3736,1.71875-4,1.71875-1.596,0-2.9417-0.5551-4-1.6875s-1.59375-2.68975-1.59375-4.65625c0-2.45575,0.5533-4.2315,1.65625-5.28125s2.43925-1.5625,3.96875-1.5625zm80.75,7.21875c-1.4383,0-2.77175,0.3426-3.96875,1-1.19794,0.6574-2.1021,1.6077-2.75,2.875-0.64885,1.26635-0.96875,2.73605-0.96875,4.4375,0,1.5599,0.269,3.0468,0.84375,4.40625s1.4302,2.3765,2.53125,3.09375,2.52375,1.09375,4.28125,1.09375c1.69765,0,3.13735-0.47335,4.3125-1.40625,1.1742-0.93195,1.9853-2.286,2.4375-4.0625l-2.1875-0.5625c-0.2964,1.37275-0.85055,2.42675-1.6875,3.125s-1.85505,1.03125-3.0625,1.03125c-0.9918,0-1.93005-0.23795-2.78125-0.75s-1.4722-1.30825-1.875-2.34375c-0.4047-1.0355-0.59375-2.23705-0.59375-3.625,0-1.07635,0.15895-2.11135,0.5-3.125s0.93955-1.83615,1.78125-2.4375,1.8729-0.90625,3.125-0.90625c1.0887,0,1.9996,0.271,2.71875,0.8125,0.71725,0.5415,1.2791,1.40625,1.65625,2.59375l2.125-0.5c-0.437-1.5086-1.2313-2.66685-2.34375-3.5-1.1115-0.8322-2.4626-1.25-4.09375-1.25zm9.46875,0.28125,0,16.34375,2.15625,0,0-7.71875,8.4375,0,0,7.71875,2.1875,0,0-16.34375-2.1875,0,0,6.71875-8.4375,0,0-6.71875-2.15625,0zm17.1875,8.3125c-0.96995,0-1.78486,0.2899-2.4375,0.84375-0.65076,0.5548-1.06665,1.33485-1.25,2.34375l1.5,0.25c0.11115-0.73625,0.35955-1.2867,0.75-1.65625,0.39045-0.3686,0.8826-0.53125,1.46875-0.53125,0.59185,0,1.06225,0.17025,1.4375,0.53125,0.37335,0.36005,0.5625,0.82495,0.5625,1.375,0,0.69445-0.2692,1.1978-0.78125,1.53125-0.51395,0.3325-1.0775,0.5-1.71875,0.5-0.06175,0-0.1493-0.01985-0.25-0.03125l-0.15625,1.34375c0.42465-0.11115,0.77655-0.1875,1.0625-0.1875,0.6992,0,1.2656,0.24005,1.71875,0.6875,0.45315,0.4484,0.6875,0.99685,0.6875,1.6875,0,0.72295-0.2314,1.3545-0.71875,1.84375-0.4864,0.48925-1.0962,0.71875-1.8125,0.71875-0.6023,0-1.11515-0.1863-1.53125-0.5625-0.4142-0.37525-0.7002-0.99255-0.875-1.84375l-1.5,0.21875c0.09975,1.0165,0.50625,1.82845,1.21875,2.46875,0.7106,0.6403,1.61115,0.96875,2.6875,0.96875,1.1932,0,2.1566-0.38115,2.9375-1.125,0.7809-0.7429,1.1875-1.65,1.1875-2.71875,0-0.7904-0.19-1.4434-0.59375-1.96875-0.4028-0.52725-0.99485-0.86405-1.71875-1.03125,0.5567-0.2565,0.9972-0.59805,1.28125-1.03125s0.40625-0.9093,0.40625-1.4375c0-0.55575-0.1392-1.09975-0.4375-1.59375s-0.71885-0.8703-1.28125-1.15625c-0.56145-0.2869-1.174-0.4375-1.84375-0.4375zm-111.0625,1.375,0,27.40625-19.71875,11.40625,0.8125,1.40625,22.5-13,31.84375,18.375,0,36.75-22.53125,13.03125,0.8125,1.375,22.59375-13.0625,26.125,8.5,0.53125-1.53125-25.875-8.4375,0-36.53125,25.875-8.40625-0.53125-1.53125-26.125,8.5-29.0625-16.78125,0-27.46875-1.59375,0,0,26.53125-2.0625-1.1875-2,1.15625,0-26.5-1.59375,0zm79.5,8.125-4.78125,14.75,1.5,0.53125,4.8125-14.8125-1.53125-0.46875zm-142.9375,10.5625c-1.4383,0-2.77175,0.31135-3.96875,0.96875-1.19795,0.6574-2.10115,1.63895-2.75,2.90625-0.64885,1.26635-1,2.73605-1,4.4375,0,1.5599,0.30025,3.01555,0.875,4.375s1.39895,2.40775,2.5,3.125,2.555,1.0625,4.3125,1.0625c1.69765,0,3.13735-0.47335,4.3125-1.40625,1.1742-0.93195,1.9853-2.286,2.4375-4.0625l-2.1875-0.53125c-0.2964,1.3737-0.85055,2.3955-1.6875,3.09375s-1.85505,1.0625-3.0625,1.0625c-0.99275,0-1.9291-0.2692-2.78125-0.78125s-1.47125-1.277-1.875-2.3125-0.59375-2.23705-0.59375-3.625c0-1.07635,0.15895-2.1426,0.5-3.15625s0.9405-1.8049,1.78125-2.40625c0.8417-0.60135,1.8729-0.90625,3.125-0.90625,1.0887,0,1.9996,0.271,2.71875,0.8125,0.7182,0.5415,1.27815,1.40625,1.65625,2.59375l2.125-0.5c-0.437-1.5086-1.2313-2.66685-2.34375-3.5-1.1115-0.8322-2.4626-1.25-4.09375-1.25zm-30.65625,0.28125,0,16.3125,2.1875,0,0-7.6875,8.4375,0,0,7.6875,2.15625,0,0-16.3125-2.15625,0,0,6.6875-8.4375,0,0-6.6875-2.1875,0zm159.75,7.15625,0,16.34375,2.09375,0,0-12.8125,8.53125,12.8125,2.25,0,0-16.34375-2.09375,0,0,12.8125-8.5625-12.8125-2.21875,0zm-142.15625,1.15625c-0.96995,0-1.7858,0.25865-2.4375,0.8125-0.6517,0.5548-1.06665,1.33485-1.25,2.34375l1.5,0.28125c0.11115-0.73625,0.3586-1.2867,0.75-1.65625,0.39045-0.3686,0.8826-0.5625,1.46875-0.5625,0.59185,0,1.0632,0.17025,1.4375,0.53125,0.3743,0.36005,0.5625,0.82495,0.5625,1.375,0,0.69445-0.26825,1.22905-0.78125,1.5625-0.513,0.3325-1.07845,0.46875-1.71875,0.46875-0.06175,0-0.1493,0.0114-0.25,0l-0.15625,1.3125c0.42465-0.11115,0.77655-0.15625,1.0625-0.15625,0.6992,0,1.2656,0.2088,1.71875,0.65625,0.4541,0.4484,0.6875,1.0281,0.6875,1.71875,0,0.72295-0.2314,1.32325-0.71875,1.8125s-1.09715,0.75-1.8125,0.75c-0.60325,0-1.1161-0.1863-1.53125-0.5625-0.4142-0.37525-0.70115-0.99255-0.875-1.84375l-1.5,0.1875c0.1007,1.01745,0.5053,1.86065,1.21875,2.5,0.7106,0.6403,1.61115,0.96875,2.6875,0.96875,1.1932,0,2.1566-0.38115,2.9375-1.125,0.7809-0.7429,1.1875-1.65,1.1875-2.71875,0-0.7904-0.19095-1.4434-0.59375-1.96875-0.40375-0.52725-0.9636-0.86405-1.6875-1.03125,0.5567-0.2565,0.96595-0.6293,1.25-1.0625s0.40625-0.9093,0.40625-1.4375c0-0.55575-0.14015-1.06755-0.4375-1.5625-0.29925-0.494-0.71885-0.90155-1.28125-1.1875-0.5624-0.2869-1.17495-0.40625-1.84375-0.40625zm24.46875,3.625-0.8125,1.4375,13.59375,7.84375,0.8125-1.4375-13.59375-7.84375zm16.53125,6.875,0,16.3125,2.0625,0,0-12.8125,8.5625,12.8125,2.21875,0,0-16.3125-2.09375,0,0,12.8125-8.53125-12.8125-2.21875,0zm116,5.8125-1.34375,0.96875,14.125,19.40625-14.875,20.4375,1.34375,0.9375,15.53125-21.375-14.78125-20.375zm-39.375,5.65625,0,29.4375,1.625,0,0-29.4375-1.625,0zm-70.96875,6.9375,0,22.875-25.125,14.5,0.8125,1.4375,24.3125-14.03125,0,2.34375,2,1.15625-24.28125,14,0.8125,1.40625,25.09375-14.46875,19.65625,11.28125,0.8125-1.375-22.46875-12.96875,0-26.15625-1.625,0zm116.46875,7.3125-12.78125,17.5625,1.34375,0.96875,12.71875-17.59375-1.28125-0.9375zm-20.96875,23.625,0,16.3125,2.09375,0,0-12.8125,8.53125,12.8125,2.25,0,0-16.3125-2.09375,0,0,12.8125-8.5625-12.8125-2.21875,0zm-127.28125,6.875c-2.30185,0-4.20085,0.78016-5.65625,2.3125-1.4554,1.53331-2.15625,3.66559-2.15625,6.375,0,1.4326,0.31335,2.7781,0.9375,4.0625s1.5397,2.2893,2.75,3.03125,2.55665,1.125,4.09375,1.125c1.41835,0,2.74325-0.32835,3.96875-1s2.17495-1.66155,2.84375-2.96875c0.66785-1.30625,1-2.81384,1-4.46875,0-1.6321-0.3029-3.08681-0.9375-4.375-0.63555-1.28821-1.57095-2.2799-2.78125-3-1.2103-0.72009-2.55485-1.09375-4.0625-1.09375zm58.78125,0.34375,0,16.3125,2.09375,0,0-12.8125,8.5625,12.8125,2.21875,0,0-16.3125-2.09375,0,0,12.8125-8.5625-12.8125-2.21875,0zm-59.34375,1.53125c0.184536-0.01642,0.371313,0,0.5625,0,1.07635,0,2.0408,0.2672,2.90625,0.8125s1.5194,1.32166,1.96875,2.3125c0.44935,0.99085,0.6875,2.14066,0.6875,3.46875,0,2.10045-0.5118,3.73215-1.5625,4.875-1.05165,1.14285-2.40485,1.6875-4.03125,1.6875-1.596,0-2.91045-0.5551-3.96875-1.6875s-1.59375-2.68975-1.59375-4.65625c0-2.45575,0.5533-4.20025,1.65625-5.25,0.965081-0.91853,2.08325-1.44759,3.375-1.5625zm64.96875,15.03125,0,18.625,1.625,0,0-18.625-1.625,0zm1.5,20.8125c-1.4383,0-2.77176,0.3426-3.96875,1-1.19795,0.6574-2.1324,1.6077-2.78125,2.875-0.64885,1.26635-0.96875,2.7673-0.96875,4.46875,0,1.5599,0.30025,3.01555,0.875,4.375s1.39895,2.3765,2.5,3.09375c1.10104,0.71725,2.52376,1.09375,4.28125,1.09375,1.69766,0,3.13734-0.47335,4.3125-1.40625,1.17419-0.93195,2.01655-2.286,2.46875-4.0625l-2.1875-0.5625c-0.29639,1.3737-0.85056,2.42675-1.6875,3.125-0.83695,0.69825-1.85506,1.03125-3.0625,1.03125-0.99275,0-1.9291-0.23795-2.78125-0.75-0.85214-0.51205-1.47125-1.27699-1.875-2.3125-0.40375-1.0355-0.59375-2.2683-0.59375-3.65625,0-1.07635,0.15895-2.11135,0.5-3.125s0.940505-1.83614,1.78125-2.4375c0.84171-0.60135,1.8729-0.875,3.125-0.875,1.08869,0,1.99961,0.27099,2.71875,0.8125,0.7182,0.54149,1.27816,1.40625,1.65625,2.59375l2.09375-0.5c-0.437-1.5086-1.20005-2.6981-2.3125-3.53125-1.1115-0.8322-2.46261-1.25-4.09375-1.25zm9.4375,0.28125,0,16.34375,2.1875,0,0-7.6875,8.4375,0,0,7.6875,2.15625,0,0-16.34375-2.15625,0,0,6.71875-8.4375,0,0-6.71875-2.1875,0zm17.1875,8.3125c-0.9709,0-1.75455,0.2899-2.40625,0.84375-0.65169,0.5548-1.0979,1.33485-1.28125,2.34375l1.5,0.25c0.11115-0.73625,0.35955-1.2867,0.75-1.65625,0.39141-0.3686,0.8826-0.53125,1.46875-0.53125,0.59186,0,1.09445,0.1712,1.46875,0.53125s0.5625,0.82495,0.5625,1.375c0,0.69445-0.26825,1.19875-0.78125,1.53125-0.51299,0.3325-1.07844,0.5-1.71875,0.5-0.06175,0-0.15025,0.0114-0.25,0l-0.15625,1.3125c0.42465-0.11115,0.77655-0.1875,1.0625-0.1875,0.6992,0,1.26559,0.24005,1.71875,0.6875,0.45409,0.4484,0.6875,1.0281,0.6875,1.71875,0,0.72295-0.26171,1.32325-0.75,1.8125-0.48546,0.48925-1.0659,0.71875-1.78125,0.71875-0.6023,0-1.1161-0.1863-1.53125-0.5625-0.4142-0.37525-0.70115-0.99254-0.875-1.84375l-1.5,0.21875c0.09975,1.01745,0.50529,1.86065,1.21875,2.5,0.71059,0.6403,1.5799,0.9375,2.65625,0.9375,1.1932,0,2.18785-0.34989,2.96875-1.09375,0.77995-0.74289,1.1875-1.65,1.1875-2.71875,0-0.7904-0.2222-1.47465-0.625-2-0.40374-0.52725-0.9636-0.86405-1.6875-1.03125,0.5567-0.2565,0.9972-0.59805,1.28125-1.03125s0.40625-0.9093,0.40625-1.4375c0-0.55575-0.14015-1.0988-0.4375-1.59375-0.2983-0.49399-0.71885-0.8703-1.28125-1.15625-0.5624-0.2869-1.2062-0.4375-1.875-0.4375z"' +
                                'transform="translate(-3.6754178e-6,0)"/>' + 
                       '</svg>';
            var converted = convertHTML(html);

            converted.tagName.should.eql('svg');
            should.exist(converted.children);
    
            converted.children.length.should.eql(2);
            converted.children[0].tagName.should.eql('metadata');
            converted.children[1].tagName.should.eql('path');

        });
    });
});
