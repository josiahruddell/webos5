if (typeof (JUI) != 'undefined') {
    // JUI core UI objects
    // :: Constructors
    $.extend(JUI, {
        WindowManager: function (config) {//(template, w, h, x, y, anim) {
            $.extend(this, config);
            this.reset();
        }
    });

    // :: JUI core UI objects properties, functions
    // :: Window :: //
    $.extend(JUI.WindowManager.prototype, {
        x: 100, y: 100, z: 1000, increment: 20, orientX: 'left', orientY: 'top', localTable: 'WindowState',
        nextX: {}, nextY: {}, nextZ: 0, // z is global per manager, x and y vary by type
        windows: { count: 0 }, // kvp uid: window
        windowChanged: function () {
            var data = [];
            // TODO: revisit, fix the css
            // translate from kvs to table
            for (var win in this.windows) {
                if (win == 'count') continue; // avoid custom count prop
                data.push({ invoke: 'Window', config: this.windows[win].config, css: this.windows[win].css, data: this.windows[win].data });
            }

            //sort array
            data = data.sort(function (a, b) {
                if (a.css.zIndex < b.css.zIndex)
                    return -1;
                else if (a.css.zIndex > b.css.zIndex)
                    return 1;

                return 0;
            });

            // save to local storage
            localStorage.setItem(this.localTable, JSON.stringify(data))
            delete data;
        },
        add: function (win) { // adds uid, and windows kvp
            if (!this.nextX[win.type]) {
                this.nextX[win.type] = (win.x || this.x);
                this.nextY[win.type] = (win.y || this.y);
            }
            this.apply(win);
            this.windows.count++;
            this.windows[win.$link.getUID()] = win;
            if (!win.isRestore)
                this.windowChanged();
        },
        remove: function (win) {
            this.windows.count--;
            delete this.windows[win.$link.getUID()];
            if (this.windows.count == 0)
                this.reset();

            this.windowChanged();
        },
        apply: function (win) { // sets css
            var css = {};
            if (win.leash && $(win.parentLink).length) {
                // offset to window parent (leash)
                var o = $(win.parentLink).offset();
                css[win.orientX || this.orientX] = win.x; //o.left + win.x;
                css[win.orientY || this.orientY] = o.top + win.y;
            }
            else {
                css[win.orientX || this.orientX] = (this.nextX[win.type] += this.increment);
                css[win.orientY || this.orientY] = (this.nextY[win.type] += this.increment);
            }

            css['zIndex'] = (this.nextZ += this.increment);
            win.$link.css(css);
            // save positioning in instance
            win.css = css;
        },
        reset: function () {
            this.nextX = {};
            this.nextY = {};
            this.nextZ = this.z;
        },
        raise: function (win) {
            if (win.$link.css('zIndex') != this.nextZ)
                win.$link.css({ 'zIndex': (this.nextZ += this.increment) });

            win.css.zIndex = this.nextZ;
            this.windowChanged();
        }

    });
}