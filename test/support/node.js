var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should(); // jshint ignore:line

chai.use(chaiAsPromised);

global.should = should;
