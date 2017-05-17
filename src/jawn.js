/* ---------------------------------------------------------------------------*/
/*	@module jawn -------------------------------------------------------------*/
/*	@author austinbillings ---------------------------------------------------*/
/*	@license: MIT ------------------------------------------------------------*/
/* ---------------------------------------------------------------------------*/

/*	TODO: Unit testing */

(function () {
	"use strict";
	if (typeof window === 'undefined') var _ = require('underscore');
	else _ = window._;
	
	const jawn = {
		version: '2.0.0',
		primitives: ['number', 'boolean', 'string'],
		imageTypes: ['jpg', 'png', 'svg', 'jpeg', 'gif', 'bmp', 'tif']
	};

	jawn.parseQuery = (queryString = '') => {
		queryString = queryString.trim();
		queryString = queryString.indexOf('?') === 0 ? queryString.substring(1) : queryString;
		let queryArray = queryString.split('&');
		let output = {};
		_.each(queryArray, (set) => {
			let [ key, val ] = set.split('=');
			if (val === '' || val === undefined) val = null;
			else if (val === 'true') val = true;
			else if (val === 'false') val = false;
			else if (jawn.isNumeric(val)) val = jawn.castNumberTypes(val);
			else val = decodeURIComponent(val);

			if (key && key.length) output[key] = val;
		});
		return output;
	};

	jawn.pathify = (path, separator = '/') => {
		path = path.trim();
		path = path.substring(0,1) === separator ? path.substring(1) : path;
		path = path.substring(-1) === separator ? path.substring(0, -1) : path;
		return _.compact(path.split(separator));
	};

	jawn.filenameFromPath = (path = '', force = false, separator = '/') => {
		path = path.trim();
		let parts = jawn.pathify(path, separator);
		if (!parts.length) return null;
		let piece = parts.pop();
		return (force && !jawn.containsPeriod(piece) ? null : piece);
	};

	jawn.pathWithoutFilename = (path = '', force = false, separator = '/') => {
		path = path.trim();
		let prefixed = path.substr(0, 1) === separator;
		if (!jawn.containsPeriod(path) && force) return path;
		let parts = jawn.pathify(path, separator);
		
		if (!parts || !parts.length) return null;
		let output = _.initial(parts).join(separator) + separator;
		return prefixed ? separator + output : output;
	};

	jawn.getFileExtension = (input, force = true) => {
		if (!jawn.containsPeriod(input)) return force ? null : input;
		return input.substring(input.lastIndexOf('.') + 1);
	};

	jawn.removeFileExtension = (input, force = true) => {
		if (!jawn.containsPeriod(input)) return force ? null : input;
		return input.substring(0, input.lastIndexOf('.'));
	};

	jawn.appendToFilename = function (filename, addendum = '') {
		let pre = jawn.removeFileExtension(filename);
		let post = jawn.getFileExtension(filename);
		return pre + addendum + '.' + post;
	};

	jawn.autopath = function (...pathParts) {
		let output = '';
		_.each(pathParts, (part, i) => {
			if (i === 0 && part.substring(0, 1) === '.' && part.substring(0, 2) === './') {
				output += './';
				part = part.substring(2);
			} else if (i === 0 && part.indexOf('http://') === 0) {
				output += 'http://';
				part = part.substring(7);
			} else if (i === 0 && part.indexOf('https://') === 0) {
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
	};

	jawn.bgi = (image, objMode, camelCase) => {
		let tag = `url('${image}')`;
		if (!image) return null;
		if (!objMode) return tag;
		if (!camelCase) return { 'background-image': tag };
		return { backgroundImage: tag };
	};
	
	jawn.slug = (text, sep = '-') => {
		if (!text || !_.isString(text)) return null;
		return text
			.toLowerCase()
			.replace(/-'+/g, '')
			.replace(/\s+/g, sep)
			.replace(/[^a-z0-9-]/g, '');
	};
	
	jawn.fa = (icon) => (icon && _.isString(icon) ? `fa fa-${icon}` : null);
	jawn.ucFirst = (text) => _.isString(text) && text.legth ? text[0].toUpperCase() + text.slice(1) : text;
	jawn.lcFirst = (text) => _.isString(text) && text.length ? text[0].toLowerCase() + text.slice(1) : text;
	jawn.textToHtml = (text) => text.replace('\n', '<br />');
	jawn.castNumberTypes = (val) => jawn.isNumeric(val) ? val * 1 : val;
	jawn.rgb = jawn.rgba = (r, g, b, a = 1) => `rgba(${r},${g},${b},${a})`;
	jawn.wrapDoubleBreaks = (text) => `\n\n${text}\n\n`;
	
	jawn.isMap = (val) => _.isObject(val) && !_.isArray(val) && !_.isFunction(val);
	jawn.isNumeric = (val) => !_.isArray(val) && (val - parseFloat(val) + 1) >= 0;
	jawn.isUppercase = (text) => _.isString(text) && text.length && text.toUpperCase() === text;
	jawn.hasImageExt = (file) => jawn.imageTypes.some(type => type === jawn.getFileExtension(file));
	jawn.containsPeriod = (input) => input && input.length && input.indexOf('.') !== -1;
	
	function mergerFactory (mergeArrays) {
		let merger = function (...layers) {
			if (layers.some(layer => !jawn.isMap(layer))) return null;
			return _.reduce(layers, (_base, _coat) => {
				let output = {};
		    let base = jawn.clone(_base);
		    let coat = jawn.clone(_coat);
		    let allKeys = _.flatten([ _.keys(base), _.keys(coat) ]);
		    
		    _.each(allKeys, (key) => {
		      let incoming = coat[key];
		      let incumbent = base[key];
		      
		      if (_.isUndefined(incoming) && _.isUndefined(incumbent)) return;
		      
		      if (jawn.isMap(incoming) && jawn.isMap(incumbent)) {
		        output[key] = merger(incumbent, incoming);
		      } else {
						if (_.isArray(incoming) && _.isArray(incumbent) && mergeArrays) {
							output[key] = _.union(incumbent, incoming);
						} else {
		        	output[key] = _.isUndefined(incoming) ? incumbent : incoming;
						}
		      }
		    });
				
		    return output;
			}, {});
		}
		return merger;
	}
	
	jawn.merge = jawn.mergeObject = mergerFactory(true);
	jawn.coat = jawn.coatObject = mergerFactory(false);
	
	jawn.toCamelCase = (input, overrideAllCaps) => {
	  if (!_.isString(input) || !input.length) return input;
		if (!overrideAllCaps && jawn.isUppercase(input)) return input;
		
		let prefixed = (input.indexOf('_') === 0);
	  let output = input
			.replace(/[^a-zA-Z0-9-\s]/g, ' ')
			.split(/[\s-,_+]+/)
			.map((text, i) => i ? jawn.ucFirst(text) : jawn.lcFirst(text))
			.join('');
			
		return (prefixed ? '_' : '') + output;
	};

	jawn.hath = (obj, props) => {
	  if (!jawn.isMap(obj)) return;
		
	  let propList = _.map(props.split('.'), jawn.castNumberTypes);
	  while (propList.length) {
			if (!_.has(obj, propList[0])) return false;
      if (propList.length === 1) return true;
			
      obj = obj[propList.shift()];
	  }
	  return false;
	};

	jawn.extrude = (obj, targetProp) => {
	  if (!jawn.isMap(obj) || !jawn.hath(obj, targetProp)) return null;
	  
		targetProp = targetProp.replace(/[^a-zA-Z0-9.-\s]+/g, '');
		
		let targetProps = _.map(targetProp.split('.'), jawn.castNumberTypes);
	  while (targetProps.length) obj = obj[targetProps.shift()];
	  return obj;
	};

	jawn.intrude = (obj, targetProp, replacement) => {
		if (!jawn.isMap(obj) || !jawn.hath(obj, targetProp)) return null;
		
		targetProp = targetProp.replace(/[^a-zA-Z0-9.-\s]+/g, '');
		
		let propTrail = _.reduce(targetProp.split('.'), function (out, prop) {
			return out + '[' + (jawn.isNumeric(prop) ? prop : `'${prop}'`) + ']';
		}, '');
		
		eval('obj' + propTrail + ' = replacement;');
		return obj;
	};
	
	jawn.clone = (obj) => {
		if (_.contains(jawn.primitives, typeof obj) || !obj) return obj;
		if (_.isArray(obj)) return _.map(obj, function (item) { return jawn.clone(item); });
		if (!_.isObject(obj) || !_.size(obj)) return obj;
		if (typeof obj === 'function') return obj.bind({});
		
		let output = Object.create(obj);
		_.keys(obj).forEach(key => output[key] = jawn.clone(obj[key]));
		
		return output;
	};

	jawn.reorderKeysByType = (obj) => {
		if (!_.isObject(obj) || _.isArray(obj) || _.size(obj) <= 1) return obj;
		let typed = { strings: {}, numbers: {}, etc: {}, objects: {}, arrays: {} };
		
		_.each (obj, (item, key) => {
			if (_.isString(item)) typed.strings[key] = item;
			else if (jawn.isNumeric(item)) typed.numbers[key] = item;
			else if (jawn.isMap(item)) typed.objects[key] = item;
			else if (_.isArray(item)) typed.arrays[key] = item;
			else typed.etc[key] = item;
		});
		
		var output = {};
		_.each (typed, (props, type) => {
			if (!_.isEmpty(props)) output = _.extend(output, props);
		});
		return output;
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	  module.exports = jawn;
	} else {
	  window.jawn = jawn;
	}
})();