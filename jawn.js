/*	jawn.js ------------------------------------------------------------------*/
/*	by austin for free -------------------------------------------------------*/
/*	license: MIT -------------------------------------------------------------*/
(function () {
	"use strict";

	if (typeof window === 'undefined') {
		var _ = require('underscore');
	}


	// Let's do this y'all.
	var jawn = {};

	// interprets a standard URL querystring into a usable, typed object.
	// e.g.
	//	jawn.parseQuery('?name=Alfred%20Bootin&height=6.05&tickets=false&style=')
	//	--> {
	//		name: 'Alfred Bootin',
	//		height: 6.05,
	//		tickets: false,
	//		style: null
	//	}
	jawn.parseQuery = function (queryString) {
		var queryArray = queryString.split('&'),
			output = [],
			x,
			key,
			val;
		_.each(queryArray, function (set) {
			x = set.split('=');
			key = x[0];
			val = (x[1] != null ? x[1] : null);

			if (val === '') { val = null; }
			else if (val === 'true') { val = true; }
			else if (val === 'false') { val = false; }
			else if (val === val + 0) { val = val + 0; }
			else { val = decodeURIComponent(val); }

			if (key && key.length) {
				output[key] = val;
			}
		});
		return output;
	}

	// converts plaintext to HTML-- basic at the moment. Converts newline to <br>.
	// e.g.
	//	jawn.textToHtml('My first paragraph.\nSecond Paragraph!');
	//	--> 'My first paragraph.<br />Seconds Paragraph!'
	jawn.textToHtml = function (text) {
		return text.replace('\n', '<br />');
	}

	// deconstructs a path/url into an array of components
	// e.g.
	//		jawn.pathify('C://Windows/System32/Frameworks/Crap/WindowsBlows.lol')
	//		--> ['C:', 'Windows', 'System32', 'Frameworks', 'Crap', 'WindowsBlows.lol']
	//		jawn.pathify('/assets/photos/MIKHAIL_prom/GoMishaGo!.jpg')
	//		--> ['assets', 'photos', 'MIKHAIL_prom', 'GoMishaGo!.jpg']
	jawn.pathify = function (path) {
		path = path.substring(0,1) === '/' ? path.substring(1) : path;
		path = path.substring(-1) === '/' ? path.substring(0, -1) : path;
		return _.compact(path.split('/'));
	}

	// uses .pathify() to extract the last element from a given path
	// e.g.
	//		jawn.filenameFromPath('/images/wine/merlot/fancy_shit.png')
	//		--> 'fancy_shit.png'
	jawn.filenameFromPath = function (path) {
		var pathParts = jawn.pathify(path);
		return (pathParts.length ? pathParts[pathParts.length - 1] : null);
	}

	// Returns path, minus the filename, if one exists (i.e. one with a period), with trailing slash.
	// If force is a truthy value, it will remove the final path part despite a lack of period.
	// e.g.
	//	jawn.pathWithoutFilename('/photos/grandma/scary.jpg')
	//	--> '/photos/grandma/'
	//	jawn.pathWithoutFilename('/dir/certainlyAnotherDir/', false)
	//	--> '/dir/possiblyAnotherDir/'
	//	jawn.pathWithoutFilename('/dir/possiblyAnotherDir/', true)
	//	--> '/dir/'
	jawn.pathWithoutFilename = function (path, force) {
		force = force || false;
		if (jawn.containsPeriod(path) || force) {
			var pathParts = jawn.pathify(path);
			if (!pathParts) return null;
			pathParts.pop();
			return pathParts.join('/') + '/';
		} else {
			return path;
		}
	}

	// if string contains period rtn true
	// e.g.
	//		jawn.containsPeriod('file.xml')
	//		--> true
	//		jawn.containsPeriod('i stole the guitar, though')
	//		--> false
	jawn.containsPeriod = function (input) {
		return input && input.length && input.indexOf('.') !== -1;
	}

	// returns just the file extension, unless there is none, in which case the
	// input is returned, unless `hard` is a truthy value, in which case false is.
	// e.g.
	//		jawn.getFileExtension('seasonsChange.svg')
	//		--> 'svg'
	//		jawn.getFileExtension('WTF_broooooo?')
	//		--> 'WTF_broooooo?''
	//		jawn.getFileExtension('stoic', true)
	//		--> false
	jawn.getFileExtension = function (input, hard) {
		return jawn.containsPeriod(input) ? input.substring(input.lastIndexOf('.') + 1) : hard ? false : input;
	}

	// returns everything up to file extension
	// e.g.
	//		jawn.removeFileExtension('InedibleNachos.png')
	//		-->	'InedibleNachos'
	jawn.removeFileExtension = function (input, hard) {
		return jawn.containsPeriod(input) ? input.substring(0, input.indexOf('.')) : hard ? false : input;
	}

	// insert addendum onto filename before file extension
	// e.g.
	//		jawn.appendToFilename('photos/mom/gotNOteeth.jpg', '_edited')
	//		-->	'photos/mom/gotNOteeth_edited.jpg'
	jawn.appendToFilename = function (filename, addendum) {
		var pre = jawn.removeFileExtension(filename);
		var post = jawn.getFileExtension(filename);
		return pre + addendum + '.' + post;
	}

	// pass various values/dirnames to automatically build a path/url from them
	// intelligently handles URLs, and dotpath prefixes, never with trailing slash
	// e.g.
	// 		jawn.autopath('http://sick-site.com', 'vids', 'category/ZAP', '/vid.swf')
	//		--> 'http://sick-site.com/vids/category/ZAP/vid.swf'
	jawn.autopath = function () {
		var pathParts = arguments;
		var output = '';
		_.each(pathParts, function (part, idx) {
			if (idx === 0 && part.substring(0, 1) === '.' && part.substring(0, 2) === './') {
				output += './';
				part = part.substring(2);
			} else if (idx === 0 && part.indexOf('http://') === 0) {
				output += 'http://';
				part = part.substring(7);
			} else if (idx === 0 && part.indexOf('https://') === 0) {
				output += 'https://';
				part = substr(part, 8);
			} else if (output.substring(-1) !== '/') {
				output += '/';
			}
			if (part.substring(0, 1) === '/') {
				part = part.substring(1);
			}
			if (part.substring(-1) === '/') {
				part = part.substring(0, -1);
			}
			output += part;
		});
		return output;
	}

	// generate classes for FontAwesome icons, useful in ng-class
	// e.g.
	//	jawn.fa('home')
	//	--> 'fa fa-home'
	jawn.fa = function (icon) {
		if (!icon || !_.isString(icon)) return null;
		return 'fa fa-' + icon;
	}

	// generates background-image css image string. also can generate object
	// with either camelCase or hephen-style property name, useful in <ng-style>
	// e.g.
	//	jawn.bgi('assets/bg.jpg')
	//	--> 'url("assets/bg.jpg")'
	//	jawn.bgi('img/wall.png', true, true)
	//	--> { backgroundImage: 'url("img/wall.png")' }
	jawn.bgi = function (image, objMode, camelCase) {
		if (!image) return null;
		var s = 'url("' + image + '")';
		return !objMode ? s : (camelCase ? { backgroundImage: s } : { 'background-image': s });
	}

	// generates a URL-friendly slug for input, retaining alphanumeric characters
	// and replacing spaces with separator, '-' by default.
	// e.g.
	//	jawn.slug('My SUPER cool new WEBSITE!!! Yay~')
	//	--> 'my-super-cool-new-website-yay'
	//	jawn.slug("this one's different", '_')
	//	--> 'this_ones_different'
	jawn.slug = function (input, separator) {
		if (!separator) separator = '-';
		return input ? input.toLowerCase().replace(/-'+/g, '').replace(/\s+/g, separator).replace(/[^a-z0-9-]/g, '') : null;
	}

	// checks if fileName has a common image file extension (listed below)
	// e.g.
	//	jawn.hasImageExt('files/deep/folder/test.jpg')
	//	--> true
	jawn.hasImageExt = function (fileName) {
		return _.some(['jpg','png','svg','jpeg','gif','bmp'], function (t) {
			return fileName.lastIndexOf('.' + t) === fileName.length - (t.length + 1);
		});
	}

	// Wraps x in two escaped newlines. Useful for spacing out console.log() statements.
	// e.g.
	//	jawn.wrapDoubleBreaks('WTF BRO')
	//	--> '\n\nWTF BRO\n\n
	jawn.wrapDoubleBreaks =  function (x) {
		return "\n\n" + x + "\n\n";
	}

	// uppercase the first letter
	// e.g.
	//	jawn.ucFirst('lowercase')
	//	--> 'Lowercase'
	jawn.ucFirst = function (s) {
		return (s && _.isString(s) && s.length ? s[0].toUpperCase() + s.slice(1) : s);
	}

	// lowercase the first letter
	// e.g.
	//	jawn.lcFirst('Uppercase')
	//	--> 'uppercase'
	jawn.lcFirst = function (s) {
		return (s && _.isString(s) && s.length ? s[0].toLowerCase() + s.slice(1) : s);
	}

	// simple check for number-ness
	// e.g.
	//	jawn.isNumeric('15.4')
	//	--> true
	//	jawn.isNumeric('Unoriginal Antiques')
	//	--> false, man y'all triflin that ain't even close to a number dawg
	jawn.isNumeric = function (x) {
		return !_.isArray(x) && (x - parseFloat(x) + 1) >= 0;
	}

	// simple check for ALL CAPS-NESS (actually for lack of lowercase-ness)
	//	jawn.isUppercase('Suh dude?')
	//	--> false
	//	jawn.isUppercase('LOL JERK')
	//  --> true
	//	jawn.isUppercase('$#$%&#$&')
	//	--> true (is this a defect or non-issue?)
	jawn.isUppercase = function (str) {
	  return (_.isString(str) && str.length && str.toUpperCase() === str);
	}

	// converts a value to camelCase, splitting by spaces, commas, and underscores
	// Leaves ALLCAPS untouched unless overrideAllCaps is truthy.
	// Retains initial underscore (_) if present, lowercases first letter.
	// e.g.
	//	jawn.toCamelCase('My_Cool_Var_Name')
	//	--> 'myCoolVarName'
	//	jawn.toCamelCase('leave-me-alone, bob')
	// --> 'leaveMeAloneBob'
	jawn.toCamelCase = function (input, overrideAllCaps) {
	  if (!_.isString(input) || !input.length) return input;
		if (!overrideAllCaps && jawn.isUppercase(input)) return input;
		var _prefix = (input.indexOf('_') === 0);
	  var output = input.replace(/[^a-zA-Z0-9-\s]/g, ' ').split(/[\s-,_+]+/);
	  output = _.map(output, jawn.ucFirst);
	  output = output.join('');
	  output = jawn.lcFirst(output);
		output = (_prefix ? '_' : '') + output;
	  return output;
	}

	// If a value is numeric, turn it into a number of the appropriate type
	// e.g.
	//	jawn.castNumberTypes('4')
	//	--> 4 (int)
	//	jawn.castNumberTypes('103434.4040')
	//	--> 103434.4040 (float)
	jawn.castNumberTypes = function (x) {
	  return jawn.isNumeric(x) ? (x * 1) : x;
	}

	// Deep checks if nested period-separated properties (prop) exist on obj
	// like Underscore's _.has(obj, propertyName) but can go many levels deep.
	// Accepts integer values to search for array indices as well.
	// e.g.
	//	var deep = { firstLevel: { secondLevel: { thirdLevel: ["Limbo"] } } }
	//	jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel')
	//	--> true
	//	jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.Limbo')
	//	--> false (it's an array item of thirdLevel)
	//	jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.0')
	//	--> true (it's the 0 index)
	jawn.hath = function (obj, props) {
	  if (!_.isObject(obj)) return undefined;
	  var propList = _.map(props.split('.'), jawn.castNumberTypes);
	  while (propList.length) {
	    if (_.has(obj, propList[0])) {
	      if (propList.length === 1) return true;
	      obj = obj[propList.shift()];
	    } else return false;
	  }
	  return false;
	}

	// Returns the value of targetProp (a period-separated property path)
	// from deep within obj, if it exists. Otherwise, false.
	// e.g.
	//	var deepAF = { firstLevel: { secondLevel: { thirdLevel: { treasure: true } } } }
	//	jawn.extrude(deepAF, 'firstLevel.secondLevel.thirdLevel')
	//	--> { treasure: true }
	//	jawn.extrude(deepAF, 'firstLevel.secondLevel.secretPathway')
	//	--> false
	jawn.extrude = function (obj, targetProp) {
	  if (!_.isObject(obj) || !jawn.hath(obj, targetProp)) return null;
	  var targetProps = _.map(targetProp.split('.'), jawn.castNumberTypes);
	  while (targetProps.length) obj = obj[targetProps.shift()];
	  return obj;
	}

	jawn.intrude = function (obj, targetProp, replacement) {
		if (!_.isObject(obj) || !jawn.hath(obj, targetProp)) return null;
		var propTrail = _.reduce(targetProp.split('.'), function (out, prop) {
			return out + '[' + (jawn.isNumeric(prop) ? prop : '\'' + prop + '\'') + ']';
		}, '');
		eval('obj' + propTrail + ' = replacement;');
		return obj;
	}

	jawn.reorderKeysByType = function (obj) {
		if (!_.isObject(obj) || _.isArray(obj) || _.size(obj) <= 1) return obj;
		var typed = {
			strings: {},
			numbers: {},
			etc: {},
			objects: {},
			arrays: {}
		};
		_.each (obj, function (item, key) {
			if (_.isString(item)) typed.strings[key] = item;
			else if (jawn.isNumeric(item)) typed.numbers[key] = item;
			else if (_.isObject(item) && !_.isArray(item)) typed.objects[key] = item;
			else if (_.isArray(item)) typed.arrays[key] = item;
			else typed.etc[key] = item;
		});
		var output = {};
		_.each (typed, function (props, type) {
			if (!_.isEmpty(props)) output = _.extend(output, props);
		});
		return output;
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	  module.exports = jawn;
	} else {
	  window.jawn = jawn;
	}
})();
