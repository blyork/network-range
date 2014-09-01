/*
 * network-range
 * https://github.com/blyork/network-range
 *
 * Copyright (c) 2014 Benjamin York
 * Licensed under the MIT license.
 */

(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory();

    } else {
        root.NetworkRange = factory();
    }
}(this, function() {
    'use strict';

    /***** NetworkIterator *****/

    function NetworkIterator(start, end) {
        start = Network.prototype._ipStringToInteger(start);
        end = Network.prototype._ipStringToInteger(end);

        if (start > end) {
            throw new RangeError('Start is after end.');
        }

        this._start = start;
        this._end = end;
        this._current = start;
    }

    NetworkIterator.prototype.next = function() {
        return (this._current <= this._end) ? Network.prototype._ipIntegerToString(this._current++) : null;
    };

    NetworkIterator.prototype.reset = function() {
        this._current = this._start;
    };

    NetworkIterator.prototype.toArray = function() {
        var result, ip;

        result = [];
        while ((ip = this.next())) {
            result.push(ip);
        }

        return result;
    };

    NetworkIterator.prototype.toString = function() {
        return JSON.stringify({
            current: Network.prototype._ipIntegerToString(this._current),
            start: Network.prototype._ipIntegerToString(this._start),
            end: Network.prototype._ipIntegerToString(this._end)
        });
    };

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
            this._ip = this._ipStringToInteger(ipString);
            this._submask = this._ipStringToInteger(submaskString);

            // Example: 192.168.1.0/24
        } else if (this.isCidr(ipString)) {
            result = this.parseCidr(ipString);
            this._ip = this._ipStringToInteger(result.ip);
            this._submask = this._ipStringToInteger(result.submask);

            // Example: 192.168.1.25-30, , 255.255.255.0
        } else if (this.isShortRange(ipString) && this.isSubmask(submaskString)) {
            result = this.parseShortRange(ipString);
            this._ip = this._ipStringToInteger(result.start);
            this._start = this._ip;
            this._end = this._ipStringToInteger(result.end);
            this._submask = this._ipStringToInteger(submaskString);

            if (!this.contains(result.start, result.end)) {
                throw new RangeError('Invalid range/submask combination.');
            }

            // Example Match: 192.168.0.25-192.168.5.32, 255.255.0.0
        } else if (this.isLongRange(ipString) && this.isSubmask(submaskString)) {
            result = this.parseLongRange(ipString);
            this._ip = this._ipStringToInteger(result.start);
            this._start = this._ip;
            this._end = this._ipStringToInteger(result.end);
            this._submask = this._ipStringToInteger(submaskString);

            if (!this.contains(result.start, result.end)) {
                throw new RangeError('Invalid range/submask combination.');
            }

            // Bad input.
        } else {
            throw new Error('Invalid input.');
        }
    }

    /***** STATICS VARIABLES *****/

    // Example Match: 192.168.1.0/24
    Network.prototype._cidrRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\/([1-2]?[0-9]|3[0-2])$/;

    // Example Match: 192.168.1.5
    Network.prototype._ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Example Match: 192.168.0.25-192.168.5.32
    Network.prototype._longRangeRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))-((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;

    // Example Match: 192.168.1.25-30
    Network.prototype._shortRangeRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3})(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Example Match: 255.255.255.0
    Network.prototype._submaskRegex = /^(?:255\.){3}(?:255|254|252|248|240|224|192|128|0)|(?:255\.){2}(?:254|252|248|240|224|192|128|0)\.0|255\.(?:254|252|248|240|224|192|128|0)(?:\.0){2}|(?:254|252|248|240|224|192|128)(?:\.0){3}$/;

    /***** CLASS FUNCTIONS *****/

    Network.prototype._bitAt = function(binary, num) {
        return ((binary & (1 << (num - 1))) !== 0) ? 1 : 0;
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

    Network.prototype._ipIntegerToString = function(ipInteger) {
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

    Network.prototype._ipStringToInteger = function(ipString) {
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

    Network.prototype.bitmaskToSubmask = function(bitmask) {
        return Network.prototype._ipIntegerToString(Network.prototype._bitmaskStringToInteger(bitmask));
    };

    Network.prototype.calculateSmallestSubmask = function(start, end) {
        var index, hostIndex, result;

        start = Network.prototype._ipStringToInteger(start);
        end = Network.prototype._ipStringToInteger(end);

        for (index = 32; index >= 0; index -= 1) {
            if (Network.prototype._bitAt(start, index) !== Network.prototype._bitAt(end, index)) {
                hostIndex = index;
                break;
            }
        }

        result = 0xffffffff;
        for (index = 0; index < hostIndex; index += 1) {
            result = result ^ (1 << index);
        }

        return Network.prototype._ipIntegerToString(result);
    };

    Network.prototype.getHexOctets = function(hexString) {
        return hexString.split(':').map(function(octet) {
            return parseInt(octet, 16);
        });
    };

    Network.prototype.getOctets = function(ipString) {
        return ipString.split('.').map(function(octet) {
            return parseInt(octet, 10);
        });
    };

    Network.prototype.isCidr = function(cidrString) {
        return Network.prototype._cidrRegex.test(cidrString);
    };

    Network.prototype.isIp = function(ipString) {
        return Network.prototype._ipRegex.test(ipString);
    };

    Network.prototype.isLongRange = function(longRangeString) {
        return Network.prototype._longRangeRegex.test(longRangeString);
    };

    Network.prototype.isShortRange = function(shortRangeString) {
        return Network.prototype._shortRangeRegex.test(shortRangeString);
    };

    Network.prototype.isSubmask = function(submaskString) {
        return Network.prototype._submaskRegex.test(submaskString);
    };

    Network.prototype.parseCidr = function(cidrString) {
        var result, regexResult;

        result = null;
        regexResult = Network.prototype._cidrRegex.exec(cidrString);

        if (regexResult) {
            result = {
                ip: regexResult[1],
                submask: Network.prototype.bitmaskToSubmask(regexResult[2])
            };
        }

        return result;
    };

    Network.prototype.parseLongRange = function(longRangeString) {
        var result, regexResult, start, end, swap;

        result = null;
        regexResult = Network.prototype._longRangeRegex.exec(longRangeString);

        if (regexResult) {
            start = Network.prototype._ipStringToInteger(regexResult[1]);
            end = Network.prototype._ipStringToInteger(regexResult[2]);

            if (start > end) {
                swap = start;
                start = end;
                end = swap;
            }

            result = {
                start: Network.prototype._ipIntegerToString(start),
                end: Network.prototype._ipIntegerToString(end)
            };
        }

        return result;
    };

    Network.prototype.parseShortRange = function(shortRangeString) {
        var result, regexResult, start, end, swap;

        result = null;
        regexResult = Network.prototype._shortRangeRegex.exec(shortRangeString);

        if (regexResult) {
            start = Network.prototype._ipStringToInteger(regexResult[1] + regexResult[2]);
            end = Network.prototype._ipStringToInteger(regexResult[1] + regexResult[3]);

            if (start > end) {
                swap = start;
                start = end;
                end = swap;
            }

            result = {
                start: Network.prototype._ipIntegerToString(start),
                end: Network.prototype._ipIntegerToString(end)
            };
        }

        return result;
    };

    Network.prototype.submaskToBitmask = function(submask) {
        var bitmask, index, bit;

        if ((typeof submask) === 'string') {
            submask = Network.prototype._ipStringToInteger(submask);

        }
        bitmask = 0;
        for (index = 32, bit = 1; index >= 0, bit === 1; index -= 1) {
            bitmask += (bit = Network.prototype._bitAt(submask, index));
        }

        return bitmask;
    };

    /***** METHODS *****/

    Network.prototype._calculateBitmask = function() {
        if (!this._bitmask) {
            this._bitmask = Network.prototype.submaskToBitmask(this._submask);
        }
    };

    Network.prototype._calculateBroadcast = function() {
        if (!this._broadcast) {
            this._calculateNetwork();
            this._calculateHost();
            this._broadcast = this._network | this._host;
        }
    };

    Network.prototype._calculateEnd = function() {
        if (!this._end) {
            this._calculateBroadcast();
            this._end = this._broadcast - 1;
        }
    };

    Network.prototype._calculateHost = function() {
        if (!this._host) {
            this._host = this._submask ^ 0xffffffff;
        }
    };

    Network.prototype._calculateNetwork = function() {
        if (!this._network) {
            this._network = this._ip & this._submask;
        }
    };

    Network.prototype._calculateStart = function() {
        if (!this._start) {
            this._calculateNetwork();
            this._start = this._network + 1;
        }
    };

    Network.prototype._contains = function(ip) {
        this._calculateNetwork();
        this._calculateStart();
        this._calculateEnd();
        ip = this._ipStringToInteger(ip);
        return (ip & this._submask) === this._network && ip >= this._start && ip <= this._end;
    };

    Network.prototype._containsRange = function(start, end) {
        return this._contains(start) && this._contains(end);
    };

    Network.prototype.contains = function(start, end) {
        var result, range;

        result = false;

        if (start) {

            if (start instanceof Network) {
                result = this._containsRange(start.getStart(), start.getEnd());

            } else if (this.isIp(start)) {
                if (end) {
                    result = this._containsRange(start, end);

                } else {
                    result = this._contains(start);
                }

            } else if (this.isShortRange(start)) {
                range = this.parseShortRange(start);
                result = this._containsRange(range.start, range.end);

            } else if (this.isLongRange(start)) {
                range = this.parseLongRange(start);
                result = this._containsRange(range.start, range.end);

            } else if (this.isCidr(start)) {
                result = this.contains(new Network(start));
            }

            return result;
        }
    };

    Network.prototype.createIterator = function(start, end) {
        this._calculateStart();
        this._calculateEnd();
        start = start || Network.prototype._ipIntegerToString(this._start);
        end = end || Network.prototype._ipIntegerToString(this._end);

        if (!this.contains(start)) {
            throw new RangeError('Network does not contain start IP address.');
        }

        if (!this.contains(end)) {
            throw new RangeError('Network does not contain end IP address.');
        }

        return new NetworkIterator(start, end);
    };

    Network.prototype.getBitmask = function() {
        this._calculateBitmask();
        return this._bitmask;
    };

    Network.prototype.getBroadcast = function() {
        this._calculateBroadcast();
        return this._ipIntegerToString(this._broadcast);

    };

    Network.prototype.getEnd = function() {
        this._calculateEnd();
        return this._ipIntegerToString(this._end);
    };

    Network.prototype.getNetwork = function() {
        this._calculateNetwork();
        return this._ipIntegerToString(this._network);
    };

    Network.prototype.getRange = function() {
        this._calculateStart();
        this._calculateEnd();
        return this.createIterator().toArray();
    };

    Network.prototype.getStart = function() {
        this._calculateStart();
        return this._ipIntegerToString(this._start);
    };

    Network.prototype.getSubmask = function() {
        return this._ipIntegerToString(this._submask);
    };

    Network.prototype.serialize = function() {
        return {
            network: this.getNetwork(),
            submask: this.getSubmask(),
            broadcast: this.getBroadcast(),
            start: this.getStart(),
            end: this.getEnd()
        };
    };

    Network.prototype.toCidr = function() {
        return this.getNetwork() + '/' + this.getBitmask();
    };

    Network.prototype.toString = function() {
        return JSON.stringify(this.serialize());
    };

    return Network;
}));
