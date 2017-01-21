var SVGAttributeHook = require('../../../lib/get-property-info/svg/svg-attribute-hook');


describe('SVGAttributeHook', function () {
    var testNamespace = "http://www.testnamespace.com";
    var testValue = "test-value";
    var attributeHook = SVGAttributeHook(testNamespace, testValue);

    it('creates new AttributeBook with namespace and value', function () {
        attributeHook.namespace.should.equal(testNamespace)
        attributeHook.value.should.equal(testValue)
    });

    describe('hook', function() {
        context('prev is the same AttributeHook', function() {
            it('does nothing', function() {
                var prev = attributeHook;
                var node = {};
                var prop = {};

                var hooked = attributeHook.hook(node, prop, prev)

                should.equal(hooked, undefined)
            });
        });

        context('prev is different AttributeHook', function() {
            it('sets the attribute to the input node', function() {
                var otherNamespace = "othernamespace";
                var otherValue = "otherValue";
                var testProp = "testProp";
                var prev = SVGAttributeHook(otherNamespace, otherValue);
                var node = {
                    setAttributeNS: function(namespace, prop, value) {
                        this.namespace = namespace;
                        this.value = value;
                        this.prop = prop;
                    },
                    namespace: null,
                    value: null,
                    prop: null,
                };

                attributeHook.hook(node, testProp, prev)

                node.namespace.should.equal(testNamespace)
                node.value.should.equal(testValue)
                node.prop.should.equal(testProp)
            });
        });
    });

    describe('unhook', function() {
        context('node is has same namespace as next', function() {
            it('does nothing', function() {
                var next = attributeHook;
                var node = {};
                var prop = {};

                var hooked = attributeHook.unhook(node, prop, next)

                should.equal(hooked, undefined)
            });
        });

        context('node has different namespace as next', function() {
            it('removes attribute namespace from the node', function() {
                var otherNamespace = "othernamespace";
                var otherValue = "otherValue";
                var testProp = "color:red";
                var next = SVGAttributeHook(otherNamespace, otherValue);
                var node = {
                    removeAttributeNS: function(namespace, name) {
                        this.namespace = name;
                    },
                    namespace: testNamespace
                };

                attributeHook.unhook(node, testProp, next)

                node.namespace.should.equal('red')
            });

            it('removes attribute namespace without colon in prop from the node', function() {
                var otherNamespace = "othernamespace";
                var otherValue = "otherValue";
                var testProp = "color";
                var next = SVGAttributeHook(otherNamespace, otherValue);
                var node = {
                    removeAttributeNS: function(namespace, name) {
                        this.namespace = name;
                    },
                    namespace: testNamespace
                };

                attributeHook.unhook(node, testProp, next)

                node.namespace.should.equal('color')
            });
        });
    });
});
