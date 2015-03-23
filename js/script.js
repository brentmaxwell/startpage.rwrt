/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat
	<http://rahforum.biz>
	<http://crshd.cc>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/* Settings *\
\*==========*/
var settings = {
	"navigation": {
		"newWindow": true
	},
	
	"search": {
		"engines": [
			["http://www.google.com/search", "q", "Google"],
		],
		"newWindow": true,
		"focusSearch": false
	},
	
	"clock": {
		"showClock": true
	}
};

/*  Clock  *\
\*=========*/
function updateClock() {
	var currentTime = new Date ();
	var currentHours = currentTime.getHours ();
	var currentMinutes = currentTime.getMinutes ();
	var currentSeconds = currentTime.getSeconds ();

	// Pad the minutes and seconds with leading zeros, if required
	currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
	currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

	// Choose either "AM" or "PM" as appropriate

	// Compose the string for display
	var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;

	// Fill '#clock' div with time
	$("#clock").html(currentTimeString);
}

function searchBox(url, name, placeholder) {
	var string = '<form method="get" action="' + url + '"'
		   + settings.navigation.newWindow ? target="_blank" : ''
		   + '>'
	           + '<input type="text" id="g" name="' + name + '" placeholder="' + placeholder + '" maxlength="255" value="">'
	           + '<input type="submit" value="Go">'
	           + '</form>';
	return string;
}

$(document).ready(function() {

	var shortcuts = {};
	
	/*  Get Links  *\
	\*=============*/
	var linkString = $('body').text();

	/*  Clear Page  *\
	\*==============*/
	$('body').empty();

	/*  Create Array from linkString  *\
	\*================================*/
	var linkArray = linkString.split("\n");

	/*  Go thru Array  *\
	\*=================*/
	var i;
	var count = 1;
	var html = '';

	for(i in linkArray) {

		/*  Get line  *\
		\*============*/
		var line = jQuery.trim(linkArray[i]);

		// If line is empty, skip
		if(!line) continue;

		/*  If it doesn't contain "://",  *\
		|*  it's not a URL                *|
		\*================================*/
		if(/:\/\//.test(line) != true) {
			if(count > 1) {
				html = html + '</div>';
			}
			html = html + '<div class="block"><h1>' + line + '</h1><ul>';
			count++;
			continue;
		}

		/*  Split URL and Title  *\
		\*=======================*/
		var lineArray = line.split(" || ");
		var url = lineArray[0];
		var title = lineArray[1];
		
		/*  Add to shortcuts array *\
		\*=========================*/
		if(lineArray[2]) {
			shortcuts[lineArray[2]] = url;
		}

		/*  Add HTML code  *\
		\*=================*/
		if(settings.navigation.newWindow) {
			html = html + '<li><a href="' + url + '" target="_blank">' + title + '</a></li>'
		}
		else {
			html = html + '<li><a href="' + url + '">' + title + '</a></li>'
		}
	}

	/*  Add generated content to page  *\
	\*=================================*/
	html = html + '</ul></div>';
	$('body').append(html);


	/*  Animation Time!  *\
	\*===================*/
	
	/*  Hide lists  *\
	\*==============*/
	$('ul').slideUp();

	/*  Show on hover  *\
	\*=================*/
	$('.block').mouseenter(function() {
		$('ul', this).slideDown();
	});

	/*  Hide on unhover  *\
	\*===================*/
	$('.block').mouseleave(function() {
		$('ul', this).slideUp();
	});


	/*  Search Engines  *\
	\*==================*/

	var search = '<div id="searches">';

	for (var i = 0; i < settings.search.engines.length; i++) {
		var engine = settings.search.engines[i];
		search = search + searchBox(engine[0], engine[1], engine[2]);
	}

	search = search + '</div>';

	/*  Add to page  *\
	\*===============*/
	$('body').append(search);
	if(settings.search.focusSearch) {
		var searchDiv = document.getElementById ('searches');
		$(searchDiv.firstChild.firstChild).focus();
	}
 
	/*  Clock  *\
	\*=========*/

	if(settings.clock.showClock) {
		// Add empty '#clock' div
		$('body').append('<div id="clock"></div>');

		// Update clock
		setInterval('updateClock()', 1000);
	}


	/*  Keybindings  *\
	\*===============*/

	var typed = '';
	var shortcutArray = Object.keys(shortcuts);
		
	// Check if we typed a keybinding
	function hasSubstring(element) {
		var index = typed.indexOf(element);
		if(index >= 0) {
			var sliced = typed.slice(index, typed.length);
			typed = ''; // Clean typed, so that we can watch for the next keybinding
			if(settings.navigation.newWindow) {
				window.open(shortcuts[sliced]);
			} else {
				window.location.replace(shortcuts[sliced]);
			}
		}
	}

	// React on keypress
	$(window).keypress(function(e) {
		
		// If we're in an input, we don't want to interpret the keypresses
		$('input').keypress(function(e) {
			e.stopPropagation();
		});
		
		// Keep track of pressed keys
		typed = typed + e.key;


		shortcutArray.some(hasSubstring);
	});

});
