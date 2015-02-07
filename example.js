var markr = require('./index.js')
  , addClass = markr.addClass

var el = markr
.quote ('"', "'", addClass('text-error'))
.word  ('concat', addClass('text-success').tooltip('join two strings.'))

var velocity = markr
.embed (/\$\{/, /\}/, addClass('text-error'), el)
.word  ('in', addClass('text-warning'))
.prefix(/\#/, addClass('text-warning'))

var text = "'3333' concat #foreach (var i in ${'1234'.concat('concat')}) #end"
console.log(text)
console.log(velocity(text))
