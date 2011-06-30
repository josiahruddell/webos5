/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io'),
	cradle = require('cradle'),
	port = process.env.C9_PORT || 80;

cradle.setup({
	host: 'webos5.iriscouch.com',
	options: {
		cache: true,
		raw: false
	}
});
var userDb = new(cradle.Connection)().database('_users');
//if(!userDb.exists()) userDb.create();
//console.log('db info: ', userDb.all());
var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "session is on dude!"
	}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({
		src: __dirname + '/public'
	}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

// dynamic helpers
// action filter
function authenticate(req, res, next) {
	if (req.session.user) next();
	else res.redirect('/fblogin?next=' + req.url);
}

// Routes
app.get('/', authenticate, function(req, res) {
	res.render('index', {
		title: 'WebOS5 - a new interwebs',
		port: port,
		username: req.session.user.name || 'unknown user'
	});
});

app.get('/fblogin', function(req, res) {
	res.render('fblogin', {
		title: 'Login',
		layout: 'fblayout'
	});
});

app.get('/login', function(req, res) {
	res.render('login', {
		title: 'Login'
	});
});

app.get('/logout', function(req, res) {
	delete req.session.user;
	res.redirect('/fblogin');
});

app.post('/login', function(req, res) {
	var isValidUsr = true;
	req.session.user = req.body.user;
	if (isValidUsr) res.send({
		url: '/'
	});
});

app.get('/user/:id/config.:format?', function(req, res) {
	// configure installed apps here
	// this config needs to come frome user profile
	res.send({
		"elements": [{
			"type": "Icon",
			"config": {
				"type": "icon",
				"text": "Programs",
				"templateNode": "#icon-one",
				"throws": [{
					"name": "ProgramsClicked",
					"on": "click",
					"invoke": {
						"type": "MenuStrip",
						"config": {}
					}
				}]
			}
		},
		{
			"type": "Icon",
			"config": {
				"type": "icon",
				"text": "Notewriter",
				"templateNode": "#icon-three",
				"throws": [{
					"name": "NotewriterClicked",
					"on": "click",
					"invoke": {
						"type": "NoteWriter",
						"config": {}
					}
				}]
			}
		},
		{
			"type": "Icon",
			"config": {
				"type": "icon",
				"text": "People",
				"templateNode": "#icon-four",
				"throws": [{
					"name": "PeopleClicked",
					"on": "click",
					"invoke": {
						"type": "People",
						"config": {}
					}
				}]
			}
		}]
	});
});

app.listen(port);

console.log("Express server listening at %s:%d", app.address().address, app.address().port);

var chat = require('./lib/chat/chat.js'),
	io = io.listen(app),
	chatServer = new chat.ChatServer(io);
