var expect = require('chai').expect
require('chai').should()

var markr = require('../markr')
  , tag = require('../tag')

describe('markr', function(){
	describe('#match', function(done){
		it('should match a regexp.', function(done){
			var test = markr().match(/(?:123){3}/, function(src){
				src.should.be.equal('123123123')
				done()
			})
			test('123456789012312312345678901231234567890')
		})
		it('should replace a string matched with a regexp.', function(){
			var test = markr().match(/(?:123){3}/, function(src){
				return 'TEST'
			})
			test('123456789012312312345678901231234567890').should.be.equal('1234567890TEST45678901231234567890')
		})
		it('should replace multiple strings matched with a regexp.', function(){
			var test = markr().match(/89.?/, function(src){
				return 'TEST'
			})
			test('1234567890123123123456789D1231234567890').should.be.equal('1234567TEST1231231234567TEST1231234567TEST')
		})
		it('should be able to capture', function(){
			var test = markr().match(/\*(.+?)\*/, function(src, text){
				return '<em>' + text + '</em>'
			})
			test('Michael *Air* Jordan').should.be.equal('Michael <em>Air</em> Jordan')
		})
	})

	describe('#word', function(){
		it('should match a word', function(done){
			var test = markr().word('test', function(src){
				src.should.be.equal('test')
				done()
			})
			test('abcd test efghi')
		})
		it('should replace a word to something', function(){
			var test = markr().word('test', function(src){
				return 'TEST'
			})
			test('abcd test efghi').should.be.equal('abcd TEST efghi')
			test('abcdtestefghi').should.be.equal('abcdtestefghi')
		})
		it('should replace multiple words to something', function(){
			var test = markr()
			.word('test', function(src){
				return src.toUpperCase()
			})
			.word('bcd', function(src){
				return '123'
			})
			test('a bcd test efghi').should.be.equal('a 123 TEST efghi')
			test('a(bcd)testefghi').should.be.equal('a(123)testefghi')
		})
		it('should replace a regexp to something', function(){
			var test = markr().word(/[0-9]{1,3}/, function(src){
				return 'TEST'
			})
			test('ab12cde(1)fg$1234$hi#786#jklmn').should.be.equal('ab12cde(TEST)fg$1234$hi#TEST#jklmn')
		})
	})

	describe('#prefix', function(){
		it('should match a prefix', function(done){
			var i = 0
			var test = markr().prefix('#', function(src){
				src.substring(0, 1).should.be.equal('#')
				i++;
				switch(i){
				case 1:
					src.should.be.equal('#if')
					break;
				case 2:
					src.should.be.equal('#endif')
					done()
				}
			})
			test('#if hoge #endif')
		})
		it('should replace a word with the prefix to something', function(){
			var test = markr().prefix('\\$', function(src){
				return 'a male'
			})
			test('shishidosoichiro is $sex.').should.be.equal('shishidosoichiro is a male.')
		})
		it('should replace multiple word with the prefix to something', function(){
			var test = markr().prefix('\\$', function(src){
				return 'a male'
			})
			test('shishidosoichiro is $sex. and also shishidohinata is $sex.')
			.should.be.equal('shishidosoichiro is a male. and also shishidohinata is a male.')
		})
		it('should replace a word with the prefix made by a regexp to something', function(){
			var test = markr().prefix(/9{3}/, function(src){
				return '000'
			})
			test('090-9992-9987').should.be.equal('090-000-9987')
		})
	})

	describe('#quote', function(){
		it('should match a quote', function(done){
			var i = 0
			var test = markr().quote('"', function(src){
				src.substr(0, 1).should.be.equal('"')
				src.substr(-1).should.be.equal('"')
				i++;
				switch(i){
				case 1:
					src.should.be.equal('"cd"')
					break;
				case 2:
					src.should.be.equal('"ghij"')
					break;
				case 3:
					src.should.be.equal('""')
					done()
				}
			})
			test('ab"cd"ef"ghij"klmnopqrs""tu')
		})
		it('should replace a quote to something', function(){
			var test = markr().quote('"', function(src){
				return 'TEST'
			})
			test('ab"cd"ef"ghij"klmnopqrs""tu').should.be.equal('abTESTefTESTklmnopqrsTESTtu')
		})
		it('should replace multiple kind of quotation to something', function(){
			var test = markr().quote('"', "'", function(src){
				return 'TEST'
			})
			test('ab"cd"ef"gh\'i\'j"klmnop\'q\'rs""tu').should.be.equal('abTESTefTESTklmnopTESTrsTESTtu')
		})
		it('should escape a quote with \\', function(){
			var test = markr().quote('"', function(src){
				return 'TEST'
			})
			test('ab"cd"ef"ghi\\"j"klmnopqrs""tu').should.be.equal('abTESTefTESTklmnopqrsTESTtu')
		})
		it('should match ', function(){
			var test = markr().quote(['\\/\\*', '\\*\\/'], function(src){
				return '<span class="comment">' + src + '</span>'
			})
			test('\\t/* Alert */\\n\\tconsole.log("that is all ok.")\\n').should.be.equal('\\t<span class="comment">/* Alert */</span>\\n\\tconsole.log("that is all ok.")\\n')
		})
		it('should match ', function(){
			var test = markr().quote(/\//, function(src){
				return '<span class="regex">' + src + '</span>'
			})
			test(' /shishido/ ').should.be.equal(' <span class="regex">/shishido/</span> ')
		})

		/*
		it('should match ', function(){
			var test = markr().quote(['//', '$'], function(src){
				return '<span class="comment">' + src + '</span>'
			})
			test('\\t// Alert \\n\\tconsole.log("that is all ok.")\\n').should.be.equal('\\t<span class="comment">// Alert </span>\\n\\tconsole.log("that is all ok.")\\n')
		})
		*/
	})

	describe('#embed', function(){
		it('should match a regexp.', function(){
			var embedded = markr()
			.word('get', function(src){
				src.should.be.equal('get')
				return '<span class="method">' + src + '</span>'
			})
			.word('User', function(src){
				src.should.be.equal('User')
				return '<span class="prototype">' + src + '</span>'
			})
			var i = 0
			var test = markr().embed('\\$\\{', '\\}', function(src){
				i++;
				switch(i){
				case 1:
					src.should.be.equal('${')
					return '<span class="start">' + src + '</span>';
				case 2:
					src.should.be.equal('}')
					return '<span class="end">' + src + '</span>';
				}
			}, embedded)
			test('shishido soichiro is ${User.get("shishido soichiro").name}')
			.should.be.equal('shishido soichiro is <span class="start">${</span><span class="prototype">User</span>.<span class="method">get</span>("shishido soichiro").name<span class="end">}</span>')
			i.should.be.equal(2)
		})
	})

	describe('#captureCount', function(){
		it('should return captureCount', function(){
			var test = markr()
			.word('shishido', function(){return 'TEST1'})
			.word('soichiro', function(){return 'TEST2'});
			test.captureCount().should.be.equal(2);
		})
		it('should return captureCount 2', function(){
			var test = markr()
			.match(/sh(ish)ido/, function(){return 'TEST1'})
			.word('soichiro', function(){return 'TEST2'});
			test.captureCount().should.be.equal(3);
		})
	})

	it('should match multiple settings.', function(){
		var test = markr()
		.match(/(?:123){3}/, function(src){
			src.should.be.equal('123123123')
			return 'match'
		})
		.word('shishido', function(src){
			src.should.be.equal('shishido')
			return 'SHISHIDO'
		})
		test('123456789012312312345678901231234567890 shishido eeeeee')
		.should.be.equal('1234567890match45678901231234567890 SHISHIDO eeeeee');
	})

	it('should match correctly competitive regexps.', function(){
		var test = markr()
		.quote('"', function(src){
			return '#quote#'
		})
		.match(/\/(?:(?!\/).)*\//, function(src){
			return '#regex#'
		})
		test('var matched = /shis"h"ido/.exec("shish/i/do");')
		.should.be.equal('var matched = #regex#.exec(#quote#);');
	})

})

