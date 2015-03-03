(function(){
	var factory = function () {
		/*
		 * markr
		 * 
		 * var titleCase = function(t){return t.charAt(0).toUpperCase() + t.slice(1)}
		 * 
		 * var creep = markr()
		 * .match(/^creep .*?$/, tag('h1'))
		 * .word('creep', 'weido', tag('em'))
		 * .word('radiohead', titleCase)
		 * 
		 * creep('Creep by radiohead\n I\'m a creep. I\'m a weido. ')
		 * -> '<h1><em>Creep</em> by Radiohead</h1> I\'m a <em>creep</em>. I\'m a <em>weido</em>. '
		 * 
		 */
		var app = function(string){
			return parses.reduce(function(node, parse){
				return parse(node);
			}, new Node(string)).toString();
		};
		var parses = [];
		var regexes = [];
		var add = function(regex, locked, callback){
			parses.push(parse(regex, true, callback));
			regexes.push(regex);
		};
		app.sources = function(){
			return regexes.map(function(regex){return regex.source});
		};

		/*
		 * Node
		 * 
		 * a element structuring a tree made of a string.
		 * 
		 */
		var Node = function(){this.initialize.apply(this, arguments)};
		Node.prototype = {
			initialize: function(children, locked, callback){
				this.children = [].concat(children);
				this.callback = callback || function(s){return s};
				this.locked = locked;
			},
			toString: function(){
				return this.callback(this.children.reduce(function(string, child){
					return string.concat(child.toString());
				}, ''))
			},
			original: function(){
				return this.children.reduce(function(string, child){
					return string.concat(child.original ? child.original() : child.toString());
				}, '')
			}
		};

		/*
		 * parse
		 * 
		 * parse a string to a tree structure.
		 * 
		 */
		var parse = function(regex, locked, callback){
			var parseString = function(string){
				var result = [];
				var start = 0;
				var end = 0;
				var matched;
				while ((matched = regex.exec(string)) != null) {
						start = matched.index;
						if (start > end) result.push(string.substring(end, start))
						end = start + matched[0].length;
						result.push(new Node(string.substring(start, end), locked, callback));
				}
				if (end < string.length) result.push(string.substring(end));
				return result;
			}
			var parseNode = function(node){
				return new Node(node.children.reduce(function(list, child){
					if (child.locked) {
					}
					else if (child.children) {
						child = parseNode(child);
					}
					else {
						child = parseString(child);
					}
					return list.concat(child);
				}, []), node.locked, node.callback);
			}
			return parseNode;
		}

		var source = function(regex){
			if (typeof regex === 'undefined') return '';
			else if (typeof regex === 'string') return regex;
			else if (typeof regex !== 'object') return regex;

			if (regex instanceof RegExp) return regex.source;
			return regex.toString();
		}
		var slice = function(args, index, index2){
			return Array.prototype.slice.call(args, index, index2);
		}
		var last = function(args){
			return slice(args, -1)[0];
		}
		/**
		 * match, word, prefix, quote, embed
		 *
		 * var shishido = word('shishido', tag('em'))
		 *
		 * shishido('shishido soichiro')
		 * -> '<em>shishido</em> soichiro'
		 *
		 */
		app.match = function(regex, callback){
			var src = source(regex);
			add(new RegExp(src, 'g'), true, callback);
			return app;
		}
		app.word = function(words, callback){
			words = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(' + words.map(function(word){
				return '\\b' + source(word) + '\\b';
			}).map(function(source){
				return '(?:' + source + ')';
			}).join('|') + ')'
			add(new RegExp(src, 'g'), true, callback);
			return app;
		}
		app.prefix = function(prefixes, callback){
			prefixes = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(' + prefixes.map(function(prefix){
				return '(?:' + source(prefix) + '\\w+)';
			}).join('|') + ')';
			add(new RegExp(src, 'g'), true, callback);
			return app;
		}
		app.quote = function(quotes, callback){
			quotes = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(' + quotes.map(function(quote){
				var start = source(quote instanceof Array ? quote[0] : quote);
				var end = source(quote instanceof Array ? quote[1] : quote);
				return start + '(?:[^\\\\' + end + ']|\\\\.)*?' + end;
			}).join('|') + ')';
			add(new RegExp(src, 'g'), true, callback);
			return app;
		}
		app.embed = function(start, end, callback, embedded){
			start = source(start);
			end = source(end);
			var src = start + '(?:(?:' + embedded.sources().join('|') + ')|[^\\1])*?' + end;
			add(new RegExp(src, 'g'), true, function(src){
				return src.replace(new RegExp('^(' + start + ')(.*)(' + end + ')$'), function(matched, start, content, end){
					return callback(start) + embedded(content) + callback(end);
				});
			});
			return app;
		}

		return app;
	}
	if (typeof module === 'undefined') {
		this.markr = factory;
	}
	else {
		module.exports = factory;
	}
})()

