/*!
 * Josiah Ruddell JUI JavaScript
 *
 * Copyright (c) 2009 Josiah Ruddell, http://josiahruddell.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Date: 03.19.2010
 */
var JUI = { 
	// instantiator
	desktop: function(config) {
		var self = this;
		// instantiator
		self.window = function(winConfig) { 
			var win = new JUI.window(winConfig || config.window);
			self.windows.push(win);
			return win;
		}
		// collection
		self.windows = [
			//active window objects
		];
		
		return self;
	},
	// instantiator
	window: function(config){
		return {
			setZIndex: function(){  }
		}; // creates window 
	},
	effects: function(){
		var self = {};
		 self._flickerOut = function (el, config) {
            var el = $(el).filter(':not(:hidden)');
			if(el.length > 0)
				el.animate({ opacity: .75 }, 25)
					.animate({ opacity: 1}, 25).animate({ lala: 1 }, 25)
					.animate({ opacity: .75 }, 25).animate({ opacity: 1 }, 25)
					.animate({ lala: 1 }, 75).animate({ opacity: .5 }, 25)
					.animate({ opacity: 1 }, 25).animate({ lala: 1 }, 25)
					.animate({ opacity: .5 }, 25).animate({ opacity: 1 }, 25)
					.animate({ lala: 1 }, 100).animate({ opacity: 0 }, 200, function(){ el.hide().css({opacity: 1}); })
        }
		self._flickerIn = function (el, config) {
            var el = $(el).css({opacity: '0'});
			if(el.length > 0)
				el.show()
					.animate({ opacity: .10 }, 25).animate({ opacity: 0}, 25)
					.animate({ lala: 1 }, 25).animate({ opacity: .10 }, 25)
					.animate({ opacity: 0 }, 25).animate({ lala: 1 }, 75)
					.animate({ opacity: .30 }, 25).animate({ opacity: .10 }, 25)
					.animate({ lala: 1 }, 25).animate({ opacity: .30 }, 25)
					.animate({ opacity: .40 }, 25).animate({ lala: 1 }, 100)
					.animate({ opacity: 1 }, 200)
        }
		return {
			flicker: function(el, config){ // config {remove, etc}
				var el = $(el)
				if(el.length > 0 && el.is(':hidden'))
					self._flickerIn(el);
				else if(el.length > 0)
					self._flickerOut(el);
			},
			_self: self
		}
	}()
};
/*
var desktop = new JUI.desktop({
	window: {},
	menu: {}
});

var newWindow = new desktop.window();
*/

$(function(){
	$(document).bind('selectstart', function() {return false;});
	$('.menu').sortable({items: 'li'});
	$('.menu a').click(function(){
		JUI.effects.flicker('.window');
		return false;
	});
});