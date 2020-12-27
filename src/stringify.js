import GJ_VERSION from './version.js'

const header = `<?xml version="1.0"?><plist version="1.0" gjver="${GJ_VERSION}"><dict>`

export default function stringify (dict, realNumbers = []) {
  if (typeof dict !== 'object') {
    throw new Error('Parameter 1 dict must be an object')
  }

  if (!Array.isArray(realNumbers)) {
    throw new Error('Parameter 2 realNumbers must be an array')
  }

  // only root dict has a nodeName of <dict>(while others are <d>)
  // so call stringifyDict() instead of stringifyValue()
  // which doesn't encapsulate its contents inside any tag
  return header + stringifyDict(dict, realNumbers) + '</dict></plist>'
}

function stringifyValue (value, realNumbers, propChain) {
  switch (typeof value) {
    case 'string': {
      return `<s>${value}</s>`
    }
    case 'boolean': {
      return value === true ? '<t />' : '<f />'
    }
    case 'number': {
      if (value % 1 === 0 && !realNumbers.includes(propChain)) {
        return `<i>${value}</i>`
      }
      return `<r>${value}</r>`
    }
    case 'object': {
      // TODO: how Geometry Dash will handle empty array?
      let dict

      if (Array.isArray(value)) {
        dict = migrateArrayToDict(value)
      } else {
        dict = value
      }

      const stringifiedValue = stringifyDict(dict, realNumbers, propChain)
      if (stringifiedValue.length === 0) {
        return '<d />'
      }
      return `<d>${stringifiedValue}</d>`
    }
    default: {
      throw new Error(`Type ${typeof value} is not allowed`)
    }
  }
}

function stringifyDict (dict, realNumbers, objChain = '') {
  let str = ''
  for (const [key, value] of Object.entries(dict)) {
    const propChain = appendChain(key, objChain)
    str += `<k>${key}</k>`
    str += stringifyValue(value, realNumbers, propChain)
  }

  return str
}

function appendChain (key, oldChain = '') {
  if (oldChain.length === 0) return key
  return oldChain + '.' + key
}

function migrateArrayToDict (array) {
  const dict = {
    _isArr: true
  }

  for (const [index, item] of array.entries()) {
    dict[`k_${index}`] = item
  }
  return dict
}
