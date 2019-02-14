# custom-debug

A thin wrapper on the debug logging package.

# Motivation

I didn't think it was a good experience to have to enter `prefix:category` where `prefix` was required because multiple packages might be used the `debug` package and they all used the same `DEBUG` environment variable. So I created this thin wrapper around `debug` that allows the user to specify a prefix to that is used to prevent conflicts with other packages using the `debug` package but that is not required when adding or removing log levels.

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
const logger = new (require ('custom-debug'))('my-app')

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



