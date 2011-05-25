/*!
 * Josiah Ruddell JUI JavaScript
 *
 * Copyright (c) 2009 Josiah Ruddell, http://josiahruddell.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Date: 03.19.2010
 */
var JUI = {
    // instantiator
    desktop: function (config) {
        this.config = config;
        this.sandbox.appendTo(document.body);
        this.mainPane = $(config.mainPane);
        this.menu = $(config.menu);
        //debugger;
        this.winManager = new JUI.WindowManager();
        this.debug = this.mainPane.append('<div class="debug" />').find('.debug').css({ background: '#fff', opacity: '.80', width: 200 });

        // init workers
        //        if (window.Worker) {
        //            this.windowStateWorker = new Worker('/Scripts/jui/workers/jui.desktop.prepareData.worker.js');
        //            this.windowStateWorker.onmessage = this.saveWindowState;
        //        }
        // init websocket
        //debugger;

    }
};
$.extend(JUI.desktop.prototype, {
    // -> load operations
    activate: function () {
        // :: sets JUI.config.[Element].[Type]
        JUI.setDefaultElementConfig();

        // loads desktop actions and icons, then restores state
        this.restore();

        // :: event listeners
        $(document).bind('selectstart', function () { return false; });

        // cancel event so that click doesnt process
        this.menu.sortable({ items: 'li' });



        // FIX THIS STUFF
        $('.action.invoke-window-open').click(function () {
            desktop.openWindow();
        });

        for (var socket in this.sockets)
            if (this.sockets.hasOwnProperty(socket))
                this.sockets[socket] = this.sockets[socket].activate();

        /*if (window.WebSocket)
        this.openWebSocket();*/
    },
    openWebSocket: function () {

        var ws = new WebSocket('ws://localhost:8181/consoleappsample');

        // when data is comming from the server, this metod is called
        ws.onmessage = function (evt) {
            //desktop.debug[0].innerHTML += evt.data + '<br/>';
            desktop.debug.append(evt.data);
            var message = new JUI.Window(JUI.config.Window.message, evt.data);
            //message.setData(evt.data);
        };

        // when the connection is established, this method is called
        ws.onopen = function () {
            desktop.debug.append('.. connection open<br/>');
        };

        // when the connection is closed, this method is called
        ws.onclose = function () {
            desktop.debug.append('.. connection closed<br/>');
        }
    },
    restore: function () {
        // restore config (userdefined desktop preferences)
        JUI.invokeElements(this.config.elements);
        // restore state
        var events = localStorage.getItem('WindowState'); //.toJSON();
        if (!events) return;
        try {
            events = JSON.parse(events);
        } catch (e) {
            events = [];
        }
        for (var i = 0, e; e = events[i]; i++) {
            JUI.playEvent(e, true);
        }
    },

    // -> interaction utility functions
    openWindow: function (winConfig) {
        var c = winConfig ? $.extend(winConfig, JUI.config.Window.file) : JUI.config.Window.file;
        var win = new JUI.Window(c);
    },
    registerSocket: function (name, callback) {
        // store callback by name at register
        this.sockets[name] = { activate: callback };
    },
    getSocket: function (name) {
        if (this.sockets.hasOwnProperty(name))
            return this.sockets[name];
        else throw new Error('Socket "' + name + '" does not exist.');
    },
    config: {},
    sockets: {},
    sandbox: $('<div id="sandbox" style="display:none" />'),
    winManager: null
});

// :: Statics
$.extend(JUI, {
    // obsolete
    invokeElements: function (els) {
        for (var i = 0, el; el = els[i]; i++) {
            JUI.invokeElement(el);
        }
    },
    // TODO: fix, invoke element is really an action click
    invokeElement: function (el, invoker, isRestore) {
        var c = $.extend({}, JUI.config[el.type], el.config);
        if (c.leash === true) {
            c.parentLink = '#' + invoker.$link.attr('id');
        }
        new JUI[el.type](c, c.data, isRestore);
    },
    // this is really a window
    playEvent: function (e, isRestore) {
        // extend event with default event config by type, play event
        var c = e.config;
        if (c.leash === true && e.invoker) {
            c.parentLink = '#' + invoker.$link.attr('id');
        }
        new JUI[e.invoke](c, e.data, isRestore);
    }
});

