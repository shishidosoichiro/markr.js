(function (app) {
	app.register = function(name, f){
		functions[name] = f
		return f
	}

	var none = function(src){return src}
	none.parse = function(src){return new Node(src, true)}
	
	var source = function(regex){return regex instanceof RegExp ? regex.source : regex}

	var Node = function(string, nested, callback){
		this.children = [string]
		this.nested = nested
		this.callback = callback
	}
	Node.prototype = {
		constructor: Node,
		parseBy: function(parser){
			if (!this.nested) return this

			this.children = this.children.reduce(function(children, child){
				if (typeof child == 'string') {
					return children.concat(Node.parseBy(parser, child))
				}
				else {
					return children.concat(child.parseBy(parser))
				}
			}, [])
			return this
		},
		toString: function(){
			var string = this.children.reduce(function(string, child){
				return string + child.toString()
			}, '')
			return this.callback ? this.callback(string) : string
		}
	}
	Node.parseBy = function(parser, string){
		var result = []
		  , start = 0
		  , end = 0
		  , matched
		while ((matched = parser.regex.exec(string)) != null) {
			start = matched.index
			if (start > end) result.push(string.substring(end, start))
			end = start + matched[0].length
			result.push(new Node(string.substring(start, end), parser.nested, parser.callback))
		}
		if (end < string.length) result.push(string.substring(end))
		return result
	};

	(function(){
		var create = function(regex, nested, callback){
			var parser = function(src){
				return parser.parse(src).toString()
			}
			parser.parent = typeof this == 'function' ? this : none
			parser.regex = regex
			parser.nested = nested
			parser.callback = callback
			parser.parse = function(src){
				return this.parent.parse(src).parseBy(this)
			}
			parser.regexes = function(){
				var regexes = [this.regex] 
				var parent = this.parent
				while (parent != none) {
					regexes.unshift(parent.regex)
					parent = parent.parent
				}
				return regexes
			}
			parser.sources = function(){
				return this.regexes().map(source)
			}
			for (var name in functions) {
				parser[name] = functions[name]
			}
			return parser
		}

		var functions = {
			match: function(regex, callback){
				regex = typeof regex == 'string' ? new RegExp(regex, 'g') : regex
				return create.call(this, regex, false, callback)
			},
			word: function(words, callback){
				words = Array.prototype.slice.call(arguments, 0, -1);
				callback = Array.prototype.slice.call(arguments, -1)[0];
				var source = '(' + words.map(function(word){
					return '\\b' + (typeof word == 'string' ? word : word.source) + '\\b'
				}).map(function(source){
					return '(?:' + source + ')'
				}).join('|') + ')'
				var regex = new RegExp(source, 'g')
				return create.call(this, regex, false, callback)
			},
			prefix: function(prefixes, callback){
				prefixes = Array.prototype.slice.call(arguments, 0, -1);
				callback = Array.prototype.slice.call(arguments, -1)[0];
				var src = '(' + prefixes.map(function(prefix){
					return '(?:' + source(prefix) + '\\w+)'
				}).join('|') + ')'
				var regex = new RegExp(src, 'g')
				return create.call(this, regex, false, callback)
			},
			quote: function(quotes, callback){
				quotes = Array.prototype.slice.call(arguments, 0, -1);
				callback = Array.prototype.slice.call(arguments, -1)[0];
				var src = '(' + quotes.map(function(quote){
					var start = quote instanceof Array ? source(quote[0]) : source(quote)
					  , end = quote instanceof Array ? source(quote[1]) : source(quote)
					return start + '(?:[^\\\\' + end + ']|\\\\.)*' + end
				}).join('|') + ')'
				var regex = new RegExp(src, 'g')
				return create.call(this, regex, false, callback)
			},
			embed: function(start, end, callback, embedded){
				start = start instanceof RegExp ? start.source : start
				end = end instanceof RegExp ? end.source : end
				var source = start + '(?:(?:' + embedded.sources().join('|') + ')|[^\\1])*?' + end
				var regex = new RegExp(source, 'g')
				return create.call(this, regex, false, function(src){
					return src.replace(new RegExp('^(' + start + ')(.*)(' + end + ')$'), function(matched, start, content, end){
						return callback(start) + embedded(content) + callback(end)
					})
				})
			}
		}
		for (var name in functions) {
			app[name] = functions[name]
		}
	})();

	(function(){
		var create = function(parent, template){
			parent = typeof parent == 'function' ? parent : none
			var tag = function(src){
				return template.replace('{{src}}', parent(src))
			}
			for (var name in functions) {
				tag[name] = functions[name]
			}
			return tag
		}

		var functions = {
			addClass: function(className){
				var template = '<span class="{{className}}">{{src}}</span>'.replace('{{className}}', className)
				return create(this, template)
			},
			tooltip: function(text){
				var template = '<a href="#" data-toggle="tooltip" title="{{text}}">{{src}}</a>'.replace('{{text}}', text)
				return create(this, template)
			} 
		}
		for (var name in functions) {
			app[name] = functions[name]
		}
	})();
})(typeof exports === 'undefined' ? this.markr = {} : exports);
