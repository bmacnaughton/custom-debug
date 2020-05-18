'use strict'

const tap = require('tap')

// turn these off so it's easy to compare messages.
process.env.DEBUG_COLORS = 'no'
process.env.DEBUG_HIDE_DATE = 'yes'

const DebugCustom = require('../lib/index.js')
const debug = require('debug')

const d1 = new DebugCustom('dc-test')

// verify the logger is called
debug.log = function (...args) {
  if (args.length > 1) {
    // eslint-disable-next-line no-console
    console.log(args);
  }
  tap.equal(args.length, 1);
  tap.equal(args[0], 'dc-test:error i am the japanese sandman');
}
const d1Error = d1.make('error');
d1Error('i am the japanese sandman');


// verify the logger is not called when a logger has been
// made but not enabled.
const d1Disabled = d1.make('disabled');
debug.log = function () {
  tap.fail('the logger should not be called');
}
d1Disabled('this should not be logged');

// verify that the logger is called when a logger is created
// and enabled.
debug.log = function (...args) {
  tap.equal(args.length, 1);
  tap.equal(args[0], 'dc-test:enabled i am enabled');
}
const d1Enabled = d1.make('enabled', true);
d1Enabled('i am enabled');
// set back to defaults
d1.logLevel = 'error,warn';

// enable plover and it should be called
debug.log = function (...args) {
  tap.equal(args.length, 1);
  tap.equal(args[0], 'dc-test:plover i am not');
}
const d1Plover = d1.make('plover');
d1.addEnabled('plover');
d1Plover('i am not');

// and logLevel should be correct
tap.equal(d1.logLevel, 'error,warn,plover');

// disable plover and it should not be called again
debug.log = function () {
  tap.fail('the logger should not be called');
}
d1.removeEnabled('plover');
d1Plover('not again');
