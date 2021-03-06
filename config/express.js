var express = require('express');
var bodyParser = require('body-parser');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.config')
var development = require('./env/development')

module.exports = function(){
	console.log('init express..');
	var app = express();

	/*webpack*/
	var compiler = webpack(config)
	app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
	app.use(webpackHotMiddleware(compiler));

	app.set('view engine','ejs');
	app.use(express.static(__dirname+'/../views'));

	app.use(bodyParser.json());

	require('../app/routes/weather.server.routes')(app);

	require('../app/controllers/weather.server.controller');

	app.use(function(req, res, next){
		res.status(404);
		try{
			return res.json('No Found!');
		}
		catch(e){
			console.error('404 set header after send.');
		}
	})

	app.use(function(err, req, res, next){
		if (!err) {
			return next();
		};

		res.status(500);
		try{
			return res.json(err.message || "server err");
		}
		catch(e){
			console.error('500 set header after send.')
		}
	});

	return app;
};