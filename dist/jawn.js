'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* ---------------------------------------------------------------------------*/
/*	@module jawn -------------------------------------------------------------*/
/*	@author austinbillings ---------------------------------------------------*/
/*	@license: MIT ------------------------------------------------------------*/
/* ---------------------------------------------------------------------------*/

/*	TODO: Unit testing */

(function () {
	"use strict";

	if (typeof window === 'undefined') var _ = require('underscore');else _ = window._;

	var jawn = {
		version: '2.0.0',
		primitives: ['number', 'boolean', 'string'],
		imageTypes: ['jpg', 'png', 'svg', 'jpeg', 'gif', 'bmp', 'tif']
	};

	jawn.parseQuery = function () {
		var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		queryString = queryString.trim();
		queryString = queryString.indexOf('?') === 0 ? queryString.substring(1) : queryString;
		var queryArray = queryString.split('&');
		var output = {};
		_.each(queryArray, function (set) {
			var _set$split = set.split('='),
			    _set$split2 = _slicedToArray(_set$split, 2),
			    key = _set$split2[0],
			    val = _set$split2[1];

			if (val === '' || val === undefined) val = null;else if (val === 'true') val = true;else if (val === 'false') val = false;else if (jawn.isNumeric(val)) val = jawn.castNumberTypes(val);else val = decodeURIComponent(val);

			if (key && key.length) output[key] = val;
		});
		return output;
	};

	jawn.pathify = function (path) {
		var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';

		path = path.trim();
		path = path.substring(0, 1) === separator ? path.substring(1) : path;
		path = path.substring(-1) === separator ? path.substring(0, -1) : path;
		return _.compact(path.split(separator));
	};

	jawn.filenameFromPath = function () {
		var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';

		path = path.trim();
		var parts = jawn.pathify(path, separator);
		if (!parts.length) return null;
		var piece = parts.pop();
		return force && !jawn.containsPeriod(piece) ? null : piece;
	};

	jawn.pathWithoutFilename = function () {
		var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';

		path = path.trim();
		var prefixed = path.substr(0, 1) === separator;
		if (!jawn.containsPeriod(path) && force) return path;
		var parts = jawn.pathify(path, separator);

		if (!parts || !parts.length) return null;
		var output = _.initial(parts).join(separator) + separator;
		return prefixed ? separator + output : output;
	};

	jawn.getFileExtension = function (input) {
		var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (!jawn.containsPeriod(input)) return force ? null : input;
		return input.substring(input.lastIndexOf('.') + 1);
	};

	jawn.removeFileExtension = function (input) {
		var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (!jawn.containsPeriod(input)) return force ? null : input;
		return input.substring(0, input.lastIndexOf('.'));
	};

	jawn.appendToFilename = function (filename) {
		var addendum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		var pre = jawn.removeFileExtension(filename);
		var post = jawn.getFileExtension(filename);
		return pre + addendum + '.' + post;
	};

	jawn.autopath = function () {
		var output = '';

		for (var _len = arguments.length, pathParts = Array(_len), _key = 0; _key < _len; _key++) {
			pathParts[_key] = arguments[_key];
		}

		_.each(pathParts, function (part, i) {
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

	jawn.bgi = function (image, objMode, camelCase) {
		var tag = 'url(\'' + image + '\')';
		if (!image) return null;
		if (!objMode) return tag;
		if (!camelCase) return { 'background-image': tag };
		return { backgroundImage: tag };
	};

	jawn.slug = function (text) {
		var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

		if (!text || !_.isString(text)) return null;
		return text.toLowerCase().replace(/-'+/g, '').replace(/\s+/g, sep).replace(/[^a-z0-9-]/g, '');
	};

	jawn.fa = function (icon) {
		return icon && _.isString(icon) ? 'fa fa-' + icon : null;
	};
	jawn.ucFirst = function (text) {
		return _.isString(text) && text.legth ? text[0].toUpperCase() + text.slice(1) : text;
	};
	jawn.lcFirst = function (text) {
		return _.isString(text) && text.length ? text[0].toLowerCase() + text.slice(1) : text;
	};
	jawn.textToHtml = function (text) {
		return text.replace('\n', '<br />');
	};
	jawn.castNumberTypes = function (val) {
		return jawn.isNumeric(val) ? val * 1 : val;
	};
	jawn.rgb = jawn.rgba = function (r, g, b) {
		var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	};
	jawn.wrapDoubleBreaks = function (text) {
		return '\n\n' + text + '\n\n';
	};

	jawn.isMap = function (val) {
		return _.isObject(val) && !_.isArray(val) && !_.isFunction(val);
	};
	jawn.isNumeric = function (val) {
		return !_.isArray(val) && val - parseFloat(val) + 1 >= 0;
	};
	jawn.isUppercase = function (text) {
		return _.isString(text) && text.length && text.toUpperCase() === text;
	};
	jawn.hasImageExt = function (file) {
		return jawn.imageTypes.some(function (type) {
			return type === jawn.getFileExtension(file);
		});
	};
	jawn.containsPeriod = function (input) {
		return input && input.length && input.indexOf('.') !== -1;
	};

	function mergerFactory(mergeArrays) {
		var merger = function merger() {
			for (var _len2 = arguments.length, layers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				layers[_key2] = arguments[_key2];
			}

			if (layers.some(function (layer) {
				return !jawn.isMap(layer);
			})) return null;
			return _.reduce(layers, function (_base, _coat) {
				var output = {};
				var base = jawn.clone(_base);
				var coat = jawn.clone(_coat);
				var allKeys = _.flatten([_.keys(base), _.keys(coat)]);

				_.each(allKeys, function (key) {
					var incoming = coat[key];
					var incumbent = base[key];

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
		};
		return merger;
	}

	jawn.merge = jawn.mergeObject = mergerFactory(true);
	jawn.coat = jawn.coatObject = mergerFactory(false);

	jawn.toCamelCase = function (input, overrideAllCaps) {
		if (!_.isString(input) || !input.length) return input;
		if (!overrideAllCaps && jawn.isUppercase(input)) return input;

		var prefixed = input.indexOf('_') === 0;
		var output = input.replace(/[^a-zA-Z0-9-\s]/g, ' ').split(/[\s-,_+]+/).map(function (text, i) {
			return i ? jawn.ucFirst(text) : jawn.lcFirst(text);
		}).join('');

		return (prefixed ? '_' : '') + output;
	};

	jawn.hath = function (obj, props) {
		if (!jawn.isMap(obj)) return;

		var propList = _.map(props.split('.'), jawn.castNumberTypes);
		while (propList.length) {
			if (!_.has(obj, propList[0])) return false;
			if (propList.length === 1) return true;

			obj = obj[propList.shift()];
		}
		return false;
	};

	jawn.extrude = function (obj, targetProp) {
		if (!jawn.isMap(obj) || !jawn.hath(obj, targetProp)) return null;

		targetProp = targetProp.replace(/[^a-zA-Z0-9.-\s]+/g, '');

		var targetProps = _.map(targetProp.split('.'), jawn.castNumberTypes);
		while (targetProps.length) {
			obj = obj[targetProps.shift()];
		}return obj;
	};

	jawn.intrude = function (obj, targetProp, replacement) {
		if (!jawn.isMap(obj) || !jawn.hath(obj, targetProp)) return null;

		targetProp = targetProp.replace(/[^a-zA-Z0-9.-\s]+/g, '');

		var propTrail = _.reduce(targetProp.split('.'), function (out, prop) {
			return out + '[' + (jawn.isNumeric(prop) ? prop : '\'' + prop + '\'') + ']';
		}, '');

		eval('obj' + propTrail + ' = replacement;');
		return obj;
	};

	jawn.clone = function (obj) {
		if (jawn.primitives.indexOf(typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) >= 0 || !obj) return obj;
		if (_.isArray(obj)) return _.map(obj, function (item) {
			return jawn.clone(item);
		});
		if (!_.isObject(obj) || !_.size(obj)) return obj;
		if (typeof obj === 'function') return obj.bind({});

		var output = Object.create(obj);
		_.keys(obj).forEach(function (key) {
			return output[key] = jawn.clone(obj[key]);
		});

		return output;
	};

	jawn.reorderKeysByType = function (obj) {
		if (!_.isObject(obj) || _.isArray(obj) || _.size(obj) <= 1) return obj;
		var typed = { strings: {}, numbers: {}, etc: {}, objects: {}, arrays: {} };

		_.each(obj, function (item, key) {
			if (_.isString(item)) typed.strings[key] = item;else if (jawn.isNumeric(item)) typed.numbers[key] = item;else if (jawn.isMap(item)) typed.objects[key] = item;else if (_.isArray(item)) typed.arrays[key] = item;else typed.etc[key] = item;
		});

		var output = {};
		_.each(typed, function (props, type) {
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