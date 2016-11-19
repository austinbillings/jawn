# jawn.js
####A collection of tiny, specialized javascript utilities. Need a jawn?

by austin for free.


### `jawn.parseQuery(queryString)`
interprets a standard URL querystring into a usable, typed object.

		jawn.parseQuery('?name=Alfred%20Bootin&height=6.05&tickets=false&style=')
		--> {
			name: 'Alfred Bootin',
			height: 6.05,
			tickets: false,
			style: null
		}

### `jawn.textToHtml(text)`
converts plaintext to HTML-- basic at the moment. Converts newline to <br>.

		jawn.textToHtml('My first paragraph.\nSecond Paragraph!');
		--> 'My first paragraph.<br />Seconds Paragraph!'

### `jawn.filenameFromPath(path)`
uses .pathify() to extract the last element from a given path

		jawn.filenameFromPath('/images/wine/merlot/fancy_shit.png')
		--> 'fancy_shit.png'


### `jawn.pathWithoutFilename(path[, force])`
Returns path, minus the filename, if one exists (i.e. one with a period), with trailing slash.
If force is a truthy value, it will remove the final path part despite a lack of period.

		jawn.pathWithoutFilename('/photos/grandma/scary.jpg')
		--> '/photos/grandma/'
		jawn.pathWithoutFilename('/dir/certainlyAnotherDir/', false)
		--> '/dir/possiblyAnotherDir/'
		jawn.pathWithoutFilename('/dir/possiblyAnotherDir/', true)
		--> '/dir/'

### `jawn.containsPeriod(input)`
if string contains period rtn true

		jawn.containsPeriod('file.xml')
		--> true
		jawn.containsPeriod('i stole the guitar, though')
		--> false

### `jawn.getFileExtension(input[, hard])`
returns just the file extension, unless there is none, in which case the
input is returned, unless `hard` is a truthy value, in which case false is.

		jawn.getFileExtension('seasonsChange.svg')
		--> 'svg'
		jawn.getFileExtension('WTF_broooooo?')
		--> 'WTF_broooooo?'
		jawn.getFileExtension('stoic', true)
		--> false

### `jawn.removeFileExtension(input[, hard])`
returns everything up to file extension

		jawn.removeFileExtension('InedibleNachos.png')
		-->	'InedibleNachos'

### `jawn.appendToFilename(filename, addendum)`
insert addendum onto filename before file extension

		jawn.appendToFilename('photos/mom/gotNOteeth.jpg', '-edited')
		-->	'photos/mom/gotNOteeth-edited.jpg'

### `jawn.autopath([...args...])`
pass various values/dirnames to automatically build a path/url from them
intelligently handles URLs, and dotpath prefixes, never with trailing slash

		jawn.autopath('http://sick-site.com', 'vids', 'category/ZAP', '/vid.swf')
		--> 'http://sick-site.com/vids/category/ZAP/vid.swf'

### `jawn.pathify(path)`
deconstructs a path/url into an array of components

		jawn.pathify('C://Windows/System32/Frameworks/Crap/WindowsBlows.lol')
		--> ['C:', 'Windows', 'System32', 'Frameworks', 'Crap', 'WindowsBlows.lol']
		jawn.pathify('/assets/photos/MIKHAIL_prom/GoMishaGo!.jpg')
		--> ['assets', 'photos', 'MIKHAIL_prom', 'GoMishaGo!.jpg']

### `jawn.fa(icon)`
generate classes for FontAwesome icons, useful in ng-class

		jawn.fa('home')
		--> 'fa fa-home'

### `jawn.bgi(image[, objMode[, camelCase]])`
generates background-image css image string. also can generate object
with either camelCase or hephen-style property name, useful in <ng-style>

		jawn.bgi('assets/bg.jpg')
		--> 'url("assets/bg.jpg")'
		jawn.bgi('img/wall.png', true, true)
		--> { backgroundImage: 'url("img/wall.png")' }

### `jawn.slug(input[, separator])`
generates a URL-friendly slug for input, retaining alphanumeric characters
and replacing spaces with separator, '-' by default.

		jawn.slug('My SUPER cool new WEBSITE!!! Yay~')
		--> 'my-super-cool-new-website-yay'
		jawn.slug("this one's different", '~')
		--> 'this~ones~different'

### `jawn.hasImageExt(fileName)`
checks if fileName has a common image file extension (listed below)

		jawn.hasImageExt('files/deep/folder/test.jpg')
		--> true

### `jawn.wrapDoubleBreaks(x)`
Wraps x in two escaped newlines. Useful for spacing out console.log() statements.

		jawn.wrapDoubleBreaks('WTF BRO')
		--> '\n\nWTF BRO\n\n

### `jawn.ucFirst(s)`
uppercase the first letter

		jawn.ucFirst('lowercase')
		--> 'Lowercase'

### `jawn.lcFirst(s)`
lowercase the first letter

		jawn.lcFirst('Uppercase')
		--> 'uppercase'

### `jawn.isNumeric(x)`
simple check for number-ness

		jawn.isNumeric('15.4')
		--> true
		jawn.isNumeric('Unoriginal Antiques')
		--> false, man y'all triflin that ain't even close to a number dawg

### `jawn.isUppercase(str)`
simple check for ALL CAPS-NESS (actually for lack of lowercase-ness)
		jawn.isUppercase('Suh dude?')
		--> false
		jawn.isUppercase('LOL JERK')
		--> true
		jawn.isUppercase('$#$%&#$&')
		--> true (is this a defect or non-issue?)


### `jawn.toCamelCase(input[, overrideAllCaps])`
converts a value to camelCase, splitting by spaces, commas, and underscores
Leaves ALLCAPS untouched unless overrideAllCaps is truthy.
Retains initial underscore ( _ ) if present, and lowercases the first letter.

		jawn.toCamelCase('My_Cool_Var_Name')
		--> 'myCoolVarName'
		jawn.toCamelCase('leave-me-alone, bob')		--> 'leaveMeAloneBob'

### `jawn.castNumberTypes(x)`
If a value is numeric, turn it into a number of the appropriate type

		jawn.castNumberTypes('4')
		--> 4 (int)
		jawn.castNumberTypes('103434.4040')
		--> 103434.4040 (float)


### `jawn.hath(obj, props)`
Deep checks if nested period-separated properties (prop) exist on obj
like Underscore's _.has(obj, propertyName) but can go many levels deep.
Accepts integer values to search for array indices as well.

		var deep = { firstLevel: { secondLevel: { thirdLevel: ["Limbo"] } } }
		jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel')
		--> true
		jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.Limbo')
		--> false (it's an array item of thirdLevel)
		jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.0')
		--> true (it's the 0 index)

### `jawn.extrude(obj, targetProp)`
Returns the value of targetProp (a period-separated property path)
from deep within obj, if it exists. Otherwise, false.

		var deepAF = { firstLevel: { secondLevel: { thirdLevel: { treasure: true } } } }
		jawn.extrude(deepAF, 'firstLevel.secondLevel.thirdLevel')
		--> { treasure: true }
		jawn.extrude(deepAF, 'firstLevel.secondLevel.secretPathway')
		--> false
