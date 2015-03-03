var markr = require('../markr')
  , tag = require('../tag')

var reserved = tag.define('reserved').tagName('span').hasClass('reserved')
  , reserved2 = tag.define('reserved2').tagName('span').hasClass('reserved2')
  , reserved3 = tag.define('reserved3').tagName('span').hasClass('reserved3')
  , punctuator = tag.define('punctuator').tagName('span').hasClass('punctuator')
  , numeric = tag.define('numeric').tagName('span').hasClass('numeric')
  , string = tag.define('string').tagName('span').hasClass('string')
  , comment = tag.define('comment').tagName('span').hasClass('comment')
  , regex = tag.define('regex').tagName('span').hasClass('regex')

var markup = markr()
// Comment
.match(
	// Multiple Line Comment
	/\/\*[\s\S]*?\*\//, 
	// Single Line Comment
	/\/\/.*$/, 
	comment()
)
// Reserved Words
.word(
	// Keywords
	'break',  'case',   'catch',  'continue', 'debugger',
	'default','do',     'else',   'finally',  'for',
	'if',     'return', 'switch', 'this',     'throw',
	'try',    'while',

	// Future Reserved Words
	'class',  'enum',   'export', 'extends',

	// The following tokens are also considered to be 
	// FutureReservedWords when they occur within strict mode code 
	'implements', 'interface', 'private', 'protected',
	'public',     'static',
	reserved()
)
// Reserved Words 2
.word(
	'null', 'true', 'false', 'undefined',

	// Keywords
	'function', 'var', 'void',

	// Future Reserved Words
	'import',   'super',

	// The following tokens are also considered to be 
	// FutureReservedWords when they occur within strict mode code 
	'package',
	reserved2()
)
// Reserved Words 3
.word(
	// Keywords
	'delete', 'in', 'instanceof', 'typeof', 'with',

	// Future Reserved Words
	// The following tokens are also considered to be 
	// FutureReservedWords when they occur within strict mode code 
	'let', 'yield',
	reserved3()
)
// Punctuators
.match(
	/\{/,     /\}/,     /\(/,       /\)/,   /\[/,
	/\]/,     /\./,     /\;/,       /\,/,   /\</,
	/\>/,     /\<\=/,   /\>\=/,     /\=\=/, /\!\=/,
	/\=\=\=/, /\!\=\=/, /\+/,       /\-/,   /\*/,
	/\%/,     /\+\+/,   /\-\-/,     /\<\</, /\>\>/,
	/\>\>\>/, /\&/,     /\|/,       /\^/,   /\!/,
	/\~/,     /\&\&/,   /\|\|/,     /\?/,   /\:/,
	/\=/,     /\+\=/,   /\-\=/,     /\*\=/, /\%\=/,
	/\<\<\=/, /\>\>\=/, /\>\>\>\=/, /\&\=/, /\|\=/,
	/\^\=/,   /\//,     /\/\=/,
	punctuator()
)
// Literals
.word(
	// Null Literals
	'null', 

	// Boolean Literals
	'true', 'false',

	// 
	'undefined',
	reserved2()
)
// Numeric Literals
.match(
	// Decimal Literals (inculude Signed)
	/(?:\+|\-)?(?:\d|\.)*\d/,

	// Decimal Literals (inculude Signed, Exponent Part)
	/(?:\+|\-)?(?:\d|\.)*\d[eE](?:\+|\-)?(?:\d|\.)*\d/,

	// Hex Integer Literal
	/0[xX](?:\d|[a-fA-F])+/,

	numeric()
)
// String Literals
.quote(
	'"', "'", 
	string()
)
// Regular Expression Literals
.quote(
	/\//,
	regex()
)

var fs = require('fs')

var codes = fs.readFileSync('example/target.js', {encoding: 'utf8'})
console.log(markup(codes))

