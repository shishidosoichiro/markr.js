markr.js 
======================================================================

This is the project for learning. a simple and easy highlighting library.

[![Build Status](https://travis-ci.org/shishidosoichiro/markr.js.svg?branch=master)](https://travis-ci.org/shishidosoichiro/markr.js)
[![Coverage Status](https://coveralls.io/repos/shishidosoichiro/markr.js/badge.svg?branch=master)](https://coveralls.io/r/shishidosoichiro/markr.js?branch=master)

## How to use

### Browser

```html
<script type="" src="markr.js"></script>
```

### Node.js

```sh
npm install markr
```

```javascript
var markr = require('markr')
  , addClass = markr.style

var f = markr
.match(/\b(if|else)\b/g, addClass('strong'))
.match(/\b(print)\b/g, addClass('italic'))

var text = ' if (a == 1) {print a} else {print "not 1"}'
console.log(f(text))
```
