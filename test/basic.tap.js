'use strict'

const tap = require('tap')

const env = process.env

// turn these off so it's easy to compare messages.
env.DEBUG_COLORS = 'no'
env.DEBUG_HIDE_DATE = 'yes'

const DebugCustom = require('..')
const debug = require('debug')

// make a couple custom debug loggers
const d = new DebugCustom('dc')
const d1 = new DebugCustom('dc1', {defaultLevels: 'xyzzy'})

// make sure it constructed instances in both cases
tap.ok(d instanceof DebugCustom)
tap.ok(d1 instanceof DebugCustom)

// make sure it attached debug to them
tap.ok(d.debug === debug)
tap.ok(d.debug === d1.debug)

// verify the default settings
tap.equal(d.logLevel, 'error,warn')

// verify the options-specified settings
tap.equal(d1.logLevel, 'xyzzy')

// verify that the process DEBUG variable is correct
tap.same(pieces(env.DEBUG), pieces('dc:error,dc:warn,dc1:xyzzy'))

// verify that a new level can be added
d.addEnabled('info')
tap.equal(d.logLevel, 'error,warn,info')

// and that it was added to DEBUG as well
tap.same(pieces(env.DEBUG), pieces('dc:error,dc:warn,dc1:xyzzy,dc:info'))

// and that it can be removed correctly
d.removeEnabled('info')
tap.equal(d.logLevel, 'error,warn')
tap.same(pieces(env.DEBUG), pieces('dc:error,dc:warn,dc1:xyzzy'))

// and that the last remaining level can be removed correctly
d1.removeEnabled('xyzzy')
tap.equal(d1.logLevel, '')
tap.same(pieces(env.DEBUG), pieces('dc:error,dc:warn'))

// verify that it makes a logger
const logger = d.make('error')
tap.ok(typeof logger === 'function')

// verify that it makes a logger when not enabled
const logger1 = d1.make('plover')
tap.ok(typeof logger1 === 'function')

// and logLevel should stay empty
tap.equal(d1.logLevel, '')

// verify that extra spaces and commas are ignored when setting
d.logLevel = ', , error ,, warn,'
tap.equal(d.logLevel, 'error,warn')
tap.same(pieces(env.DEBUG), pieces('dc:error,dc:warn'))

// verify that extra spaces and commas in DEBUG are removed
env.DEBUG = ' dc2:error,, dc2:warn'
const d2 = new DebugCustom('dc2')
tap.equal(d2.logLevel, 'error,warn')
tap.same(pieces(env.DEBUG), pieces('dc2:error,dc2:warn'))

// verify that existing DEBUG settings are incorporated on construction
env.DEBUG = ' dc3:info'
const d3 = new DebugCustom('dc3')
tap.equal(d3.logLevel, 'error,warn,info')
tap.same(pieces(env.DEBUG), pieces('dc3:error,dc3:warn,dc3:info'))

// verify that duplicates are not added
d3.addEnabled('info')
tap.equal(d3.logLevel, 'error,warn,info')
tap.same(pieces(env.DEBUG), pieces('dc3:error,dc3:warn,dc3:info'))

// verify that duplicates can't be added in the argument
d3.logLevel = 'x,x,x'
tap.equal(d3.logLevel, 'x')
tap.same(pieces(env.DEBUG), pieces('dc3:x'))

// verify that duplicates can't be enabled
d3.addEnabled('x,x,x')
tap.equal(d3.logLevel, 'x')
tap.same(pieces(env.DEBUG), pieces('dc3:x'))

delete env.DEBUG
const d4 = new DebugCustom('dc4');

// verify that arrays of strings are allowed
d4.addEnabled(['xyzzy']);
tap.equal(d4.logLevel, 'error,warn,xyzzy');
tap.same(pieces(env.DEBUG), pieces('dc4:error,dc4:warn,dc4:xyzzy'));

d4.removeEnabled(['warn', 'xyzzy']);
tap.equal(d4.logLevel, 'error');
tap.same(pieces(env.DEBUG), pieces('dc4:error'));

// verify that an illegal argument is handled
tap.equal(d4.addEnabled(1), undefined);
tap.equal(d4.removeEnabled({}), undefined);

// verify that it picks up a custom environment variable
process.env.MY_CUSTOM_VAR = 'rock,paper,scissors'
const opts = {
  envName: 'MY_CUSTOM_VAR',
  defaultLevels: ''
}
const d5 = new DebugCustom('custom', opts)
tap.equal(d5.logLevel, 'rock,paper,scissors')

// verify that it ignores DEBUG values if there's a custom environment variable
process.env.DEBUG = 'custom:xyzzy'
const d6 = new DebugCustom('custom', opts)
tap.equal(d6.logLevel, 'rock,paper,scissors')

//
// helper
//
function pieces (s) {
  return s.split(/[\s,]+/).sort()
}
