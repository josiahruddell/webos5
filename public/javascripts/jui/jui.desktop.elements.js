if (typeof (JUI) != 'undefined') {
    // JUI core UI objects
    $.extend(JUI, {
        Window: function (config, data, isRestore) {//(template, w, h, x, y, anim) {
            $.extend(this, config);
            this.data = data;
            this.isRestore = isRestore;
            this.config = config;
            this._url = this.template + this.templateNode;
            //if (!config.manager) this.manager = new JUI.WindowManager();
            this.init();
        },
        Action: function (config, data, isRestore) {
            $.extend(this, config);
            this.isRestore = isRestore;
            this.config = config;
            this.data = data;
            this._url = this.template + this.templateNode;
            this.init();
        }
    });

    // :: JUI core UI objects properties, functions
    // :: Window :: //
    $.extend(JUI.Window.prototype, {
        template: '/ui/templates/window.htm', config: null,
        templateNode: ' #file', type: 'file', _url: '', isRestore: false, parentLink: null,
        fx: 'toggle', w: 500, h: 500, x: 100, y: 100, duration: 300, css: {}, sandbox: null,
        /*manager: null,*/$link: '', leash: false,
        init: function () {
            this.sandbox = desktop.sandbox.append('<div />');
            this.sandbox.load(this._url, $.proxy(this.build, this));
        },
        build: function (t) {
            if (this.$link) return this.open();

            this.$link = this.sandbox.find(this.templateNode).children();
            if (this.$link.length == 0) alert('no template');

            this.sandbox.remove();

            desktop.winManager.add(this);
            this.applyConfig();

            desktop.mainPane.append(this.$link);

            // TODO: FIX!!
            // move window to base this implementation goes into Strip.js
            if (this.type == 'strip') { // strip is list of available programs
                var uid = '#' + this.$link.attr('id');
                this.data = [{
                    type: "Action",
                    config: {
                        parentLink: uid,
                        type: "button",
                        text: "",
                        templateNode: " #button",
                        throws: [
                            { name: "SketchClicked", closeParent: true, on: "click", invoke: { type: "Window", config: { type: "sketch"}} }
                        ]
                    }
                },
                {
                    type: "Action",
                    config: {
                        parentLink: uid,
                        type: "button",
                        text: "",
                        templateNode: " #button",
                        throws: [
                            { name: "NotewriterClicked", closeParent: true, on: "click", invoke: { type: "Window", config: { type: "notewriter"}} }
                        ]
                    }
                }];
            }
            if (this.data)
                this.setData(this.data);

            this.bind();
            if (open) this.open();
        },
        bind: function () {
            this.$link.bind('dblclick', $.proxy(this.close, this))
            this.$link.bind('mousedown', $.proxy(this.raise, this));
            this.$link.find('.close').bind('click', $.proxy(this.close, this))
            this.$link.draggable();
        },
        setData: function (data) {
            // future
            // if data isarray
            // if data[0] instanceof Action
            // ... add win.$link for each in array.
            if ($.isArray(data))
                JUI.invokeElements(data);
            else if (this.$link.length != 0)
                this.$link.find('.content').append(data);
        },
        applyConfig: function () {
            this.$link.css({ width: this.w, height: this.h });
        },
        open: function () {
            this.$link[this.fx](this.duration);
        },
        raise: function () {
            desktop.winManager.raise(this);
        },
        close: function () {
            desktop.winManager.remove(this);
            this.$link.draggable('destroy');
            this.$link[this.fx](this.duration, function () { $(this).unbind().remove(); })
            //this.$link.remove();
        }

    });
    // :: Action :: //
    $.extend(JUI.Action.prototype, {
        template: '/ui/templates/action.htm', isRestore: false,
        templateNode: ' #icon-one', type: 'icon', event: 'click', // type derrives behavior
        invokes: '', animation: '', url: '', text: '', config: null, sandbox: null, parentLink: null,
        init: function () {
            this.sandbox = desktop.sandbox.append('<div />');
            this.sandbox.load(this._url, $.proxy(this.build, this));
        },
        build: function () {
            this.$link = this.sandbox.find(this.templateNode).children();
            this.sandbox.remove();
            this.$link.getUID();
            this.$link.find('.content').replaceWith(this.text);
            if (this.type == 'icon')
                desktop.menu.append(this.$link);

            // set data from object not element (find .content etc)
            // every set data can have it's own implementation. pull object from
            // windows[this.parentLink].setData()...
            if (this.type == 'button') {
                $(this.parentLink).find('.content').append(this.$link);
            }

            this.bind();
        },
        bind: function () {
            var self = this;
            for (var i = 0, t; t = this.throws[i]; i++) {
                // t.eventName
                this.$link.bind(t.on, $.proxy(function () {
                    if (this.throws.closeParent)
                        desktop.winManager.windows[$(this.action.parentLink).attr('id')].close();
                    JUI.invokeElement(this.throws.invoke, this.action);
                    return false;
                }, { throws: t, action: this }));
            }
        }
    });
}