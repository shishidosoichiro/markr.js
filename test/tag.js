var expect = require('chai').expect
require('chai').should()

var tag = require('../tag')

describe('tag', function(){
	it('should wrap <name>...</name>.', function(){
		tag('h1')('text').should.be.equal('<h1>text</h1>')
	})
	it('should wrap <name>...</name>.', function(){
		tag('h1')(tag('small'))('text').should.be.equal('<h1><small />text</h1>')
	})

	describe('#attr', function(){
		it('should return tag".', function(){
			var a = tag('a')
			a.attr('href', 'http://shishidohinata.com').should.be.equal(a)
		})
		it('should add a attribute name="value".', function(){
			var link = tag('a').attr('href', 'http://shishidohinata.com')
			link('shishidohinata').should.be.equal('<a href="http://shishidohinata.com">shishidohinata</a>')
		})
		it('should add a attribute name="value".', function(){
			var link = tag('a').attr([{name:'href', value:'http://shishidohinata.com'}, {name: 'name', value: 'link'}])
			link('shishidohinata').should.be.equal('<a href="http://shishidohinata.com" name="link">shishidohinata</a>')
		})
		it('should receive a function instead of a string.', function(){
			var href
			var link = tag('a').hasClass('btn').attr('href', function(){return href})
			href = 'http://shishidohinata.com'
			link('shishidohinata').should.be.equal('<a class="btn" href="http://shishidohinata.com">shishidohinata</a>')
		})
	})
	describe('#hasClass', function(){
		it('should return tag".', function(){
			var a = tag('a')
			a.hasClass('btn').should.be.equal(a)
		})
		it('should add a class.', function(){
			tag('span').hasClass('text-error')('This is error.')
			.should.be.equal('<span class="text-error">This is error.</span>')
		})
		it('should add multiple classes.', function(){
			tag('span').hasClass(['text-error', 'text-warning'])('This is error.')
			.should.be.equal('<span class="text-error text-warning">This is error.</span>')
		})
		it('should receive a function instead of a string.', function(){
			var href
			var link = tag('a').hasClass('btn').attr('href', function(){return href})
			href = 'http://shishidohinata.com'
			link('shishidohinata').should.be.equal('<a class="btn" href="http://shishidohinata.com">shishidohinata</a>')
		})
	})
	describe('#tag', function(){
		it('should append a tag', function(){
			var dt = tag('dt').t('shishido')
			var dd = dt.tag('dd')
			dd('soichiro').should.be.equal('<dt>shishido</dt><dd>soichiro</dd>')
		})
	})
	describe('#after', function(){
		it('should append a tag on the end.', function(){
			var div = tag('div').after(' shishido')
			div('soichiro').should.be.equal('<div>soichiro shishido</div>')
		})
	})
	describe('#define', function(){
		it('should register a tag', function(){
			var shishido = tag.define('shishido')
			tag.shishido.should.be.equal(shishido)
		})
		describe('#tagName', function(){
			it('should define a tag name', function(){
				var shishido = tag.define('shishido').tagName('div')
				shishido()('soichiro').should.be.equal('<div>soichiro</div>')
			})
		})
		describe('#attr', function(){
			it('should define a attr name', function(){
				var shishido = tag.define('shishido').tagName('div').attr('id')
				shishido().id('tom')('soichiro').should.be.equal('<div id="tom">soichiro</div>')
			})
		})
		describe('#hasClass', function(){
			it('should define a class', function(){
				var shishido = tag.define('shishido').tagName('div').hasClass('well')
				shishido()('soichiro').should.be.equal('<div class="well">soichiro</div>')
			})
		})
	})
})
