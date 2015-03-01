var markr = require('../markr')
  , tag = require('../tag')

var word1 = tag.define('word1').tagName('span').hasClass('word1')
  , word2 = tag.define('word2').tagName('span').hasClass('word2')
  , quote = tag.define('quote').tagName('span').hasClass('quote')

var markup = markr()
.word(
	'function',
	'var',
	word1()
)
.word(
	'if',
	'else',
	'return',
	word2()
)
.quote('"', "'", quote())

var fs = require('fs')

var codes = fs.readFileSync('../tag.js', {encoding: 'utf8'})
console.log(markup(codes))
