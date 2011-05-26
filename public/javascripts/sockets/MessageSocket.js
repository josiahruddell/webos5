var http = require('http')
  , io = require('socket.io')
  , server;
server = http.createServer(function (req, res) {
    // your normal server code
});

console.log('Loaded ' + process.argv[1] + ', server running at ' + process.argv[3] + ':' + process.argv[2]);

server.listen(process.argv[2], process.argv[3]);

var io = io.listen(server)
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
                data: { name: io.clientsIndex[sessionId].username }
            });

    client.send({ name: 'thisSessionOpened', type: 'event', users: activeClients });
});