/*	jawn.js ------------------------------------------------------------------*/
/*	by austin for free -------------------------------------------------------*/
/*	license: MIT -------------------------------------------------------------*/
try {
	if (typeof require != 'undefined') {
		_ = require('underscore');
	}
} catch (e) {}

var jawn = {};

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


jawn.textToHtml = function (text) {
	return text.replace('\n', '<br />');
}

jawn.pathify = function (path) {
	path = path.substring(0,1) === '/' ? path.substring(1) : path;
	path = path.substring(-1) === '/' ? path.substring(0, -1) : path;
	return path.split('/');
}

jawn.filenameFromPath = function (path) {
	var pathParts = jawn.pathify(path);
	return pathParts[pathParts.length - 1];
}

jawn.pathWithoutFilename = function (path, force) {
	force = force || false;
	if (jawn.containsPeriod(path) || force) {
		var pathParts = jawn.pathify(path);
		pathParts.pop();
		return pathParts.join('/') + '/';
	} else {
		return path;
	}
}

// if string contains period rtn true
jawn.containsPeriod = function (input) {
	return input && input.length && input.indexOf('.') !== -1;
}

// returns just the file extension
jawn.getFileExtension = function (input, hard) {
	return jawn.containsPeriod(input) ? input.substring(input.lastIndexOf('.') + 1) : hard ? false : input;
}

// returns everything up to file extension
jawn.removeFileExtension = function (input, hard) {
	return jawn.containsPeriod(input) ? input.substring(0, input.indexOf('.')) : hard ? false : input;
}

jawn.appendToFilename = function (filename, addendum) {
	var pre = jawn.removeFileExtension(filename);
	var post = jawn.getFileExtension(filename);
	return pre + addendum + '.' + post;
}

jawn.autopath = function () {
	pathParts = arguments;
	output = '';
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

jawn.fa = function (icon) {
	return 'fa fa-' + icon;
}

jawn.bgi = function (image) {
	return 'url("' + image + '")';
}

jawn.slug = function (input, separator) {
	if (!separator) separator = '-';
	return input ? input.toLowerCase().replace(/-+/g, '').replace(/\s+/g, separator).replace(/[^a-z0-9-]/g, '') : null;
}

jawn.hasImageExt = function (fileName) {
	return _.some(['jpg','png','svg','jpeg','gif','bmp'], function (t) {
		return fileName.lastIndexOf('.' + t) === fileName.length - (t.length + 1);
	});
}

jawn.wrapDoubleBreaks =  function (x) {
	return "\n\n" + x + "\n\n";
}

jawn.ucFirst = function (s) {
	return s[0].toUpperCase() + s.slice(1);
}

jawn.lcFirst = function (s) {
	return s[0].toLowerCase() + s.slice(1);
}

jawn.isNumeric = function (x) {
	return !_.isArray(x) && (x - parseFloat(x) + 1) >= 0;
}

jawn.toCamelCase = function (input) {
  if (!_.isString(input) || !input.length) return input;
  var output = input.split(/[\s,_+]+/);
  output = _.map(output, jawn.ucFirst);
  output = output.join('');
  output = jawn.lcFirst(output);
  return output;
}

/*	Export -------------------------------------------------------------------*/
try {
	if (typeof exports !== 'undefined') {
	  if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = jawn;
	  }
	  exports.jawn = jawn;
	} else if (typeof root !== 'undefined') {
	  root['jawn'] = jawn;
	}
} catch (e) {}
/*	kick ass. -- -------------------------------------------------------------*/
