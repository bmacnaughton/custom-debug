# debug-custom

A thin wrapper on the [debug](https://github.com/visionmedia/debug) logging package that allows levels to appear customized for your package.

# Motivation

I didn't like to enter `prefix:level` where `prefix` was required to prevent name conflicts because multiple packages might be using the `debug` package. `debug-custom` is a thin wrapper around `debug` that allows the user to hide whatever prefix is used to prevent conflicts. debug-custom also makes it easier to add and remove debug levels dynamically under program control.

# The user experience

Using `debug` the package prefix must be repeated for each log level:

`export DEBUG=my-app:error,my-app:warn,my-app:info`

and, in code:

```
const debug = require('debug')

const logError = debug('my-app:error')
const logWarn = debug('my-app:warn')
const logInfo = debug('my-app:info')
```

Using `debug-custom` the package prefix is invisible:

`export MYAPP=error,warn,info`

in code,

```
const DebugCustom = new (require ('debug-custom'))
// specify the prefix and options, default settings are 'error,warn'.
const logger = new DebugCustom('my-app', {defaultLevels: process.env.MYAPP_LOG_SETTINGS})

const logError = logger.make('error')
const logWarn = logger.make('warn')
const logInfo = logger.make('info')
```

# Added benefits

And, if you want to enable or disable levels via API, just use

```
logger.addEnabled('debug')
logger.removeEnabled('info')
```

If you want to set absolutely (not adding or removing)

```
const previous = logger.logLevel
logger.logLevel = 'error'
// do some stuff
logger.logLevel = previous
```

You can also set `logLevel` to an array if you want.

# Final notes

If you need access to the instance of `debug` used it's available as `logger.debug`. This can come in handy for testing.

The prefix you instantiate the `CustomDebug` class should not conflict with other packages using `debug`.

# Known issue

This release only handles comma-delimited, not-space delimited, versions of the `DEBUG` environment variable.
