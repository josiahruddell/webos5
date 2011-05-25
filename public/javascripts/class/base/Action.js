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
; !!window['JUI'] && (function ($N, $) {
    $N.Action = Class.extend({
        // functions
        init: function (config, data, isRestore) {
            $.extend(this, config);
            this.isRestore = isRestore;
            this.config = config;
            this.data = data;
            this._url = this.template + ' ' + this.templateNode;

            this.sandbox = desktop.sandbox.append('<div />');
            // build
            this.sandbox.load(this._url, $.proxy(this.build, this));
        },
        build: function () {
            this.$link = this.sandbox.find(this.templateNode).children();
            this.sandbox.remove();
            this.$link.getUID();
            this.$link.find('.content').replaceWith(this.text);

            this.append();

            this.bind();
        },
        append: function () { // virtual: this method is overridden in implementation
            console.log('base append')
            if (this.type == 'icon')
                desktop.menu.append(this.$link);

            // set data from object not element (find .content etc)
            // every set data can have it's own implementation. pull object from
            // windows[this.parentLink].setData()...
            if (this.type == 'button') {
                $(this.parentLink).find('.content').append(this.$link);
            }
        },
        bind: function () {
            for (var i = 0, t; t = this.throws[i]; i++) {
                // t.eventName
                this.$link.bind(t.on, $.proxy(function () {
                    if (this.throws.closeParent)
                        desktop.winManager.windows[$(this.action.parentLink).attr('id')].close();
                    $N.invokeElement(this.throws.invoke, this.action);
                    return false;
                }, { throws: t, action: this }));
            }
        },
        // properties
        template: '/ui/templates/action.htm', isRestore: false, throws: [],
        templateNode: '#icon-one', type: 'icon', event: 'click',
        invokes: '', animation: '', url: '', text: '', config: null, sandbox: null, parentLink: null
    });

})(JUI, jQuery);