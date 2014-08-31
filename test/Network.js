describe('Network', function() {
	"use strict";

	var expect, Network;

	expect = require('chai').expect;
	Network = require('../development/Network.js');

	describe('static functions', function() {
		describe('#bitAt', function() {
			it('should return bit at position (right to left) in number', function() {
				var index, binary, num;
				for (index; index < 100; index += 1) {
					binary = Math.floor(Math.random() * 4294967295);
					num = Math.floor(Math.random() * 32);
					expect(Network.prototype.bitAt(binary, num)).to.equal(binary.toString(2)[33 - num]);
				}
			});
		});

		describe('#bitmaskToSubmask', function() {
			it('should return string submask base on number bitmask', function() {
				expect(Network.prototype.bitmaskToSubmask(31)).to.equal('255.255.255.254');
				expect(Network.prototype.bitmaskToSubmask(5)).to.equal('248.0.0.0');
				expect(Network.prototype.bitmaskToSubmask(2)).to.equal('192.0.0.0');
				expect(Network.prototype.bitmaskToSubmask(22)).to.equal('255.255.252.0');
				expect(Network.prototype.bitmaskToSubmask(15)).to.equal('255.254.0.0');
				expect(Network.prototype.bitmaskToSubmask(30)).to.equal('255.255.255.252');
				expect(Network.prototype.bitmaskToSubmask(18)).to.equal('255.255.192.0');

				expect(Network.prototype.bitmaskToSubmask(8)).to.equal('255.0.0.0');
				expect(Network.prototype.bitmaskToSubmask(7)).to.equal('254.0.0.0');
				expect(Network.prototype.bitmaskToSubmask(10)).to.equal('255.192.0.0');
				expect(Network.prototype.bitmaskToSubmask(16)).to.equal('255.255.0.0');
				expect(Network.prototype.bitmaskToSubmask(18)).to.equal('255.255.192.0');
				expect(Network.prototype.bitmaskToSubmask(20)).to.equal('255.255.240.0');
				expect(Network.prototype.bitmaskToSubmask(24)).to.equal('255.255.255.0');
				expect(Network.prototype.bitmaskToSubmask(29)).to.equal('255.255.255.248');
				expect(Network.prototype.bitmaskToSubmask(31)).to.equal('255.255.255.254');
			});
		});

		describe('#calculateSmallestSubmask', function() {
			it('should ', function() {

			});
		});

		describe('#getOctets', function() {
			it('should return an array of integer based octets', function() {
				var index, output;
				for (index = 0; index < 100; index += 1) {
					output = [
						Math.floor(Math.random() * 255),
						Math.floor(Math.random() * 255),
						Math.floor(Math.random() * 255),
						Math.floor(Math.random() * 255)
					];
					expect(Network.prototype.getOctets(output.join('.'))).to.deep.equal(output);
				}
			});
		});

		describe('#ipIntegerToString', function() {
			it('should ', function() {

			});
		});

		describe('#ipStringToInteger', function() {
			it('should ', function() {

			});
		});

		describe('#isCidr', function() {
			it('should ', function() {
				expect(Network.prototype.isCidr('192.168.1.0/24')).to.be.true;
				expect(Network.prototype.isCidr('32.11.1.5/16')).to.be.true;
				expect(Network.prototype.isCidr('192.168.1.0/31')).to.be.true;
				expect(Network.prototype.isCidr('192.168.1.0/9')).to.be.true;
				expect(Network.prototype.isCidr('192.168.1.0/2')).to.be.true;

				expect(Network.prototype.isCidr('999.168.1.0/24')).to.be.false;
				expect(Network.prototype.isCidr('99.32.1.5/55')).to.be.false;
				expect(Network.prototype.isCidr('32.168.1')).to.be.false;
				expect(Network.prototype.isCidr('32.165.5.10-32.165.7.32')).to.be.false;
				expect(Network.prototype.isCidr('127.5.4.6-11')).to.be.false;
			});
		});

		describe('#isIp', function() {
			it('should ', function() {

			});
		});

		describe('#isLongRange', function() {
			it('should ', function() {

			});
		});

		describe('#isShortRange', function() {
			it('should ', function() {

			});
		});

		describe('#isSubmask', function() {
			it('should ', function() {

			});
		});

		describe('#parseCidr', function() {
			it('should ', function() {

			});
		});

		describe('#parseLongRange', function() {
			it('should ', function() {

			});
		});

		describe('#parseShortRange', function() {
			it('should ', function() {

			});
		});
	});

	describe('instance functions', function() {
		var networks = [];

		describe('#contains', function() {
			it('should ', function() {

			});
		});

		describe('#createIterator', function() {
			it('should ', function() {

			});
		});

		describe('#getBroadcast', function() {
			it('should ', function() {

			});
		});

		describe('#getEnd', function() {
			it('should ', function() {

			});
		});

		describe('#getNetwork', function() {
			it('should ', function() {

			});
		});

		describe('#getRange', function() {
			it('should ', function() {

			});
		});

		describe('#getStart', function() {
			it('should ', function() {

			});
		});

		describe('#getSubmask', function() {
			it('should ', function() {

			});
		});

		describe('#serialize', function() {
			it('should ', function() {

			});
		});

		describe('#toString', function() {
			it('should ', function() {

			});
		});
	});
});

describe('NetworkIterator', function() {
	describe('#next', function() {
		it('should ', function() {

		});
	});

	describe('#reset', function() {
		it('should ', function() {

		});
	});

	describe('#toArray', function() {
		it('should ', function() {

		});
	});

	describe('#toString', function() {
		it('should ', function() {

		});
	});
});
