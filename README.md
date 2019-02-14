# custom-debug

A thin wrapper on the debug logging package.

# Motivation

I didn't like to enter `prefix:level` where `prefix` was required because multiple packages might be using the `debug` package and `prefix` was needed to prevent name conflicts. So I created this thin wrapper around `debug` that allows the user to hide the prefix used to prevent conflicts. custom-debug also makes it easy to add and remove debug levels dynamically under program control.

# The user experience

Using `debug`:

`export DEBUG=my-app:error,my-app:warn,my-app:info`

and, in code:

```
const debug = require('debug')

const logError = debug('my-app:error')
const logWarn = debug('my-app:warn')
const logInfo = debug('my-app:info')
```

Using `custom-debug`

`export MYAPP=error,warn,info`

in code,

```
const customDebug = new (require ('custom-debug'))
// specify the prefix and options, default settings are 'error,warn'.
const logger = new CustomDebug('my-app', {settings: process.env.MYAPP_LOG_SETTINGS})

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



