'use strict';
var   app = require('express')(),
        Waterline = require('waterline'),
        diskAdapter = require('sails-disk'),
        bodyParser = require('body-parser'),
        port = 7772;

var orm = new Waterline();

var win = process.platform === "win32";
var home = win ? process.env.USERPROFILE : process.env.HOME;

var config = {
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter
  },
  connections: {
      'learn-memory': {
          adapter: 'disk',
          filePath: home + '/'
      }
  },
  defaults: {
    migrate: 'alter'
  }
};

var Lesson = Waterline.Collection.extend({

  identity: 'lesson',
  connection: 'learn-memory',

  attributes: {
     content: 'string',
     substance: 'string'
  }
});

orm.loadCollection(Lesson);

app.use(bodyParser.json());


app.get('/api', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.status(500).json({ err : err});
    // Don't download useless data
    models.forEach(function(item){
        item.content = item.content
        .replace(new RegExp('&#39;', 'gi'), '\'')
        .replace(new RegExp('\n', 'gi'), ' ')
        .replace(new RegExp('<.[^>]*>', 'gi' ), '')
        .replace(new RegExp('&quot;', 'gi'), '"');
        item.content = item.content.substring(0,100);
        delete item.createdAt;
    });
    res.json(models);
  });
});

app.get('/api/long', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.status(500).json({ err : err});
    // Don't download useless data
    models.forEach(function(item){
        item.content = item.content
        .replace(new RegExp('&#39;', 'gi'), '\'')
        .replace(new RegExp('\n', 'gi'), ' ')
        .replace(new RegExp('<.[^>]*>', 'gi' ), '')
        .replace(new RegExp('&quot;', 'gi'), '"');
    });
    res.json(models);
  });
});

app.get('/api/:id', function(req, res) {
  app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.status(500).json({ err : err});
    if(model === '' || model === null) return res.status(404).json({ err: 404 });
    res.json(model);
  });
});

app.delete('/api/:id', function(req, res) {
  app.models.lesson.destroy({ id: req.params.id }, function(err) {
    if(err) return res.status(500).json({err: err})
    res.json({ status: 'ok' });
  });
});

app.put('/api/:id', function(req, res) {
  delete req.body.id;

  app.models.lesson.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.status(500).json({err: err})
    res.json(model);
  });
});

orm.initialize(config, function(err, models) {
  if(err) throw err;
  app.models = models.collections;
  app.connections = models.connections;
  app.listen(port);
});