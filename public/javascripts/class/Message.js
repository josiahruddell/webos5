;!!window['JUI'] && (function ($N, $D, $) {
    // registered sockets are activated on desktop->activate, prior to desktop->restore
    // this is not right. The friends application should activate this socket and create message windows.

    $N.Message = $N.Window.extend({
        // functions
        init: function (config, data, isRestore, message) { // constructor
            this._super(config, null, isRestore);
            this.to = {};
            if (message) {
                this.initMessage = message;
                if (message.from !== undefined)
                    this.to = this.initMessage.to = message.from;
                if (message.chatId !== undefined)
                    this.chatId = message.chatId;
            }
        },
        onOpen: function () {
            //if (this.callbacks.onopen) this.callbacks.onopen.call(this);
            // subscribe to socket
            this.socket = new $N.SocketSubscriber({
                socketName: 'messageSocket',
                subscriberId: this.uid
            });

            this.socket.on('messageReceived', $.proxy(this.onmessage, this));

            var self = this;
            this.sendBox = this.$link.find('.send').keypress(function (e) {
                if (e.which == 13)
                    self.send(e);
            });
            this.content = this.$link.find('.content');
            //if (this.data) this.message({ from: this.to, data: { messageText: this.data} });
        },
        afterOpen: function () {
            if (this.initMessage && this.initMessage.data) this.onmessage(this.initMessage);
            this.sendBox.focus();
        },
        onmessage: function (message) {
            // if message comes in with chat Id assign it to this config chat id
            console.log('Message->onmessage: ', message);
            if (this.chatId === undefined && message.chatId !== undefined) this.chatId = message.chatId;
            if (this.to.uid === undefined && message.from.uid !== undefined) this.to.uid = message.from.uid; // obviously this only works with 1 on 1 chat
            this.message(message);
        },
        message: function (message) { // fix to uid when available
            this.raise();
            console.log('Message->message', message);
            var content = $('<div />');
            content.html('<i>' + esc(message.from.username) + ':</i> ' + esc(message.data.messageText));
            this.content.append(content).scrollTop(100 * 100);
        },
        send: function (e) {
            var $this = $(e.target),
                val = $this.val();
            this.socket.send('sendMessage', { chatId: this.chatId, to: this.to, data: { messageText: val} });
            this.message({ from: { username: 'You' }, data: { messageText: val} });
            $this.val('');
        },
        getData: function () {

        },
        config: {
            templateNode: '#message', type: 'Message', w: 623, h: 159, x: 300, y: 50, orientX: 'right', fx: 'slideToggle', duration: 150,
            template: '/ui/templates/window.htm', parentLink: null,
            isRestore: false
        }
    });
    function esc(msg) {
        if(msg) {
            msg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return msg.replace(exp,"<a href='$1'>$1</a>");
        }
        return msg;
    };

})(JUI, $D, jQuery);