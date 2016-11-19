# jawn.js
## A collection of tiny, specialized javascript utilities. Need a jawn?

by Austin for free.

======

#### `jawn.parseQuery(queryString)`
Interprets a standard URL `queryString` into a usable, typed object.

```js
jawn.parseQuery('?name=Alfred%20Bootin&height=6.05&tickets=false&style=');

--> { name: 'Alfred Bootin', height: 6.05, tickets: false, style: null }
```

-----

#### `jawn.textToHtml(text)`
Converts plaintext `text` to HTML-- quite basic at the moment. Only converts newlines to `<br>` tags.

```js
jawn.textToHtml('My first paragraph. \nSecond Paragraph!');
--> 'My first paragraph. <br />Seconds Paragraph!'
```

-----

#### `jawn.filenameFromPath(path)`
uses `.pathify()` to extract the last element from a given path

```js
jawn.filenameFromPath('/images/wine/merlot/fancy_shit.png');
--> 'fancy_shit.png'
```

-----

#### `jawn.pathWithoutFilename(path[, force])`
Returns `path`, minus the filename, if one exists (i.e. one with a period), always returning with a trailing slash.
If `force` is a truthy value, it will remove the final path part, regardless of whether or not a period exists.

```js
jawn.pathWithoutFilename('/photos/grandma/scary.jpg')
--> '/photos/grandma/'
jawn.pathWithoutFilename('/dir/certainlyAnotherDir/', false)
--> '/dir/possiblyAnotherDir/'
jawn.pathWithoutFilename('/dir/possiblyAnotherDir/', true)
--> '/dir/'
```

-----



#### `jawn.containsPeriod(input)`
If `input` string contains a period, return true.

```js
jawn.containsPeriod('file.xml')
--> true
jawn.containsPeriod('i stole the guitar, though')
--> false
```

-----


#### `jawn.getFileExtension(input[, hard])`
returns just the file extension, unless there is none, in which case the
input is returned, unless `hard` is a truthy value, in which case false is.

```js
jawn.getFileExtension('seasonsChange.svg')
--> 'svg'
jawn.getFileExtension('WTF_broooooo?')
--> 'WTF_broooooo?'
jawn.getFileExtension('stoic', true)
--> false
```

-----


#### `jawn.removeFileExtension(input[, hard])`
Returns all of `input`, up to the final file extension. If no file extension is found and `hard` is truthy, `false` is returned. Otherwise `input` is returned.

```js
jawn.removeFileExtension('InedibleNachos.png')
-->	'InedibleNachos'
```

-----

#### `jawn.appendToFilename(filename, addendum)`
Insert `addendum` onto `filename`, before the file extension.

```js
jawn.appendToFilename('photos/mom/gotNOteeth.jpg', '-edited')
-->	'photos/mom/gotNOteeth-edited.jpg'
```

-----

#### `jawn.autopath([...args...])`
Pass various values/dirnames as arguments to automatically build a path/url from them.
Intelligently handles URLs, and dotpath prefixes. Never returns with a trailing slash.

```js
jawn.autopath('http://sick-site.com', 'vids', 'category/ZAP', '/vid.swf')
--> 'http://sick-site.com/vids/category/ZAP/vid.swf'
```

-----


#### `jawn.pathify(path)`
Deconstructs a `path` (URLs okay) into an array of segments.

```js
jawn.pathify('C://Windows/System32/Frameworks/Crap/WindowsBlows.lol')
--> ['C:', 'Windows', 'System32', 'Frameworks', 'Crap', 'WindowsBlows.lol']
jawn.pathify('/assets/photos/MIKHAIL_prom/GoMishaGo!.jpg')
--> ['assets', 'photos', 'MIKHAIL_prom', 'GoMishaGo!.jpg']
```

-----


#### `jawn.fa(icon)`
Generate the classes for a FontAwesome `icon`, useful in `ng-class`.

```js
jawn.fa('home')
--> 'fa fa-home'
```

-----


#### `jawn.bgi(image[, objMode[, camelCase]])`
Generates background-image CSS image URL string. Use `objMode` to generate as object
with either (if `camelCase` is truthy) or hyphen-style property name. Useful in <x ng-style="">.

```js
jawn.bgi('assets/bg.jpg')
--> 'url("assets/bg.jpg")'
jawn.bgi('img/wall.png', true, true)
--> { backgroundImage: 'url("img/wall.png")' }
```

-----


#### `jawn.slug(input[, separator])`
generates a URL-friendly slug for input, retaining alphanumeric characters
and replacing spaces with separator, '-' by default.

```js
jawn.slug('My SUPER cool new WEBSITE!!! Yay~')
--> 'my-super-cool-new-website-yay'
jawn.slug("this one's different", '~')
--> 'this~ones~different'
```

-----

#### `jawn.hasImageExt(fileName)`
checks if fileName has a common image file extension (listed below)

```js
jawn.hasImageExt('files/deep/folder/test.jpg')
--> true
```

#### `jawn.wrapDoubleBreaks(x)`
Wraps x in two escaped newlines. Useful for spacing out console.log() statements.

```js
jawn.wrapDoubleBreaks('WTF BRO')
--> "\n\n WTF BRO \n\n"
```


#### `jawn.ucFirst(s)`
Uppercase the first letter of a string.

```js
jawn.ucFirst('lowercase')
--> 'Lowercase'
```

-----


#### `jawn.lcFirst(s)`
Lowercase the first letter of a string.

```js
jawn.lcFirst('Uppercase')
--> 'uppercase'
```
-----


#### `jawn.isNumeric(x)`
Simple check for number-ness.

```js
jawn.isNumeric('15.4')
--> true
jawn.isNumeric('Unoriginal Antiques')
--> false, man y'all triflin that ain't even close to a number dawg
```


#### `jawn.isUppercase(str)`
Simple check for ALL CAPS-NESS (actually for lack of lowercase-ness).

```js
jawn.isUppercase('Suh dude?')
--> false
jawn.isUppercase('LOL JERK')
--> true
jawn.isUppercase('$#$%&#$&')
--> true (is this a defect or non-issue?)
```

-----


#### `jawn.toCamelCase(input[, overrideAllCaps])`
Converts a value to camelCase, splitting by spaces, commas, and underscores
Leaves ALLCAPS untouched unless overrideAllCaps is truthy.
Retains initial underscore ( _ ) if present, and lowercases the first letter.

```js
jawn.toCamelCase('My_Cool_Var_Name')
--> 'myCoolVarName'
jawn.toCamelCase('leave-me-alone, bob')
--> 'leaveMeAloneBob'
```

-----


#### `jawn.castNumberTypes(x)`
If a value is numeric, turn it into a number of the appropriate type.

```js
jawn.castNumberTypes('4')
--> 4 (int)
jawn.castNumberTypes('103434.4040')
--> 103434.4040 (float)
```

-----


#### `jawn.hath(obj, props)`
Deep checks if nested period-separated properties (`props`) exist on `obj`
like Underscore's `_.has(obj, propertyName)` but can go many levels deep.
Accepts integer values to search for array indices as well.

```js
var deep = { firstLevel: { secondLevel: { thirdLevel: ["Limbo"] } } }
jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel')
--> true
jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.Limbo')
--> false (it's an array item of thirdLevel)
jawn.hath(deep, 'firstLevel.secondLevel.thirdLevel.0')
--> true (it's the 0 index)
```

-----

#### `jawn.extrude(obj, targetProp)`
Returns the value of `targetProp` (a period-separated property path)
from deep within `obj`, if it exists. Otherwise, `false`.

```js
var deepAF = { firstLevel: { secondLevel: { thirdLevel: { treasure: true } } } }
jawn.extrude(deepAF, 'firstLevel.secondLevel.thirdLevel')
--> { treasure: true }
jawn.extrude(deepAF, 'firstLevel.secondLevel.secretPathway')
--> false
```
