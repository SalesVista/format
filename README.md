# @salesvista/format

> Format some numbers

[![CI Status](https://github.com/SalesVista/format/workflows/CI/badge.svg?branch=master)](https://github.com/SalesVista/format/actions)
[![Coverage Status](https://coveralls.io/repos/github/SalesVista/format/badge.svg?branch=master)](https://coveralls.io/github/SalesVista/format?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A utility package to consistently format numbers as either currency, percentages, or decimals in a locale-specific way.

## Install

```console
$ npm i @salesvista/format
```

```js
// with babel
import format from '@salesvista/format'
// without babel
const format = require('@salesvista/format')
```

## Usage

This package contains a single module. The main export is an object containing utility functions and helper constants. When you import/require this module, you can either keep the object reference (to have all functions available at the same namespace) or decompose into only the desired functions.

```js
// all functions under one namespace
const format = require('@salesvista/format')
// or pick the functions you want
const { formatAs } = require('@salesvista/format')
```

The API documentation below assumes the former.

## API

The following functions are listed in alphabetical order.

### `format.formatAs(value, valueType, opts)`

Format a given number value into a locale-specific string, interpreted as the given type. Rounding may be applied, depending on the scenario.

`value` should be a number or string representing the value to format.

`valueType` should be one of:

- `format.CURRENCY` to format `value` as currency
- `format.PERCENTAGE` to format `value` as a percentage
- `format.UNIT` to format `value` as volume (decimal)

The following `opts` are supported:

- `locale` (string, default `'en'`): a [BCP 47](https://tools.ietf.org/html/bcp47) language tag
- `currency` (string, default `'usd'`): an ISO 4217 currency code
- `_terse` (boolean, default `false`): pass `true` to override default decimal display for currency values that are integers
- any property supported by the [`Intl.NumberFormat` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat), such as `style`, `minimumFractionDigits`, `maximumFractionDigits`, etc

Examples:

```js
format.formatAs(0, format.CURRENCY)
// => '$0.00'
format.formatAs(0, format.CURRENCY, format.terse())
// => '$0'
format.formatAs(12345.12345, format.CURRENCY)
// => '$12,345.12'
format.formatAs(12345.12345, format.CURRENCY, { locale: 'fr-FR', currency: 'eur' })
// => '12 345,12 €'
format.formatAs(0, format.PERCENTAGE)
// => '0%'
format.formatAs(25 / 12, format.PERCENTAGE)
// => '2.08%'
```

### `format.formatAttainmentPercentage(attainment, target, opts)`

Calculate percentage attained and return as a formatted string in a locale-specific way.

`attainment` should be the actual value (number) attained for a given time period.

`target` should be the target value (number) representing the goal for the given time period.

The percentage will be calculated using `format.toAttainmentPercentage(attainment, target, opts)` and formatted using `format.formatAs(percentage, format.PERCENTAGE, opts)`. See documentation for those functions.

Examples:

```js
format.formatAttainmentPercentage(5, 9)
// => '55.56%'
format.formatAttainmentPercentage(5, 9, { locale: 'fr-FR' })
// => '55,56 %'
format.formatAttainmentPercentage(25, 12)
// => '208.33%'
format.formatAttainmentPercentage(1, 0)
// => '100%'
format.formatAttainmentPercentage(0, 1)
// => '0%'
```

### `format.isNumber(value)`

Returns a boolean representing if the value represents a number.

### `format.isValidType(valueType)`

Returns a boolean representing if the given value type is valid/known to this library.

### `format.round(value)`

Returns the given value converted to a number via `format.toNumber(value)` and rounded to two decimal places.

### `format.terse(opts)`

Convenience function to apply a `_terse: true` option to the given opts object.

### `format.toAttainmentPercentage(attainment, target, opts)`

Calculate percentage attained as `(attainment / target) * 100`, rounded to two decimal places by default, returned as a number.

`attainment` should be the actual value (number) attained for a given time period.

`target` should be the target value (number) representing the goal for the given time period.

The following `opts` are supported:

- `rounded` (boolean, default `true`): pass `false` to skip rounding of the returned value

### `format.toNumber(value)`

Convert the given value to a number, if possible. If not possible, returns `null`.

### `format.trim(value)`

Helper function to trim whitespace off a string, used internally by `format.isNumber(value)`.

## Releasing

After one or more PRs have been merged to master, you can cut a new release with the following commands:

```bash
# update local master branch
git checkout master && git pull origin master
# make sure tests pass
npm it
# bump version, update changelog, and create git tag
npm run release
# push release to github
git push -u --follow-tags origin master
# publish release to npm
npm publish --access public
```

Then you can update the version referenced by any apps/packages that use this as a dependency.
