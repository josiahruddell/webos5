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
    $N.Window = Class.extend({
        // :: constructor
        init: function (config, data, isRestore) {
            $.extend(this.config, config);
            this.data = data;
            this.config.isRestore = isRestore;
            //this.config = config;
            this.config._url = this.config.template + ' ' + this.config.templateNode;

            this.sandbox = desktop.sandbox.append('<div />');
            this.sandbox.load(this.config._url, $.proxy(this.build, this));
        },
        // :: functions
        build: function (t) {
            if (this.$link) return this.open();

            this.$link = this.sandbox.find(this.config.templateNode).children();
            if (this.$link.length == 0) alert('no template');
            this.uid = this.$link.getUID();
            this.sandbox.remove();
            //debugger;
            desktop.winManager.add(this);
            this.applyConfig();

            desktop.mainPane.append(this.$link);

            this._data = this.getData();

            if (this.data || this._data)
                this.setData(this.data || this._data);

            this.bind();
            if (open) this.open();
        },
        bind: function () {
            this.$link.bind('dblclick', $.proxy(this.close, this))
            this.$link.bind('mousedown', $.proxy(this.raise, this));
            this.$link.find('.close').bind('click', $.proxy(this.close, this))
            var c = this.$link.draggable().find('.content').find('.scroll-pane')
			if(!c.length) c = c.end();
			c.mousedown(function(e){ e.stopPropagation(); });
        },
        //Vurtual get data
        getData: function () { },
        setData: function (data) {
            // future
            // if data isarray
            // if data[0] instanceof Action
            // ... add win.$link for each in array.
            if ($.isArray(data))
                $N.invokeElements(data);
            else if (this.$link.length != 0)
                this.$link.find('.content').append(data);
        },
        applyConfig: function () {
            this.$link.css({ width: this.config.w, height: this.config.h });
        },
        open: function () {
            this.onOpen();
            this.$link[this.config.fx](this.config.duration, $.proxy(this.afterOpen, this));
        },
        raise: function () {
            this.onRaise();
            desktop.winManager.raise(this);
        },
        close: function () {
            this.onClose();
            desktop.winManager.remove(this);
            this.$link.draggable('destroy');
            this.$link[this.config.fx](this.config.duration, function () { $(this).unbind().remove(); })
            //this.$link.remove();
        },
        // :: Callbacks
        onOpen: function () { },
        afterOpen: function () { },
        onRaise: function () { },
        onClose: function () { },
        // :: Poperties
        data: null,
        css: {},
        sandbox: null,
        $link: '',
        uid: '',
        config: { // config is not extended by default in class.js so all these props must be set on the child class
            template: '/ui/templates/window.htm', parentLink: null,
            templateNode: ' #file', type: 'Window', _url: '', isRestore: false,
            fx: 'toggle', w: 500, h: 500, x: 100, y: 100, duration: 300,
            leash: false
        }
    });
})(JUI, jQuery);