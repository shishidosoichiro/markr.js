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
			var result = [];
			var end = 0;
			match(app.regex(), string, function(matched){
				var position = findIndex(matched.slice(1), function(el){
					return el;
				}) + 1;
				var setting = find(settings, function(setting){
					return setting.position === position;
				});
				var start = matched.index;
				if (start > end) result.push(string.substring(end, start));
				end = start + matched[0].length;
				var captured = matched.slice(setting.position, setting.position + setting.count);
				result.push(setting.callback.apply(undefined, captured));
			});
			if (end < string.length) result.push(string.substring(end));
			return result.join('');
		};
		var settings = [];
		var add = function(src, callback){
			var setting = {
				source: src,
				callback: functionalize(callback),
				count: captureCount(src) + 1
			};
			var previous = settings[settings.length - 1];
			setting.position = previous ? previous.position + previous.count : 1;
			settings.push(setting)
		};
		app.sources = function(){
			return pluck(settings, 'source');
		};
		app.source = function(){
			return '(?:' + app.sources().map(function(src){
				return '(' + src + ')';
			}).join('|') + ')';
		};
		app.regex = function(){
			return new RegExp(app.source(), 'mg');
		};
		app.captureCount = function(){
			return captureCount(app.source());
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
		var captureCount = function(src){
			return new RegExp('(?:' + source(src) + '|(any))').exec('any').length - 2;
		};
		var match = function(regex, string, callback){
			var matched;
			while ((matched = regex.exec(string)) !== null) {
				callback(matched);
			}
		}
		var slice = function(array, begin, end){
			return Array.prototype.slice.call(array, begin, end);
		};
		var last = function(array){
			return slice(array, -1)[0];
		};
		var findIndex = function(array, callback){
			var index;
			array.some(function(el, i){
				index = i;
				return callback.apply(this, arguments)
			})
			return index;
		};
		var find = function(array, callback){
			var found;
			array.some(function(el){
				found = el;
				return callback.apply(this, arguments)
			})
			return found;
		};
		var pluck = function(collection, key){
			return collection.map(function(el){
				return el[key];
			})
		};
		var functionalize = function(f){
			return typeof f === 'function' ? f : function(){return f};
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
		app.quote = function(quotes, options, callback){
			quotes = slice(arguments, 0, -1);
			callback = last(arguments);
			options = last(quotes);
			if (typeof options === 'string' || options instanceof Array || options instanceof RegExp) {
				options = undefined;
			}
			var escape = source(options ? options.escape : /\\./);
			var src = '(?:' + quotes.map(function(quote){
				var start = source(quote instanceof Array ? quote[0] : quote);
				var end = source(quote instanceof Array ? quote[1] : quote);
				return start + '(?:[^\\\\' + end + ']|' + escape + ')*?' + end;
//				return start + '(?:(?:(?!' + end + ').)*|' + escape + ')*?' + end;
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
