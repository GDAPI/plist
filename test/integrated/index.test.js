import { parse, stringify } from '../../build/index.js'
import loadText from '../util/loadText.js'

describe('integrated', () => {
  it('should parse and stringify CCGameManager exactly same as initial', async () => {
    const xml = await loadText('CCGameManager.xml')
    const parsed = parse(xml)
    const stringified = stringify(parsed.data, parsed.realNumbers)

    expect(stringified).toBe(xml)
  })

  it('should parse and stringify CCLocalLevels exactly same as initial', async () => {
    const xml = await loadText('CCLocalLevels.xml')
    const parsed = parse(xml)
    const stringified = stringify(parsed.data, parsed.realNumbers)

    expect(stringified).toBe(xml)
  })
})
