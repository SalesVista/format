const tap = require('tap')
const format = require('./lib/index')

tap.test('valueTypes', t => {
  t.strictEqual(format.CURRENCY, 'currency')
  t.strictEqual(format.PERCENTAGE, 'percentage')
  t.strictEqual(format.UNIT, 'unit')
  t.end()
})

tap.test('isValidType', t => {
  t.strictEqual(format.isValidType(), false)
  t.strictEqual(format.isValidType(null), false)
  t.strictEqual(format.isValidType(''), false)
  t.strictEqual(format.isValidType('xyz'), false)
  t.strictEqual(format.isValidType(format.CURRENCY), true)
  t.strictEqual(format.isValidType(format.PERCENTAGE), true)
  t.strictEqual(format.isValidType(format.UNIT), true)
  t.end()
})

tap.test('trim', t => {
  t.strictEqual(format.trim(), '')
  t.strictEqual(format.trim(null), '')
  t.strictEqual(format.trim(''), '')
  t.strictEqual(format.trim('hi'), 'hi')
  t.strictEqual(format.trim(' hi'), 'hi')
  t.strictEqual(format.trim('hi '), 'hi')
  t.strictEqual(format.trim(' hi '), 'hi')
  t.strictEqual(format.trim('\nhi'), 'hi')
  t.strictEqual(format.trim('hi\n'), 'hi')
  t.strictEqual(format.trim('\n\n \n hi \n \n\n'), 'hi')
  t.strictEqual(format.trim('Hello World'), 'Hello World')
  t.strictEqual(format.trim('Hello  World'), 'Hello  World')
  t.strictEqual(format.trim('Hello\nWorld'), 'Hello\nWorld')
  t.strictEqual(format.trim(' Hello\nWorld'), 'Hello\nWorld')
  t.strictEqual(format.trim(' Hello\nWorld  '), 'Hello\nWorld')
  t.strictEqual(format.trim('\nHello \n World  '), 'Hello \n World')
  t.end()
})

tap.test('terse', t => {
  t.strictDeepEquals(format.terse(), { _terse: true })
  t.strictDeepEquals(format.terse({ x: 'y' }), { _terse: true, x: 'y' })
  t.end()
})

tap.test('isNumber', t => {
  t.strictEqual(format.isNumber(), false)
  t.strictEqual(format.isNumber(null), false)
  t.strictEqual(format.isNumber(''), false)
  t.strictEqual(format.isNumber(0), true)
  t.strictEqual(format.isNumber('0'), true)
  t.strictEqual(format.isNumber(1.23456), true)
  t.strictEqual(format.isNumber('1.23456'), true)
  t.strictEqual(format.isNumber(25 / 12), true)
  t.strictEqual(format.isNumber(1 / 0), true)
  t.end()
})

tap.test('toNumber', t => {
  t.strictEqual(format.toNumber(), null)
  t.strictEqual(format.toNumber(null), null)
  t.strictEqual(format.toNumber(''), null)
  t.strictEqual(format.toNumber(0), 0)
  t.strictEqual(format.toNumber('0'), 0)
  t.strictEqual(format.toNumber(1.23456), 1.23456)
  t.strictEqual(format.toNumber('1.23456'), 1.23456)
  t.strictEqual(format.toNumber(25 / 12), 2.0833333333333335)
  t.strictEqual(format.toNumber(0.1 + 0.2), 0.30000000000000004)
  t.end()
})

tap.test('round', t => {
  t.strictEqual(format.round(), null)
  t.strictEqual(format.round(null), null)
  t.strictEqual(format.round(''), null)
  t.strictEqual(format.round(0), 0)
  t.strictEqual(format.round('0'), 0)
  t.strictEqual(format.round(1.23456), 1.23)
  t.strictEqual(format.round('1.23456'), 1.23)
  t.strictEqual(format.round(25 / 12), 2.08)
  t.strictEqual(format.round(0.1 + 0.2), 0.3)
  t.end()
})

tap.test('toAttainmentPercentage', t => {
  t.strictEqual(format.toAttainmentPercentage(), null)
  t.strictEqual(format.toAttainmentPercentage(null), null)
  t.strictEqual(format.toAttainmentPercentage(''), null)
  t.strictEqual(format.toAttainmentPercentage('1', '0'), 100)
  t.strictEqual(format.toAttainmentPercentage(25, 12), 208.33)
  t.strictEqual(format.toAttainmentPercentage(25, 12, { rounded: false }), 208.33333333333334)
  t.strictEqual(format.toAttainmentPercentage('5', 9), 55.56)
  t.strictEqual(format.toAttainmentPercentage(5, 9, { rounded: true }), 55.56)
  t.strictEqual(format.toAttainmentPercentage(5, '9', { rounded: false }), 55.55555555555556)
  t.strictEqual(format.toAttainmentPercentage(0, 1000), 0)
  t.strictEqual(format.toAttainmentPercentage(0.1 + 0.2, 1), 30)
  t.strictEqual(format.toAttainmentPercentage(0.1 + 0.2, 1, { rounded: false }), 30.000000000000004)
  t.end()
})

tap.test('formatAttainmentPercentage', t => {
  t.strictEqual(format.formatAttainmentPercentage(), '0%')
  t.strictEqual(format.formatAttainmentPercentage(null), '0%')
  t.strictEqual(format.formatAttainmentPercentage(''), '0%')
  t.strictEqual(format.formatAttainmentPercentage('1', '0'), '100%')
  t.strictEqual(format.formatAttainmentPercentage(25, 12), '208.33%')
  t.strictEqual(format.formatAttainmentPercentage('5', 9), '55.56%')
  t.strictEqual(format.formatAttainmentPercentage(0, 1000), '0%')
  t.strictEqual(format.formatAttainmentPercentage(0.1 + 0.2, 1), '30%')
  t.strictEqual(format.formatAttainmentPercentage(5, 9, { locale: 'fr-FR', currency: 'eur' }), '55,56 %') // space in result is code point 160 instead of 32
  t.end()
})

tap.test('formatAs', t => {
  t.strictEqual(format.formatAs(), '0')
  t.strictEqual(format.formatAs(null), '0')
  t.strictEqual(format.formatAs(''), '0')
  t.strictEqual(format.formatAs(0), '0')
  t.strictEqual(format.formatAs(0, format.CURRENCY), '$0.00')
  t.strictEqual(format.formatAs(0, format.CURRENCY, format.terse()), '$0')
  t.strictEqual(format.formatAs(0, format.PERCENTAGE), '0%')
  t.strictEqual(format.formatAs(0, format.UNIT), '0')
  t.strictEqual(format.formatAs(0, null, { locale: 'ja-JP', currency: 'jpy', style: 'currency' }), '￥0')
  t.strictEqual(format.formatAs(12345.12345, format.CURRENCY, { locale: 'ja-JP', currency: 'jpy' }), '￥12,345')
  t.strictEqual(format.formatAs(12345.12345, format.CURRENCY, { locale: 'fr-FR', currency: 'eur' }), '12 345,12 €')
  t.strictEqual(format.formatAs(12345.12345, format.CURRENCY, format.terse({ locale: 'fr-FR', currency: 'eur' })), '12 345,12 €')
  t.strictEqual(format.formatAs(12345, format.CURRENCY, { locale: 'fr-FR', currency: 'eur' }), '12 345,00 €')
  t.strictEqual(format.formatAs(12345, format.CURRENCY, format.terse({ locale: 'fr-FR', currency: 'eur' })), '12 345 €')
  t.strictEqual(format.formatAs(12345.12345, format.UNIT, { maximumFractionDigits: 3 }), '12,345.123')
  t.strictEqual(format.formatAs(12345.12345, format.CURRENCY, { maximumFractionDigits: 3 }), '$12,345.123')
  t.strictEqual(format.formatAs(12345.12345, format.PERCENTAGE, { maximumFractionDigits: 3 }), '12,345.123%')
  t.strictEqual(format.formatAs(1, format.PERCENTAGE, { minimumFractionDigits: 3, maximumFractionDigits: 3 }), '1.000%')
  t.strictEqual(format.formatAs(25 / 12, format.PERCENTAGE), '2.08%')
  t.strictEqual(format.formatAs(0.1 + 0.2, format.CURRENCY), '$0.30')
  t.end()
})

tap.test('formatAs should not modify opts', t => {
  const opts = {
    locale: 'fr-FR',
    currency: 'eur',
    strings: {
      sale: {
        singular: 'Événement',
        plural: null
      }
    },
    _terse: true
  }
  t.strictEqual(format.formatAs(12345, format.CURRENCY, opts), '12 345 €')
  t.strictEqual(opts.locale, 'fr-FR')
  t.strictEqual(opts.currency, 'eur')
  t.strictDeepEquals(opts.strings, { sale: { singular: 'Événement', plural: null } })
  t.strictEqual(opts._terse, true)
  t.strictEqual(opts.style, undefined)
  t.strictEqual(opts.minimumFractionDigits, undefined)
  t.strictEqual(opts.maximumFractionDigits, undefined)
  t.strictEqual(Object.keys(opts).length, 4)
  t.end()
})
