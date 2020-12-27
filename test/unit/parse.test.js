import { parse } from '../../build/index.js'

function createTestPlist (contents) {
  return `
  <?xml version="1.0"?>
  <plist version="1.0" gjver="2.0">
    <dict>
      ${contents}
    </dict>
  </plist>  
  `
}

describe('parse()', () => {
  it('should throw if GJ_VERSION does not match', () => {
    const plist = `
      <?xml version="1.0"?>
      <plist version="1.0" gjver="1.9">
        <dict></dict>
      </plist>
    `
    expect(() => parse(plist)).toThrow()
  })

  it('should parse <dict>', () => {
    const plist = createTestPlist()
    expect(parse(plist).data).toEqual({})
  })

  it('should parse <i> as a number', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <i>4</i>
    `)
    expect(parse(plist).data).toEqual({
      k: 4
    })
  })

  it('should parse <r> as a number', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <r>1.5</r>
    `)
    expect(parse(plist).data).toEqual({
      k: 1.5
    })
  })

  it('should parse <s> as a string', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <s>meow</s>
    `)
    expect(parse(plist).data).toEqual({
      k: 'meow'
    })
  })

  it('should parse <t /> as true', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <t />
    `)
    expect(parse(plist).data).toEqual({
      k: true
    })
  })

  it('should parse <f /> as false', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <f />
    `)
    expect(parse(plist).data).toEqual({
      k: false
    })
  })

  it('should parse <d> as a dictionary', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <d>
        <k>k</k>
        <i>1</i>
      </d>
    `)
    expect(parse(plist).data).toEqual({
      k: {
        k: 1
      }
    })
  })

  it('should parse <d> with _isArr set to true as an array', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <d>
        <k>_isArr</k>
        <t />
        <k>k_0</k>
        <i>0</i>
        <k>k_1</k>
        <i>1</i>
      </d>
    `)
    expect(parse(plist).data).toEqual({
      k: [0, 1]
    })
  })

  it('should generate realNumbers array for real number without fractional part', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <r>1</r>
    `)
    expect(parse(plist).realNumbers).toEqual([
      'k'
    ])
  })

  it('should not generate type map for numbers with fractional part', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <r>1.5</r>
    `)
    expect(parse(plist).realNumbers).toEqual([])
  })

  it('should not generate realNumbers array for integer', () => {
    const plist = createTestPlist(`
    <k>k</k>
    <i>1</i>
  `)
    expect(parse(plist).realNumbers).toEqual([])
  })

  it('should generate realNumbers array for item inside dictionary', () => {
    const plist = createTestPlist(`
      <k>k</k>
      <d>
        <k>n</k>
        <r>3</r>
      </d>
    `)
    expect(parse(plist).realNumbers).toEqual([
      'k.n'
    ])
  })
})
