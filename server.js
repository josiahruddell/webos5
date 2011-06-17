/**
 * Module dependencies.
 */

var express = require('express')
    , io = require('socket.io')
    , cradle = require('cradle')
	, port = process.env.C9_PORT || 80
    ;
	
	cradle.setup({host: 'webos5.iriscouch.com', options: {cache: true, raw: false}});
	var userDb = new (cradle.Connection)().database('_users');
	//if(!userDb.exists()) userDb.create();
	//console.log('db info: ', userDb.all());
	
var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.cookieParser());
    app.use(express.session({ secret: "session is on dude!" }));
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
function authenticate(req, res, next){
  if(req.session.user) next();
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
	res.render('login', { title: 'Login' });
});

app.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('/fblogin');
});

app.post('/login', function(req, res) {
	var isValidUsr = true;
	req.session.user = req.body.user;
	if(isValidUsr)
	  res.send({ url: '/' });
});

app.get('/user/:id/config.:format?', function(req, res) {
	res.send({"elements":[{"type":"Icon","config":{"type":"icon","text":"Programs","templateNode":"#icon-one","throws":[{"name":"ProgramsClicked","on":"click","invoke":{"type":"MenuStrip","config":{}}}]}},{"type":"Icon","config":{"type":"icon","text":"Notewriter","templateNode":"#icon-three","throws":[{"name":"NotewriterClicked","on":"click","invoke":{"type":"NoteWriter","config":{}}}]}},{"type":"Icon","config":{"type":"icon","text":"People","templateNode":"#icon-four","throws":[{"name":"PeopleClicked","on":"click","invoke":{"type":"People","config":{}}}]}}]});
});

app.listen(port);

console.log("Express server listening at %s:%d", app.address().address, app.address().port);

// pull out into chat.js

var io = io.listen(app)
  , chats = {}
  , chatSeed = 0
  ;

io.on('connection', function (client) {
    client.on('message', function (message) { // everything coming to the server is a command
        console.log('-- new message --');
        switch (message.name) {                                                     // ABSTRACT THIS SWITCH INTO EVENTED SOCKET
            case 'openSession':
                client.username = message.data.name;
                client.broadcast({ name: 'sessionOpened', type: 'event',
                    from: { uid: message.from.uid, sessionId: client.sessionId },
                    data: { name: client.username }
                });
                break;
            case 'closeSession':
                client.broadcast({ name: 'sessionClosed', type: 'event',
                    from: { uid: message.from.uid, sessionId: client.sessionId }
                });
                break;
            case 'sendMessage':
                console.log('\tto sessionId: ' + message.to.sessionId, 'to uid: ' + message.to.uid);
                var toClient = io.clientsIndex[message.to.sessionId];
                console.log('\tfound client: ' + !!toClient);
                if (!toClient) return;
                var thisChatId = message.chatId;
                // normalize missing fields on the message (fill in the blanks) [chatid, uid]
                console.log('\tchatId: ' + thisChatId);
                if (!thisChatId) { // if there is no chatId. This is a new chat, or an unanswered message.
                    for (var chatId in chats)
                        if (chats[chatId][message.from.uid] == message.to.sessionId) {
                            thisChatId = chatId;
                            console.log('\tfount chatId: ' + chatId);
                            break;
                        }

                    if (!thisChatId) { // there is still no chat for this uid. create a new chat
                        thisChatId = ++chatSeed;
                        chats[thisChatId] = {};
                        chats[thisChatId][message.from.uid] = message.to.sessionId;
                        console.log('\tassigned new chatId: ' + thisChatId);
                    }
                }

                toClient.send({ name: 'messageReceived', type: 'event', chatId: thisChatId,
                    from: {
                        uid: message.from.uid,
                        sessionId: client.sessionId,
                        username: message.from.username
                    },
                    to: message.to,
                    data: {
                        messageText: message.data.messageText
                    }
                });
                break;
        }
    });

    client.on('disconnect', function () {
        client.broadcast({ name: 'sessionClosed', type: 'event',
            from: { sessionId: client.sessionId }
        });
    });
    // when a client connects
    var activeClients = [];
    for(var sessionId in io.clientsIndex)
        if (io.clientsIndex[sessionId] && io.clientsIndex[sessionId] != client)
            activeClients.push({ 
                from: { sessionId: sessionId },
                data: { name: io.clientsIndex[sessionId].username || 'unknown' }
            });
	console.log('\tconnected sending:', activeClients);
    client.send({ name: 'thisSessionOpened', type: 'event', users: activeClients });
});
