# network-range

Javascript object that parses subnets and allows you to make queries on the data.

## Getting Started
### On the server
#### Standard Require
Install the module with: `npm install network-range`

```javascript
var NetworkRange = require('network-range');
var network = new NetworkRange('192.168.1.0/24');
```

#### RequireJS
Install the module with: `npm install network-range`

```javascript
define(['network-range'], function(NetworkRange) {
	var NetworkRange = require('network-range');
	var network = new NetworkRange('192.168.1.0/24');
});
```

### In the browser
#### Standard Download
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/blyork/network-range/master/dist/network-range.min.js
[max]: https://raw.github.com/blyork/network-range/master/lib/network-range.js

In your web page:

```html
<script src="js/network-range.min.js"></script>
<script>
    var network = new NetworkRange('192.168.1.0', '255.255.255.0');
    console.log(network.serialize());
</script>
```

#### With Bower
Install the module with: `bower install network-range`

In your web page:

```html
<script src="bower_components/dist/network-range.min.js"></script>
<script>
    var network = new NetworkRange('192.168.1.0', '255.255.255.0');
    console.log(network.serialize());
</script>
```

## Documentation/API

### Constructor

#### NetworkRange(ipString, [submaskString])

This constructor takes 6 different combinations of inputs. When the submask is not included, the smallest possible subnet is calculated.

* Network IP, Submask
* CIDR String
* Short Network Range, Submask
* Long Network Range, Submask
* Short Network Range
* Long Network Range

__Arguments__

* `ipString` - The network IP, CIDR string, or IP range.
* `submaskString` - The subnet submask.

__Example__

##### Network/Subnet
```js
network = new NetworkRange('192.168.1.0/24');
network.serialize()
/*
{
	network: '192.168.1.0',
	submask: '255.255.255.0',
	broadcast: '192.168.1.255',
	start: '192.168.1.1',
	end: '192.168.1.254'
};
*/

network = new NetworkRange('192.168.1.0', '255.255.255.0');
network.serialize();
/*
{
    network: '192.168.1.0',
    submask: '255.255.255.0',
    broadcast: '192.168.1.255',
    start: '192.168.1.1',
    end: '192.168.1.254'
};
*/
```

##### Ranges With Subnets
```js
network = new NetworkRange('192.168.1.25-30', '255.255.255.0');
network.serialize();
/*{
    network: '192.168.1.0',
    submask: '255.255.255.0',
    broadcast: '192.168.1.255',
    start: '192.168.1.25',
    end: '192.168.1.30'
}
*/

network = new NetworkRange('192.168.0.25-192.168.5.32', '255.255.0.0');
network.serialize();
/*{
    network: '192.168.0.0',
    submask: '255.255.0.0',
    broadcast: '192.168.255.255',
    start: '192.168.0.25',
    end: '192.168.5.32'
}*/
```

##### Ranges With Smallest Subnet Calculated
```js
network = new NetworkRange('192.168.1.25-30');
network.serialize();
/*{
    network: '192.168.1.24',
    submask: '255.255.255.248',
    broadcast: '192.168.1.31',
    start: '192.168.1.25',
    end: '192.168.1.30'
}*/


network = new NetworkRange('192.168.0.25-192.168.5.32');
network.serialize();
/*{
    network: '192.168.0.0',
    submask: '255.255.248.0',
    broadcast: '192.168.7.255',
    start: '192.168.0.25',
    end: '192.168.5.32'
}
*/
```

### Instance Methods

#### contains(start, [end])

#### createIterator([start], [end])

#### getBitmask()

#### getBroadcast()

#### getEnd()

#### getNetwork()

#### getRange()

#### getStart()

#### getSubmask()

#### serialize()

#### toCidr()

#### toString()

### Class Methods

#### bitmaskToSubmask(bitmask)

#### calculateSmallestSubmask(start, end)

#### getHexOctets(ipString)

#### getOctets(ipString)

#### isCidr(cidrString)

#### isIp(ipString)

#### isLongRange(longRangeString)

#### isShortRange(shortRangeString)

#### isSubmask(submaskString)

#### parseCidr(cidrString)

#### parseLongRange(longRangeString)

#### parseShortRange(shortRangeString)

#### submaskToBitmask(submask)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## License
Copyright (c) 2014 Benjamin York  
Licensed under the [MIT license](https://raw.github.com/blyork/network-range/master/LICENSE).
