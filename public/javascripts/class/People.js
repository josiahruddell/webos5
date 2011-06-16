;!!window['JUI'] && (function ($N, $) {
    $N.People = $N.Window.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
            $.template("peopleList", '<li data-uid="${from.uid}" data-sessionId="${from.sessionId}"><a href="javascript:;">${data.name}</a></li>'); // name is friendly name, uid is people hud uid, session is client.sessionId from node
            this.chats = {};

            var self = this;

            new $N.Socket({ // create the socket
                autoConnect: true,
                displayName: 'Message Socket',
                socketName: 'messageSocket',
                connect: function (client) {
                    // OK, so idk. should the constructor for the window that uses the socket create the socket?
                    // I think so, but this is just ugly, I have to create a socket, then subscribe to that socket 
                    // via globally added socket name. Then once it is connected send a message using the socket subscriber.
                    // 
                    // 1.) I am thinking a socket subscriber could also create the socket if non-existent 
                    // 2.) or change the socket subscriber at least to handle on connect, so connect is not through the parent socket
                    // also allow instead of SocketSub.config.socketName, just socket and do arg tests to see if it is string or 
                    // instance of $N.Socket
                    self.socket.send('openSession', { data: { name: $D.user.username} });
                    // cuz this is gay
                }
            });



            if (this.$link)
                this.peopleList = this.$link.find('.people-list');
            this.activeUsers = [];



        },

        getData: function () { },
        thisSessionOpened: function (users) {
            for (var i = 0; i < users.length; i++) {
                this.sessionOpened(users[i]);
            }
        },
        sessionOpened: function (user) { // another user connected
            if (!this.peopleList)
                this.peopleList = this.$link.find('.people-list');
            this.activeUsers.push(user);
            this.peopleList.html($.tmpl("peopleList", this.activeUsers));
        },
        sessionClosed: function (user) {
            this.activeUsers = $.grep(this.activeUsers, function (item, index) {
                return item.from.sessionId !== user.from.sessionId;
            });
            this.peopleList.find('li[data-sessionId="' + user.from.sessionId + '"]').remove()
        },
        messageReceived: function (message) { // incoming message is a new chat request
            console.log('People->messageReceived: ', message, 'chats: ', this.chats);
            if (!this.chats.hasOwnProperty(message.from.uid)) { // if i have not opend this window
                var chat = new $N.Message({}, '', false, message);
                this.chats[message.from.uid] = chat;
            }
            else { // use instance to relay the message
                this.chats[message.from.uid].onmessage(message);
            }
        },
        onOpen: function () {
            // 
            if (!this.peopleList)
                this.peopleList = this.$link.find('.people-list');

            this.socket = new $N.SocketSubscriber({
                socketName: 'messageSocket',
                subscriberId: this.uid,  // uid is defined after open.. possible change
                subscribesTo: 'everyone'
            });
            // bind socket
            var self = this;
            this.socket.on('thisSessionOpened', $.proxy(function (message) {
                self.thisSessionOpened(message.users);
            }, this));
            this.socket.on('messageReceived', $.proxy(this.messageReceived, this));
            this.socket.on('sessionOpened', $.proxy(this.sessionOpened, this));
            this.socket.on('sessionClosed', $.proxy(this.sessionClosed, this));
            // bind live user chat request click

            this.peopleList.delegate('li', 'click', function () { // initiate chat
                var sessionId = $(this).attr('data-sessionId'); // pulll from attr so string value is not converted to number
                console.log('People-> .people-list li:click', sessionId);
                var message = new $N.Message({}, '', false, {
                    from: { sessionId: sessionId }
                }); /*, null, null, {
                    onopen: function () {
                        self.chats[this.uid] = true;
                    }
                }); // right now I don't know what UID i am sending to.*/

            });

        },
        afterOpen: function () { // after animation finishes
            this.$link.find('.content-wrapper').append('<div class="init">Initializing...</div>');
            var $el = this.$link,
                h = this.config.h;
            this.$link.find('.collapse').click(function () {
                var toH = $el.hasClass('up') ? h : 48;
                $el.animate({ height: toH }).toggleClass('up');
                return false;
            });
            setTimeout($.proxy(function () {
                this.$link.find('.content').show().siblings('.init').remove();
            }, this), 100);
        },
        onClose: function () {
            //this.socket.send('closeSession');
            this.socket.disconnect();
        },
        // properties
        config: {
            w: 318, h: 425, type: 'People',
            templateNode: '#people', parentLink: null,
            template: '/ui/templates/window.htm',
            isRestore: false, fx: 'toggle', x: 100, y: 100, duration: 300,
            leash: false
        }
    });

})(JUI, jQuery);