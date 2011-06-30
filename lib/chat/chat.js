var chats = {}
  , chatSeed = 0
  , proxy = function(context, cb){ 
      return function() { cb.apply(context, arguments) }; 
    };
function ChatServer(server){
  this.server = server;
  this.server.on('connection', proxy(this, this.connection));
}

ChatServer.prototype = {
  connection: function(client){
    new ChatClient(client, this.server);
  }
};

function ChatClient(client, io){ // on io.connection new ChatClient
  this.client = client;
  this.io = io;
  // add callbacks
  client.on('message', proxy(this, this.message));
  client.on('disconnect', proxy(this, this.disconnect));
  
  // init
  var activeClients = [];
  for(var sessionId in this.io.clientsIndex){
      if (this.io.clientsIndex[sessionId] && (this.io.clientsIndex[sessionId] != this.client)) {
          activeClients.push({ from: { sessionId: sessionId },
              data: { name: this.io.clientsIndex[sessionId].username || 'unknown' }
          });
      }
  }
  this.client.send({ name: 'thisSessionOpened', type: 'event', users: activeClients });
}

ChatClient.prototype = {
  disconnect: function () {
      this.client.broadcast({ name: 'sessionClosed', type: 'event',
          from: { sessionId: this.client.sessionId }
      });
  },
  message: function(message){ // global message handler, delegates to another method\
    console.log(message);
    if(message && message.name)
      this[message.name].apply(this, arguments);
  },
  openSession: function(message){
    this.client.username = message.data.name;
    this.client.broadcast({ name: 'sessionOpened', type: 'event',
        from: { uid: message.from.uid, sessionId: this.client.sessionId },
        data: { name: this.client.username }
    });
  },
  closeSession: function(message){
    this.client.broadcast({ name: 'sessionClosed', type: 'event',
        from: { uid: message.from.uid, sessionId: this.client.sessionId }
    });
  },
  sendMessage: function(message){
    console.log('\tto sessionId: ' + message.to.sessionId, 'to uid: ' + message.to.uid);
    var toClient = this.io.clientsIndex[message.to.sessionId];
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
        from: { uid: message.from.uid, sessionId: this.client.sessionId, 
          username: message.from.username
        },
        to: message.to, data: { messageText: message.data.messageText }
    });
  }
};

module.exports = {
  ChatClient: ChatClient
  , ChatServer: ChatServer
  , chats: chats
  , chatSeed: chatSeed
};