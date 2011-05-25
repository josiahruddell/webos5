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
    $N.WindowManager = Class.extend({
        init: function () {
            this.reset();
        },
        windowChanged: function () {
            var data = [];
            // TODO: revisit, fix the css
            // translate from kvs to table
            //debugger;
            for (var win in this.windows) {
                if (win == 'count') continue; // avoid custom count prop
                data.push({ invoke: this.windows[win].config.type, config: this.windows[win].config, css: this.windows[win].css, data: this.windows[win].data });
            }

            //sort array by zindex for ordered load
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
            if (!this.nextX[win.config.type]) {
                this.nextX[win.config.type] = (win.config.x || this.x);
                this.nextY[win.config.type] = (win.config.y || this.y);
            }
            this.apply(win);
            this.windows.count++;
            this.windows[win.uid] = win;
            if (!win.config.isRestore)
                this.windowChanged();
        },
        remove: function (win) {
            this.windows.count--;
            delete this.windows[win.uid];
            if (this.windows.count == 0)
                this.reset();

            this.windowChanged();
        },
        apply: function (win) { // sets css
            var css = {};
            if (win.config.leash && $(win.config.parentLink).length) {
                // offset to window parent (leash)
                var o = $(win.config.parentLink).offset();
                css[win.config.orientX || this.orientX] = win.config.x; //o.left + win.x;
                css[win.config.orientY || this.orientY] = o.top + win.config.y;
            }
            else {
                css[win.config.orientX || this.orientX] = (this.nextX[win.config.type] += this.increment);
                css[win.config.orientY || this.orientY] = (this.nextY[win.config.type] += this.increment);
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
        },
        // :: Props
        x: 100, y: 100, z: 1000, increment: 20, orientX: 'left', orientY: 'top', localTable: 'WindowState',
        nextX: {}, nextY: {}, nextZ: 0, // z is global per manager, x and y vary by type
        windows: { count: 0} // kvp uid: window
    });
})(JUI, jQuery);