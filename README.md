# NekoJS

node framework for building web applications

```
$ npm install nekojs
```

requires __node v4.0.0__ or higher for (partial) ES2015 support.

### Example:

```
var Neko = require('nekojs');
var app = new Neko();

app.get('/users/:id', (req, res) => {
  res.json({
    name: 'Bob'
  })
})

app.listen(p => {
  log.sys(`Started on ${p}`)
})
```

### TODOS:

* Fix the template rendering errors response/error log
* Make the session middleware do something
* Add middleware to deal with post data
* Design better templating engine
* Support more mime type for static file middleware
* Support URL parameters

### Authors

see [AUTHORS](AUTHORS).

# License

MIT
