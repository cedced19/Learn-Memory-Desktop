'use strict';
var app = require('./node_modules/express')(),
    Waterline = require('./node_modules/waterline'),
    diskAdapter = require('./node_modules/sails-disk'),
    bodyParser = require('./node_modules/body-parser'),
    path =require('path'),
    dir = path.dirname(process.execPath) + '/',
    port = 7772;

var orm = new Waterline();


var config = {
    adapters: {
        'default': diskAdapter,
        disk: diskAdapter
    },
    connections: {
        save: {
            adapter: 'disk',
            filePath: dir
        },
    },
    defaults: {
        migrate: 'alter'
    }
};

var Lesson = Waterline.Collection.extend({
    identity: 'lesson',
    connection: 'save',

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
            item.keywords = item.content
                    .replace(/&#39;/gi, '\'')
                    .replace(/\n/gi, ' ')
                    .replace(/<.[^>]*>/gi, '')
                    .replace(/&quot/gi, '"')
                    .substring(0, 100);
            delete item.createdAt;
            delete item.content;
        });
        res.json(models);
    });
});

app.get('/api/long', function(req, res) {
    app.models.lesson.find().exec(function(err, models) {
        if(err) return res.status(500).json({ err : err});
        // Don't download useless data
        models.forEach(function(item){
            item.keywords = item.content
                    .replace(/&#39;/gi, '\'')
                    .replace(/\n/gi, ' ')
                    .replace(/<.[^>]*>/gi, '')
                    .replace(/&quot/gi, '"')
                    .substring(0, 100);
        });
        res.json(models);
    });
});

app.get('/api/:id', function(req, res) {
    app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
        if(err) return res.status(500).json({ err : err});
        if(model === '' || model === null || model === undefined) return res.status(404).json({ err: 404 });
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

app.post('/api', function(req, res) {
    app.models.lesson.create(req.body, function(err, model) {
        if(err) return res.status(500).json({ err : err});
        res.json(model);
    });
});

orm.initialize(config, function(err, models) {
    if(err) throw err;
    app.models = models.collections;
    app.connections = models.connections;
    app.listen(port);
});
