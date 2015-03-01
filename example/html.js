var tag = require('../tag')

var html = tag.define('html', 'html', 'lang')
  , head = tag.define('head', 'head')
  , title = tag.define('title', 'title')
  , body = tag.define('body', 'body')
  , div = tag.define('div', 'div')

var template = html().lang('en')(
	head()(
		title(function(){return this.title})
	).
	body()(
		div()(function(){return this.content})
	)
)
var context = {
	title: 'TITLE',
	content: 'CONTENT'
}
console.log(template.call(context))
