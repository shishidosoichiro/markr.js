var tag = require('../tag')

var template = tag('html').attr('lang', 'en')(
	tag('head')(
		tag('title')(function(){return this.title})
	).
	tag('body')(
		tag('div')(function(){return this.content})
	)
)
var context = {
	title: 'TITLE',
	content: 'CONTENT'
}
console.log(template.call(context))
