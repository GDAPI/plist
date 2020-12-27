import { DOMParser } from 'xmldom'
import GJ_VERSION from './version.js'

export default function parse (xmlStr) {
  const doc = new DOMParser().parseFromString(xmlStr)
  const plistElem = doc.documentElement

  if (!plistElem) {
    throw new Error('Not a GJPlist file: <plist> does not exists')
  }

  if (plistElem.getAttribute('gjver') !== GJ_VERSION) {
    throw new Error('Not compatible document version')
  }

  // GJPlist always contain one top level <dict> element
  // so it'll be the starting point
  const dictElem = plistElem.getElementsByTagName('dict')[0]
  const realNumbers = []
  const data = parseComponent(dictElem, realNumbers)
  return {
    data,
    realNumbers
  }
}

function parseComponent (node, realNumbers = [], chain = '') {
  switch (node.nodeName) {
    // in XML, case of the original tag is preserved(unlike real DOM)
    case 'dict': {
      // <dict> only appears at the depth 1 and is always real dictionary
      return parseDictionary(node, realNumbers, chain)
    }
    case 'd': {
      // <d> might be an array instead of a dictionary
      const dict = parseDictionary(node, realNumbers, chain)
      if (dict._isArr) {
        return migrateDictToArray(dict)
      }
      return dict
    }
    case 'k':
    case 's': {
      return node.textContent
    }
    case 'r': {
      const n = +node.textContent
      if (n % 1 === 0) {
        // if real number doesn't have fractional part
        // it is not possible to distinguish real and int
        realNumbers.push(chain)
      }
      return +node.textContent
    }
    case 'i': {
      return +node.textContent
    }
    case 't': {
      return true
    }
    // TODO: does this tag actually exists?
    case 'f': {
      return false
    }
    default: {
      throw new Error(`Unsupported node name: ${node.nodeName}`)
    }
  }
}

function createChain (oldChain, key) {
  if (oldChain.length === 0) return key
  return oldChain + `.${key}`
}

function parseDictionary (dictNode, realNumbers, chain) {
  const dictionary = {}
  let lastKey

  for (const childNode of getChildren(dictNode)) {
    if (childNode.nodeName === 'k') {
      lastKey = parseComponent(childNode)
    } else {
      const newChain = createChain(chain, lastKey)
      dictionary[lastKey] = parseComponent(childNode, realNumbers, newChain)
    }
  }

  return dictionary
}

function migrateDictToArray (dict) {
  const array = []
  for (const [key, value] of Object.entries(dict)) {
    if (key === '_isArr') continue

    // key has a format of k_<index>
    const index = +key.substring(2)
    array[index] = value
  }
  return array
}

function getChildren (elem) {
  // xmldom doesn't support iterator on node.childNodes
  // so it needs to be converted into an arrayF
  return Array.from(elem.childNodes).filter(isElement)
}

function isElement (node) {
  // node.tagName only exists in Element
  return !!node.tagName
}
