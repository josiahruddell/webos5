;!!window['JUI'] && (function ($N, $D, $) {
    $N.SocketSubscriber = Class.extend({
        // io.Socket is required
        init: function (config) { // constructor
            //$.extend(this.config, config);
            // if this.config.socketName in desktop.sockets (socket already exists, add subscriber)
            this.events = {};
            this.config = config;
            this.socket = $D.getSocket(this.config.socketName);
            this.socket.addSubscriber(this.config.subscriberId, this);
        },
        prepareMessage: function (messageName, message) { // i am sending a command
            message.name = messageName;
            message.type = 'command';
            message.from = { uid: this.config.subscriberId, sessionId: this.socket.sessionId, username: $D.user.username };
            console.log('socket subscriber sending "' + messageName + '" with ', message);
            return message;
        },
        send: function (messageName, message) {
            var msg = this.prepareMessage(messageName, message || {});
            this.socket.send(msg);
        },
        // happens when parent subscribed socket onmessage && sucriberId == this.config.subscriberId
        message: function (eventName, message) {
            // possible get context of event callback. this.events[eventName].call(this.subscriber, data);
            if (this.events[eventName])
                this.events[eventName](message); // run callback
        },
        on: function (eventName, callback) {
            this.events[eventName] = callback;
        },
        disconnect: function () {
            this.socket.removeSubscriber(this.config.subscriberId);
            this.socket.socket.disconnect();
        }
        //events: {}
        //        config: {
        //            socketName: '',
        //            subscriberId: '',
        //            subscribesTo: 'me'
        //        }
    });

})(JUI, $D, jQuery);