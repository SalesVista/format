const tap = require('tap')
const format = require('./lib/index')

tap.test('valueTypes', t => {
  t.equal(format.CURRENCY, 'currency')
  t.equal(format.PERCENTAGE, 'percentage')
  t.equal(format.UNIT, 'unit')
  t.end()
})

tap.test('isValidType', t => {
  t.equal(format.isValidType(), false)
  t.equal(format.isValidType(null), false)
  t.equal(format.isValidType(''), false)
  t.equal(format.isValidType('xyz'), false)
  t.equal(format.isValidType(format.CURRENCY), true)
  t.equal(format.isValidType(format.PERCENTAGE), true)
  t.equal(format.isValidType(format.UNIT), true)
  t.end()
})

tap.test('trim', t => {
  t.equal(format.trim(), '')
  t.equal(format.trim(null), '')
  t.equal(format.trim(''), '')
  t.equal(format.trim('hi'), 'hi')
  t.equal(format.trim(' hi'), 'hi')
  t.equal(format.trim('hi '), 'hi')
  t.equal(format.trim(' hi '), 'hi')
  t.equal(format.trim('\nhi'), 'hi')
  t.equal(format.trim('hi\n'), 'hi')
  t.equal(format.trim('\n\n \n hi \n \n\n'), 'hi')
  t.equal(format.trim('Hello World'), 'Hello World')
  t.equal(format.trim('Hello  World'), 'Hello  World')
  t.equal(format.trim('Hello\nWorld'), 'Hello\nWorld')
  t.equal(format.trim(' Hello\nWorld'), 'Hello\nWorld')
  t.equal(format.trim(' Hello\nWorld  '), 'Hello\nWorld')
  t.equal(format.trim('\nHello \n World  '), 'Hello \n World')
  t.end()
})

tap.test('terse', t => {
  t.strictSame(format.terse(), { _terse: true })
  t.strictSame(format.terse({ x: 'y' }), { _terse: true, x: 'y' })
  t.end()
})

tap.test('isNumber', t => {
  t.equal(format.isNumber(), false)
  t.equal(format.isNumber(null), false)
  t.equal(format.isNumber(''), false)
  t.equal(format.isNumber(0), true)
  t.equal(format.isNumber('0'), true)
  t.equal(format.isNumber(1.23456), true)
  t.equal(format.isNumber('1.23456'), true)
  t.equal(format.isNumber(25 / 12), true)
  t.equal(format.isNumber(1 / 0), true)
  t.end()
})

tap.test('toNumber', t => {
  t.equal(format.toNumber(), null)
  t.equal(format.toNumber(null), null)
  t.equal(format.toNumber(''), null)
  t.equal(format.toNumber(0), 0)
  t.equal(format.toNumber('0'), 0)
  t.equal(format.toNumber(1.23456), 1.23456)
  t.equal(format.toNumber('1.23456'), 1.23456)
  t.equal(format.toNumber(25 / 12), 2.0833333333333335)
  t.equal(format.toNumber(0.1 + 0.2), 0.30000000000000004)
  t.end()
})

tap.test('round', t => {
  t.equal(format.round(), null)
  t.equal(format.round(null), null)
  t.equal(format.round(''), null)
  t.equal(format.round(0), 0)
  t.equal(format.round('0'), 0)
  t.equal(format.round(1.23456), 1.23)
  t.equal(format.round('1.23456'), 1.23)
  t.equal(format.round(25 / 12), 2.08)
  t.equal(format.round(0.1 + 0.2), 0.3)
  t.end()
})

tap.test('toAttainmentPercentage', t => {
  t.equal(format.toAttainmentPercentage(), null)
  t.equal(format.toAttainmentPercentage(null), null)
  t.equal(format.toAttainmentPercentage(''), null)
  t.equal(format.toAttainmentPercentage('1', '0'), 100)
  t.equal(format.toAttainmentPercentage(25, 12), 208.33)
  t.equal(format.toAttainmentPercentage(25, 12, { rounded: false }), 208.33333333333334)
  t.equal(format.toAttainmentPercentage('5', 9), 55.56)
  t.equal(format.toAttainmentPercentage(5, 9, { rounded: true }), 55.56)
  t.equal(format.toAttainmentPercentage(5, '9', { rounded: false }), 55.55555555555556)
  t.equal(format.toAttainmentPercentage(0, 1000), 0)
  t.equal(format.toAttainmentPercentage(0.1 + 0.2, 1), 30)
  t.equal(format.toAttainmentPercentage(0.1 + 0.2, 1, { rounded: false }), 30.000000000000004)
  t.end()
})

tap.test('formatAttainmentPercentage', t => {
  t.equal(format.formatAttainmentPercentage(), '0%')
  t.equal(format.formatAttainmentPercentage(null), '0%')
  t.equal(format.formatAttainmentPercentage(''), '0%')
  t.equal(format.formatAttainmentPercentage('1', '0'), '100%')
  t.equal(format.formatAttainmentPercentage(25, 12), '208.33%')
  t.equal(format.formatAttainmentPercentage('5', 9), '55.56%')
  t.equal(format.formatAttainmentPercentage(0, 1000), '0%')
  t.equal(format.formatAttainmentPercentage(0.1 + 0.2, 1), '30%')
  t.equal(format.formatAttainmentPercentage(5, 9, { locale: 'fr-FR', currency: 'eur' }), '55,56 %') // space in result is code point 160 instead of 32
  t.end()
})

tap.test('formatAs', t => {
  t.equal(format.formatAs(), '0')
  t.equal(format.formatAs(null), '0')
  t.equal(format.formatAs(''), '0')
  t.equal(format.formatAs(0), '0')
  t.equal(format.formatAs(0, format.CURRENCY), '$0.00')
  t.equal(format.formatAs(0, format.CURRENCY, format.terse()), '$0')
  t.equal(format.formatAs(0, format.PERCENTAGE), '0%')
  t.equal(format.formatAs(0, format.UNIT), '0')
  t.equal(format.formatAs(0, null, { locale: 'ja-JP', currency: 'jpy', style: 'currency' }), '￥0')
  t.equal(format.formatAs(12345.12345, format.CURRENCY, { locale: 'ja-JP', currency: 'jpy' }), '￥12,345')
  t.equal(format.formatAs(12345.12345, format.CURRENCY, { locale: 'en_US', currency: 'jpy' }), '¥12,345') // locale deliberately invalid
  t.equal(format.formatAs(12345.12345, format.CURRENCY, { locale: 'fr-FR', currency: 'eur' }), '12 345,12 €')
  t.equal(format.formatAs(12345.12345, format.CURRENCY, format.terse({ locale: 'fr-FR', currency: 'eur' })), '12 345,12 €')
  t.equal(format.formatAs(12345, format.CURRENCY, { locale: 'fr-FR', currency: 'eur' }), '12 345,00 €')
  t.equal(format.formatAs(12345, format.CURRENCY, format.terse({ locale: 'fr-FR', currency: 'eur' })), '12 345 €')
  t.equal(format.formatAs(12345.12345, format.UNIT, { maximumFractionDigits: 3 }), '12,345.123')
  t.equal(format.formatAs(12345.12345, format.CURRENCY, { maximumFractionDigits: 3 }), '$12,345.123')
  t.equal(format.formatAs(12345.12345, format.PERCENTAGE, { maximumFractionDigits: 3 }), '12,345.123%')
  t.equal(format.formatAs(1, format.PERCENTAGE, { minimumFractionDigits: 3, maximumFractionDigits: 3 }), '1.000%')
  t.equal(format.formatAs(25 / 12, format.PERCENTAGE), '2.08%')
  t.equal(format.formatAs(0.1 + 0.2, format.CURRENCY), '$0.30')
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
  t.equal(format.formatAs(12345, format.CURRENCY, opts), '12 345 €')
  t.equal(opts.locale, 'fr-FR')
  t.equal(opts.currency, 'eur')
  t.strictSame(opts.strings, { sale: { singular: 'Événement', plural: null } })
  t.equal(opts._terse, true)
  t.equal(opts.style, undefined)
  t.equal(opts.minimumFractionDigits, undefined)
  t.equal(opts.maximumFractionDigits, undefined)
  t.equal(Object.keys(opts).length, 4)
  t.end()
})
