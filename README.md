# network-range

Javascript object that parses subnets and allows you to make queries on the data.

## Getting Started
### On the server
Install the module with: `npm install network-range`

```javascript
var NetworkRange = require('network-range');
var network = new NetworkRange('192.168.1.0/24');
network.serialize();
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/blyork/network-range/master/dist/network-range.min.js
[max]: https://raw.github.com/blyork/network-range/master/dist/network-range.js

In your web page:

```html
<script src="dist/network-range.min.js"></script>
<script>
var network = new NetworkRange('192.168.1.0/24');
console.log(network.serialize());
</script>
```

In your code, you can attach network-range's methods to any object.

```html
<script>
var exports = Bocoup.utils;
</script>
<script src="dist/network-range.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Benjamin York  
Licensed under the MIT license.
