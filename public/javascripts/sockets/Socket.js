;!!window['JUI'] && (function ($N, $D, $) {

    //    $D.registerSocket('messageSocket', function () {
    //        return new $N.Socket({
    //            autoConnect: true,
    //            displayName: 'Message Socket',
    //            connect: function () {
    //                this.socket.on('messageRequest', function () {
    //                    //var message = new $N.Message({});
    //                });
    //            }
    //        });
    //    });

    $N.Socket = Class.extend({ // possible rename to window socket 
        init: function (config) { // constructor
            $.extend(this.config, config);
            // require('io' in window');
            // need to do some checking here for already in use sockets.
            this.socket = new io.Socket(this.config.hostName, {
                port: this.config.port,
                rememberTransport: this.config.rememberTransport
            });
            if (this.config.autoConnect && this.socket) {
                var self = this;
                this.socket.on('connect', function () {
                    $D.debug.append(self.config.displayName + ' Connected<br />');
                    self.config.connect && self.config.connect.call(self);
                });
                this.socket.on('message', $.proxy(this.message, this));
                this.socket.on('disconnect', function () { $D.debug.append(self.config.displayName + ' Disconnected<br />'); });
                this.socket.on('reconnect', function () { $D.debug.append(self.config.displayName + ' Reconnected<br />'); });
                this.socket.on('reconnecting', function (nextRetry) { $D.debug.append(self.config.displayName + ' Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms') });
                this.socket.on('reconnect_failed', function () { $D.debug.append(self.config.displayName +  ' Reconnected to server FAILED.') });
                this.socket.connect();
            }
            $D.sockets[this.config.socketName] = this;
        },
        addSubscriber: function (uid, subscriber) {
            if (subscriber instanceof $N.SocketSubscriber) // validate
                this.subscribers[uid] = subscriber;
        },
        removeSubscriber: function (uid) {
            if(this.subscribers.hasOwnProperty(uid))
                delete this.subscribers[uid];
        },
        send: function (obj) {
            this.socket.send(obj);
        },
        message: function (message) { // if no `to`, message to loop all subscribers
            if (message.hasOwnProperty('name')) {
                var subscriber = message.to && message.to.uid ? this.subscribers[message.to.uid] : null;
                if (subscriber)
                    subscriber.message(message.name, message);
                else
                    for (var sub in this.subscribers) {
                        if (this.subscribers[sub].config.subscribesTo == 'everyone')
                            this.subscribers[sub].message(message.name, message);
                    }
            }
        },
        on: function (event, callback) { // implement for use without 
            // if this.uid && event.uid == this.uid
        },
        subscribers: {},
        config: {
            port: 80,             // OOPS! need to learn port from worker role
            // maybe send from server config. $D.config.namedSocketPort[config.name]
            // OR! look into proxy to use paths instead of ports, like: path = '/socketio/messagesocket'
            socketName: '',
            hostName: location.hostname,
            rememberTransport: false,
            displayName: 'Socket',
            autoConnect: false,
            connect: null // callback
        }
    });

})(JUI, $D, jQuery);