/*!
* Josiah Ruddell JUI JavaScript
*
* Copyright (c) 2010 Josiah Ruddell, http://josiahruddell.com/
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
* Date: 11.19.2010
*/
;!!window['JUI'] && (function ($N, $) {
    $N.Desktop = Class.extend({
        // :: constructor
        init: function () {
            this.winManager = new $N.WindowManager();
        },
        // :: functions
        activate: function (config) { // after window loads
            this.config = config;
            // local cache
            this.sandbox.appendTo(document.body);
            this.mainPane = $(this.mainPane);
            this.menu = $(this.menu);
            this.debug = this.mainPane.append('<div class="debug" />').find('.debug').css({ background: '#fff', opacity: '.80', width: 200 });
            // :: sets JUI.config.[Element].[Type]
            $N.setDefaultElementConfig();

            // run registered sockets before restoring desktop
            for (var socket in this.sockets)
                if (this.sockets.hasOwnProperty(socket))
                    this.sockets[socket] = this.sockets[socket].activate();


            // :: save locally every 10s
            // loads desktop actions and icons, then restores state
            this.restore();

            // :: event listeners
            $(document).bind('selectstart', function () { return false; });

            // todo: cancel event so that click doesnt process
            this.menu.sortable({ items: 'li' });
            this.activated = true;
        },
        restore: function () {
            // restore config (userdefined desktop preferences)
            $N.invokeElements(this.config.elements);
            // restore state
            var events = localStorage.getItem('WindowState'); //.toJSON();
            if (!events) return;
            try {
                events = JSON.parse(events);
            } catch (e) {
                events = [];
            }
            for (var i = 0, e; e = events[i]; i++) {
                $N.playEvent(e, true);
            }
        },

        // -> interaction utility functions
        openWindow: function (winConfig) {
            var c = winConfig ? $.extend(winConfig, $N.config.Window.file) : $N.config.Window.file;
            var win = new $N.Window(c);
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
        activated: false,

        user: {
            _username: '',
            get username(){
                return this._username || $('#username').val() || 'unknown user';
            },
            set username(val){
                this._username = val;
            }
        },
        config: {},
        sockets: {},
        sandbox: $('<div id="sandbox" style="display:none" />'),
        mainPane: 'div#desktop',
        menu: 'ul#menu',
        stateEvents: [],
        winManager: null

    });
    // for other file dependencies instantiate the global desktop instance early. 
    // activate later.
    window.Desktop = window.desktop = window.$D = new $N.Desktop();
})(JUI, jQuery);
