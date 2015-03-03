markr.js 
======================================================================

This is the project for learning. a simple and easy highlighting library.

[![Build Status](https://travis-ci.org/shishidosoichiro/markr.js.svg?branch=master)](https://travis-ci.org/shishidosoichiro/markr.js)
[![Coverage Status](https://coveralls.io/repos/shishidosoichiro/markr.js/badge.svg?branch=master)](https://coveralls.io/r/shishidosoichiro/markr.js?branch=master)
[![Code Climate](https://codeclimate.com/github/shishidosoichiro/markr.js/badges/gpa.svg)](https://codeclimate.com/github/shishidosoichiro/markr.js)

## Install

### Browser

```html
<script type="" src="markr.js"></script>
```

### Node.js

```sh
npm install markr
```

## How to use

```javascript
var markr = require('markr')
  , tag = markr.tag

var f = markr
.word('if', 'else', tag('strong'))
.word('print', tag('em'))
.quote('"', tag('span').hasClass('quoted'))

var text = 'if (a == 1) {print a} else {print "not 1"}'
console.log(f(text))
-> '<strong>if</strong> (a == 1) {<em>print</em> a} <strong>else</strong> {<em>print</em> <span class="quoted">"not 1"</span>}'
```
