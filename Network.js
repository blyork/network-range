"use strict";

/***** CONSTRUCTOR *****/

function Network(ipString, submaskString) {
	var result;

	// Handle missing submask.
	if (!submaskString) {
		if (this.isShortRange(ipString)) {
			result = this.parseShortRange(ipString);
			submaskString = this.calculateSmallestSubmask(result.start, result.end);

		} else if (this.isLongRange(ipString)) {
			result = this.parseLongRange(ipString);
			submaskString = this.calculateSmallestSubmask(result.start, result.end);
		}
	}

	// Example: 192.168.1.5, 255.255.255.0
	if (this.isIp(ipString) && this.isSubmask(submaskString)) {
		this._ip = this.ipStringToInteger(ipString);
		this._submask = this.ipStringToInteger(submaskString);

		// Example: 192.168.1.0/24
	} else if (this.isCidr(ipString)) {
		result = this.parseCidr(ipString);
		this._ip = this.ipStringToInteger(result.ip);
		this._submask = this.ipStringToInteger(result.submask);

		// Example: 192.168.1.25-30, , 255.255.255.0
	} else if (this.isShortRange(ipString) && this.isSubmask(submaskString)) {
		result = this.parseShortRange(ipString);
		this._ip = this.ipStringToInteger(result.start);
		this._start = this._ip;
		this._end = this.ipStringToInteger(result.end);
		this._submask = this.ipStringToInteger(submaskString);

		if (!this.contains(result.start, result.end)) {
			throw new Error('Invalid range/submask combination.');
		}

		// Example Match: 192.168.0.25-192.168.5.32, 255.255.0.0
	} else if (this.isLongRange(ipString) && this.isSubmask(submaskString)) {
		result = this.parseLongRange(ipString);
		this._ip = this.ipStringToInteger(result.start);
		this._start = this._ip;
		this._end = this.ipStringToInteger(result.end);
		this._submask = this.ipStringToInteger(submaskString);

		if (!this.contains(result.start, result.end)) {
			throw new Error('Invalid range/submask combination.');
		}

		// Bad input.
	} else {
		throw new Error('Invalid input.');
	}
}

/***** STATICS VARIABLES *****/

// Example Match: 192.168.1.5
Network.prototype._ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// Example Match: 255.255.255.0
Network.prototype._submaskRegex = /^(?:255\.){3}(?:255|254|252|248|240|224|192|128|0)|(?:255\.){2}(?:254|252|248|240|224|192|128|0)\.0|255\.(?:254|252|248|240|224|192|128|0)(?:\.0){2}|(?:254|252|248|240|224|192|128)(?:\.0){3}$/;

// Example Match: 192.168.1.0/24
Network.prototype._cidrRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\/([1-2]?[0-9]|3[0-2])$/;

// Example Match: 192.168.1.25-30
Network.prototype._shortRangeRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3})(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// Example Match: 192.168.0.25-192.168.5.32
Network.prototype._longRangeRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))-((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;

/***** STATICS FUNCTIONS *****/

Network.prototype.bitAt = function(binary, num) {
	return ((binary & (1 << (num - 1))) !== 0) ? 1 : 0;
};

Network.prototype.calculateSmallestSubmask = function(start, end) {
	var index, hostIndex, result;

	start = Network.prototype.ipStringToInteger(start);
	end = Network.prototype.ipStringToInteger(end);

	for (index = 32; index >= 0; index -= 1) {
		if (Network.prototype.bitAt(start, index) !== Network.prototype.bitAt(end, index)) {
			hostIndex = index;
			break;
		}
	}

	result = 0xffffffff;
	for (index = 0; index < hostIndex; index += 1) {
		result = result ^ (1 << index);
	}

	return Network.prototype.ipIntegerToString(result);
};

Network.prototype.getOctets = function(ipString) {
	return ipString.split('.').map(function(octet) {
		return parseInt(octet, 10);
	});
};

Network.prototype.isIp = function(ipString) {
	return Network.prototype._ipRegex.test(ipString);
};

Network.prototype.isSubmask = function(submaskString) {
	return Network.prototype._submaskRegex.test(submaskString);
};

Network.prototype.isCidr = function(cidrString) {
	return Network.prototype._cidrRegex.test(cidrString);
};

Network.prototype.isShortRange = function(shortRangeString) {
	return Network.prototype._shortRangeRegex.test(shortRangeString);
};

Network.prototype.isLongRange = function(longRangeString) {
	return Network.prototype._longRangeRegex.test(longRangeString);
};

Network.prototype.parseCidr = function(cidrString) {
	var result, regexResult;

	result = undefined;
	regexResult = Network.prototype._cidrRegex.exec(cidrString);

	if (regexResult) {
		result = {
			ip: regexResult[1],
			submask: Network.prototype.bitmaskToSubmask(regexResult[2])
		};
	}

	return result;
};

Network.prototype.parseShortRange = function(shortRangeString) {
	var result, regexResult, start, end, swap;

	result = undefined;
	regexResult = Network.prototype._shortRangeRegex.exec(shortRangeString);

	if (regexResult) {
		start = Network.prototype.ipStringToInteger(regexResult[1] + regexResult[2]);
		end = Network.prototype.ipStringToInteger(regexResult[1] + regexResult[3]);

		if (start > end) {
			swap = start;
			start = end;
			end = swap;
		}

		result = {
			start: Network.prototype.ipIntegerToString(start),
			end: Network.prototype.ipIntegerToString(end)
		};
	}

	return result;
};

Network.prototype.parseLongRange = function(longRangeString) {
	var result, regexResult, start, end, swap;

	result = undefined;
	regexResult = Network.prototype._longRangeRegex.exec(longRangeString);

	if (regexResult) {
		start = Network.prototype.ipStringToInteger(regexResult[1]);
		end = Network.prototype.ipStringToInteger(regexResult[2]);

		if (start > end) {
			swap = start;
			start = end;
			end = swap;
		}

		result = {
			start: Network.prototype.ipIntegerToString(start),
			end: Network.prototype.ipIntegerToString(end)
		};
	}

	return result;
};

Network.prototype._bitmaskStringToInteger = function(bitmask) {
	var binary, remove, index;

	bitmask = parseInt(bitmask, 10);

	if (isNaN(bitmask) || bitmask > 32) {
		throw new Error('Invalid bitmask.');
	}

	remove = 32 - bitmask;
	binary = 0xffffffff;

	for (index = 0; index < remove; index += 1) {
		binary = binary ^ (0x1 << index);
	}

	return binary;
};

Network.prototype.bitmaskToSubmask = function(bitmask) {
	return Network.prototype.ipIntegerToString(Network.prototype._bitmaskStringToInteger(bitmask));
};

Network.prototype.ipStringToInteger = function(ipString) {
	var octets, result, index, shift;

	if (!Network.prototype.isIp(ipString)) {
		throw new Error('Invalid IP.');
	}

	// Get octet int values.
	octets = Network.prototype.getOctets(ipString);

	// Sum binary octets.
	result = 0;
	for (index = 0; index < 4; index += 1) {
		shift = (3 - index) * 8;
		result += (octets[index] << shift);
	}

	return result;

};

Network.prototype.ipIntegerToString = function(ipInteger) {
	var octets, index, shift;

	// Get decimal of each octet.
	octets = [];
	for (index = 0; index < 4; index += 1) {
		shift = (3 - index) * 8;
		octets.push((ipInteger & (0xff << shift)) >>> shift);
	}

	// Join decimal octets into string and return.
	return octets.join('.');
};

/***** METHODS *****/

Network.prototype._calculateNetwork = function() {
	if (!this._network) {
		this._network = this._ip & this._submask;
	}
};

Network.prototype.getNetwork = function() {
	this._calculateNetwork();
	return this.ipIntegerToString(this._network);
};

Network.prototype.getSubmask = function() {
	return this.ipIntegerToString(this._submask);
};

Network.prototype._calculateHost = function() {
	if (!this._host) {
		this._host = this._submask ^ 0xffffffff;
	}
};

Network.prototype._calculateBroadcast = function() {
	if (!this._broadcast) {
		this._calculateNetwork();
		this._calculateHost();
		this._broadcast = this._network | this._host;
	}
};

Network.prototype.getBroadcast = function() {
	this._calculateBroadcast();
	return this.ipIntegerToString(this._broadcast);

};

Network.prototype._calculateStart = function() {
	if (!this._start) {
		this._calculateNetwork();
		this._start = this._network + 1;
	}
};

Network.prototype.getStart = function() {
	this._calculateStart();
	return this.ipIntegerToString(this._start);
};

Network.prototype._calculateEnd = function() {
	if (!this._end) {
		this._calculateBroadcast();
		this._end = this._broadcast - 1;
	}
};

Network.prototype.getEnd = function() {
	this._calculateEnd();
	return this.ipIntegerToString(this._end);
};

Network.prototype.getRange = function() {
	var range, currentIp;

	this._calculateStart();
	this._calculateEnd();

	range = [];
	for (currentIp = this._start; currentIp <= this._end; currentIp += 1) {
		range.push(this.ipIntegerToString(currentIp));
	}

	return range;
};

Network.prototype._contains = function(ip) {
	this._calculateNetwork();
	this._calculateStart();
	this._calculateEnd();
	ip = this.ipStringToInteger(ip);
	return (ip & this._submask) === this._network && ip >= this._start && ip <= this._end;
};

Network.prototype._containsRange = function(start, end) {
	return this._contains(start) && this._contains(end);
};

Network.prototype.contains = function(start, end) {
	var result, range;

	result = false;

	if (start) {

		if (this.isIp(start)) {
			if (end) {
				result = this._containsRange(start, end)

			} else {
				result = this._contains(start);
			}

		} else if (this.isShortRange(start)) {
			range = this.parseShortRange(start);
			result = this._containsRange(range.start, range.end);

		} else if (this.isLongRange(start)) {
			range = this.parseLongRange(start);
			result = this._containsRange(range.start, range.end);

		}

		return result;
	}
};

Network.prototype.serialize = function() {
	return {
		network: this.getNetwork(),
		submask: this.getSubmask(),
		broadcast: this.getBroadcast(),
		start: this.getStart(),
		end: this.getEnd()
	}
};

module.exports = Network;
