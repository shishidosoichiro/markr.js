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
			var regex = app.regex();
			var result = [];
			var end = 0;
			var matched;
			while ((matched = regex.exec(string)) !== null) {
				var index = findIndex(matched, 1, function(el){
					return el;
				});
				var callback = callbacks[index - 1];
				var start = matched.index;
				if (start > end) result.push(string.substring(end, start));
				end = start + matched[0].length;
				result.push(callback(string.substring(start, end)));
			}
			if (end < string.length) result.push(string.substring(end));
			return result.join('');
		};
		var sources = [];
		var callbacks = [];
		var add = function(src, callback){
			sources.push(src);
			callbacks.push(callback);
		};
		app.sources = function(){
			return sources;
		};
		app.source = function(){
			return '(?:' + sources.map(function(src){
				return '(' + src + ')'
			}).join('|') + ')';
		};
		app.regex = function(){
			return new RegExp(app.source(), 'mg');
		};
		/*
		 * Utilities
		 * 
		 */
		var source = function(regex){
			if (typeof regex === 'undefined') return '';
			else if (typeof regex === 'string') return regex;
			else if (typeof regex !== 'object') return regex;

			if (regex instanceof RegExp) return regex.source;
			return regex.toString();
		};
		var slice = function(args, index, index2){
			return Array.prototype.slice.call(args, index, index2);
		};
		var last = function(args){
			return slice(args, -1)[0];
		};
		var findIndex = function(array, start, callback){
			var index;
			array.some(function(el, i){
				if (i < start) return false;
				if (callback.apply(this, arguments)) {
					index = i;
					return true;
				}
			})
			return index;
		};

		/**
		 * match, word, prefix, quote, embed
		 *
		 * var shishido = word('shishido', tag('em'))
		 *
		 * shishido('shishido soichiro')
		 * -> '<em>shishido</em> soichiro'
		 *
		 */
		app.match = function(regexes, callback){
			regexes = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(?:' + regexes.map(source).map(function(source){
				return '(?:' + source + ')';
			}).join('|') + ')';
			add(src, callback);
			return app;
		};
		app.word = function(words, callback){
			words = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(?:' + words.map(function(word){
				return '\\b' + source(word) + '\\b';
			}).map(function(source){
				return '(?:' + source + ')';
			}).join('|') + ')';
			add(src, callback);
			return app;
		};
		app.prefix = function(prefixes, callback){
			prefixes = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(?:' + prefixes.map(function(prefix){
				return '(?:' + source(prefix) + '\\w+)';
			}).join('|') + ')';
			add(src, callback);
			return app;
		};
		app.quote = function(quotes, callback){
			quotes = slice(arguments, 0, -1);
			callback = last(arguments);
			var src = '(?:' + quotes.map(function(quote){
				var start = source(quote instanceof Array ? quote[0] : quote);
				var end = source(quote instanceof Array ? quote[1] : quote);
				return start + '(?:[^\\\\' + end + ']|\\\\.)*?' + end;
			}).join('|') + ')';
			add(src, callback);
			return app;
		};
		app.embed = function(start, end, callback, embedded){
			start = source(start);
			end = source(end);
			var src = start + '(?:(?:' + embedded.sources().join('|') + ')|[^\\1])*?' + end;
			add(src, function(src){
				return src.replace(new RegExp('^(' + start + ')(.*)(' + end + ')$'), function(matched, start, content, end){
					return callback(start) + embedded(content) + callback(end);
				});
			});
			return app;
		};

		return app;
	};
	if (typeof module === 'undefined') {
		this.markr = factory;
	}
	else {
		module.exports = factory;
	}
})();
