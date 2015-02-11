var expect = require('chai').expect

var word = require('../').word

describe('#word', function(done){
	var marker = word('test', function(src){
		return 'TEST'
	})
	it('should match a word', function(){
		var test = word(/test/, function(src){
			expect(src).to.equal('test')
			return src
		})
		test('abcd test efghi')
	})
	it('should replace a word to ', function(){
		expect(marker('abcd test efghi')).to.equal('abcd TEST efghi')
		expect(marker('abcdtestefghi')).to.equal('abcdtestefghi')
	})
})
