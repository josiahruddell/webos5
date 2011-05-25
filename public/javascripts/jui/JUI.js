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
// :: Statics
var JUI = {
    // obsolete
    invokeElements: function (els) {
        for (var i = 0, el; el = els[i]; i++) {
            JUI.invokeElement(el);
        }
    },
    // TODO: fix, invoke element is really an action click
    invokeElement: function (el, invoker, isRestore) {
        var c = el.config;
        // backwards compatibility
        // TODO: refactor actions so this is not nec
        var leash = JUI[el.type].prototype.config ? JUI[el.type].prototype.config.leash : JUI[el.type].prototype.leash;
        if (leash === true) {
            c.parentLink = '#' + invoker.$link.attr('id');
        }
        new JUI[el.type](c, c.data, isRestore);
    },
    // this is really a window
    //TODO: Add event handlers to invoke events by name
    playEvent: function (e, isRestore) {
        // extend event with default event config by type, play event
        var c = e.config;
        if (c.leash === true && e.invoker) {
            c.parentLink = '#' + invoker.$link.attr('id');
        }
        new JUI[e.invoke](c, e.data, isRestore);
    }
};