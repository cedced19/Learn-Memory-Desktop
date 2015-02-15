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
     substance: 'string',
     markdown: 'string'
  }
});

orm.loadCollection(Lesson);

app.use(bodyParser.json());

app.get('/api', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.json({ err: err }, 500);
    // Don't download useless data
    for (var key in models){
        models[key].content = models[key].content
        .replace(new RegExp('&#39;', 'gi'), '\'')
        .replace(new RegExp('\n', 'gi'), ' ')
        .replace(new RegExp('<.[^>]*>', 'gi' ), '')
        .replace(new RegExp('&quot;', 'gi'), '"');
        delete models[key].markdown;
    }
    res.json(models);
  });
});

app.post('/api', function(req, res) {
  app.models.lesson.create(req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

app.get('/api/:id', function(req, res) {
  app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

app.delete('/api/:id', function(req, res) {
  app.models.lesson.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

app.put('/api/:id', function(req, res) {
  delete req.body.id;

  app.models.lesson.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

orm.initialize(config, function(err, models) {
  if(err) throw err;
  app.models = models.collections;
  app.connections = models.connections;
  app.listen(port);
});