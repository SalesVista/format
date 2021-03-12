function trim (val) {
  return val == null ? '' : String(val).trim()
}

function isNumber (value) {
  switch (typeof value) {
    case 'number':
      return !Number.isNaN(value)
    case 'string':
      return !!trim(value) && !isNaN(value)
  }
  return false
}

function toNumber (value) {
  return isNumber(value) ? Number(value) : null
}

// rounds to 2 decimal places, returned as a number
// from https://stackoverflow.com/a/18358056/1174467
function round (value) {
  value = toNumber(value)
  return value === null ? value : Number(Math.round(value + 'e+2') + 'e-2')
}

const valueTypes = {
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  UNIT: 'unit'
}

const intlNumberFormatStyles = {}
intlNumberFormatStyles[valueTypes.CURRENCY] = 'currency'
intlNumberFormatStyles[valueTypes.PERCENTAGE] = 'percent'
intlNumberFormatStyles[valueTypes.UNIT] = 'decimal'

// this approach has better browser support than Object.values()
const vts = Object.keys(valueTypes).map(k => valueTypes[k])

function isValidType (valueType) {
  return vts.indexOf(valueType) !== -1
}

function formatAs (value, valueType, opts) {
  opts = Object.assign({}, opts)
  if (!opts.locale) opts.locale = 'en'
  if (!opts.currency) opts.currency = 'usd'
  if (!opts.style) opts.style = intlNumberFormatStyles[valueType] || 'decimal'

  const num = valueType === valueTypes.PERCENTAGE ? (toNumber(value) / 100) : toNumber(value)

  if (typeof opts.maximumFractionDigits !== 'number') {
    if (valueType === valueTypes.PERCENTAGE) {
      // decimals for percentage allowed to be .xx
      opts.maximumFractionDigits = 2
    } else if (opts._terse && Number.isInteger(round(num))) {
      // do not use decimals for integer currency or unit values
      opts.minimumFractionDigits = 0 // required to set maximumFractionDigits = 0
      opts.maximumFractionDigits = 0
    }
  }

  delete opts._terse

  return new Intl.NumberFormat(opts.locale, opts).format(num)
}

function terse (opts) {
  return Object.assign({ _terse: true }, opts)
}

// returns a number representing `attainment / target` lifted as a percentage
// returned number will be rounded by default, if you don't want rounding use opts.rounded = false
function toAttainmentPercentage (attainment, target, opts) {
  const targetNum = toNumber(target)
  const attainmentNum = toNumber(attainment)
  if (targetNum === null || attainmentNum === null) return null
  const quotientNum = targetNum === 0 ? 1 : attainmentNum / targetNum
  const percentage = quotientNum * 100
  return opts && opts.rounded === false ? percentage : round(percentage)
}

function formatAttainmentPercentage (attainment, target, opts) {
  return formatAs(toAttainmentPercentage(attainment, target, opts), valueTypes.PERCENTAGE, opts)
}

module.exports = Object.assign({
  formatAs,
  formatAttainmentPercentage,
  isNumber,
  isValidType,
  round,
  terse,
  toAttainmentPercentage,
  toNumber,
  trim
}, valueTypes)
