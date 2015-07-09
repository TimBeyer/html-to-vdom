var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var htmlToVDOM = require('../../index');

describe('library initialization', function () {
    describe('when incorrect options are passed', function () {
        it('throws when there are no options', function () {
            should.throw(htmlToVDOM);
        });

        it('throws when only VNode is supplied', function () {
            should.throw(function () {
                htmlToVDOM({
                    VNode: VNode
                });
            });
        });

        it('throws when only VText is supplied', function () {
            should.throw(function () {
                htmlToVDOM({
                    VText: VText
                });
            });
        });
    });

    describe('when VNode and VText are supplied', function () {
        it('returns the conversion function', function () {
            htmlToVDOM({
                VText: VText,
                VNode: VNode
            }).should.be.a('function');
        });
    });
});
