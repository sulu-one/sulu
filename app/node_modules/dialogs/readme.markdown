# dialogs

non blocking `confirm`, `alert` and `prompt` dialogs.

Theses native counterparts block the UI thread, are are not allowed in electron and some chrome extention contexts.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Try it out! [![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/embed?gist=5b6d6b63f8709deb3b5a)

use with [browserify](http://browserify.org):

# methods

``` js
var Dialogs = require('dialogs')
```

## var dialogs = Dialogs(opts={})

opts.ok default OK

opts.cancel default Cancel

opts.hostname default location.hostname

opts.icon optional url for icon

## dialogs.alert([text], cb)
## dialogs.prompt([text], [default], cb)
## dialogs.confirm([text], cb)
## dialogs.cancel()

Shortcut to cancel the open dialog if exists.

# example

``` js
dialogs.alert('okidoki', function(ok) {
  console.log('alert', ok)
  dialogs.confirm('ok?', function(ok) {
    console.log('confirm', ok)
    dialogs.prompt('username', 'joe.smith@gmail.com', function(ok) {
      console.log('prompt with default', ok)
      dialogs.prompt('username', function(ok) {
        console.log('prompt', ok)
      })
    })
  })
})
```

# install

With [npm](https://npmjs.org) do:

```
npm install dialogs
```

# license

MIT
