[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Parse/Stringify simplified plist used by Geometry Dash

# Install
First, install the package using NPM.
```
npm install @gdapi/plist
```
Then import it into your code.
```javascript
// named import
import { parse, stringify } from '@gdapi/plist'
// namespaced import
import * as Plist from '@gdapi/plist'
```

# Example
```javascript
import { parse, stringify } from '@gdapi/plist'

const xml = /* use @gdapi/crypto to get the xml */ 
const { data, realNumbers } = parse(xml)

const stringified = stringify(data, realNumbers)
// save it somehow
```

# Docs
## `parse(xmlStr: string): object`
Parse string containing xml contents into javascript object. Returned object contains two properties: `data` and `realNumbers`.

`data` property holds a parsed object. `realNumbers` is a array of properties' name of which are actually an integer but have a type of `real` in plist. Since javascript use a unified type for representing numbers, `realNumbers` are required to stringify the parsed object back properly.

### Example
`CCGameManager.dat`(decrypted using `@gdapi/crypto`)
```xml
<?xml version="1.0"?>
<plist version="1.0" gjver="2.0">
  <dict>
  <k>LLM_01</k>
  <d>
    <k>_isArr</k>
    <t />
  </d>
  <k>LLM_02</k>
  <i>35</i>
  </dict>
</plist>
```

Parsed:
```javascript
const parsed = {
  data: {
    LLM_01: [],
    LLM_02: 35
  }, 
  realNumbers: []
}
```

## `stringify(dict: object, realNumbers?: string[]): string`
Stringify parsed object.