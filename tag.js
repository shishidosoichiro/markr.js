(function(){
	/**
	 * tag
	 *
	 * var h1 = tag('h1').hasClass('title').attr('data-toggle', 'collapse')
	 *
	 * h1('tremendous title')
	 * -> '<h1 class="title" data-toggle="collapse">tremendous title</h1>'
	 *
	 */
	var factory = function (name) {
		var attrs = [];
		var classes = [];
		var fs = [];
		var befores = [];
		var afters = [];
		var previous = '';
		var tag = function(src){
			var call = proxy(this);
			if (typeof src === 'function') {
				Array.prototype.forEach.call(arguments, function(arg){
					tag.before(arg);
				});
				return tag;
			};
			var classString = classes.length <= 0 ? '' : ' class="' + classes.map(call).join(' ') + '"';
			var attrsString = attrs.length <= 0 ? '' : ' ' + attrs.map(function(a){
				return call(a.name) + '="' + call(a.value) + '"';
			}).join(' ');
			var before = befores.map(call).join('');
			var after = afters.map(call).join('');
			return call(previous) + '<' + call(name) + classString + attrsString + '>' + before + call(src) + after + '</' + call(name) + '>';
		};
		tag.attr = function(name, value){
			if (typeof name === 'undefined') {}
			else if (name instanceof Array) {
				name.forEach(function(attr){
					tag.attr(attr);
				});
			}
			else if (typeof name === 'object') {
				attrs.push(name);
			}
			else attrs.push({name: name, value: value});
			return this;
		};
		tag.hasClass = function(name){
			if (typeof name === 'undefined') {}
			else if (name instanceof Array) {
				name.forEach(function(c){
					tag.hasClass(c);
				});
			}
			else classes.push(name);
			return this;
		};
		tag.before = function(f){
			befores.push(f);
			return this;
		}
		tag.after = function(f){
			afters.push(f);
			return this;
		}
		tag.tag = function(name){
			return factory(name).previous(tag);
		}
		tag.t = function(f){
			befores.push(f);
			return this;
		}
		tag.previous = function(f){
			previous = f;
			return this;
		}
		return tag;
	};
	var proxy = function(thisArg){
		return function(src){
			switch(typeof src) {
			case 'function':
				return src.call(thisArg);
			case 'undefined':
				return '';
			default:
				return src.toString();
			}
		};
	};
	factory.define = function(name){
		var tagName = '';
		var attrs = [];
		var classes = [];
		var definer = this[name] = function(){
			var tag = factory(tagName);
			attrs.forEach(function(name){
				tag[name] = function(value){return tag.attr(name, value)};
			});
			classes.forEach(function(name){
				tag.hasClass(name);
			});
			return tag;
		};
		definer.tagName = function(name){
			tagName = name;
			return this;
		};
		definer.attr = function(name){
			attrs.push(name);
			return this;
		};
		definer.hasClass = function(name){
			classes.push(name);
			return this;
		};
		return definer;
	};
	if (typeof module === 'undefined') {
		this.tag = factory;
	}
	else {
		module.exports = factory;
	}
})();
