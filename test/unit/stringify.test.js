import { stringify } from '../../build/index.js'
import { DOMParser } from 'https://jspm.dev/xmldom'

function parseXML (xmlStr) {
  return new DOMParser().parseFromString(xmlStr)
}

function getDictElem (xmlStr) {
  const doc = parseXML(xmlStr)
  return doc.getElementsByTagName('dict')[0]
}

function strip (xml) {
  return xml
    .replace('<?xml version="1.0"?><plist version="1.0" gjver="2.0"><dict>', '')
    .replace('</dict></plist>', '')
}

describe('stringify()', () => {
  it('should throw if input is not a dictionary', () => {
    expect(() => stringify('string')).toThrow()
  })

  it('should transform root dict into <dict>', () => {
    const dict = {}

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed).toBeTruthy()
  })

  it('should wrap string into <s>', () => {
    const dict = {
      k: 'string'
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<s>string</s>')
  })

  it('should transform true into <t />', () => {
    const dict = {
      k: true
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<t/>')
  })

  it('should transform false into <f />', () => {
    const dict = {
      k: false
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<f/>')
  })

  it('should wrap integer into <i>', () => {
    const dict = {
      k: 1
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<i>1</i>')
  })

  it('should wrap number with fractional part into <r>', () => {
    const dict = {
      k: 1.245
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<r>1.245</r>')
  })

  it('should wrap number whose property is recorded inside realNumbers array into <r>', () => {
    const dict = {
      k: 1
    }
    const realNumbers = ['k']

    const result = stringify(dict, realNumbers)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<r>1</r>')
  })

  it('should throw if realNumbers is not an array', () => {
    expect(() => stringify({}, 'meow')).toThrow()
  })

  it('should transform dictionary inside root dictionary as <d>', () => {
    const dict = {
      k: {
        k: 2
      }
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<d><k>k</k><i>2</i></d>')
  })

  it('should wrap number whose chain is recorded inside realNumbers array into <r>', () => {
    const dict = {
      k: {
        l: 1
      }
    }
    const realNumbers = ['k.l']

    const result = stringify(dict, realNumbers)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<d><k>l</k><r>1</r></d>')
  })

  it('should stringify array into plist dictionary', () => {
    const dict = {
      k: [1, 2]
    }

    const result = stringify(dict)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<d><k>_isArr</k><t/><k>k_0</k><i>1</i><k>k_1</k><i>2</i></d>')
  })

  it('respect realNumbers array for the items inside array', () => {
    const dict = {
      k: [1, 2]
    }
    const realNumbers = ['k.k_0']

    const result = stringify(dict, realNumbers)
    const parsed = getDictElem(result)

    expect(parsed.childNodes[1].toString()).toBe('<d><k>_isArr</k><t/><k>k_0</k><r>1</r><k>k_1</k><i>2</i></d>')
  })

  it('should mark empty dictionary as <d />', () => {
    const dict = {
      k: {}
    }

    const result = stringify(dict)
    const stripped = strip(result)

    expect(stripped).toBe('<k>k</k><d />')
  })
})
