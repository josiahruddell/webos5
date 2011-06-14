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
    $(function () {
        // :: load config from server or local
        // :: by this step the user is already authenticated
        $.ajax({
            url: $('#UserConfig').attr('href'),
            type: 'GET',
            dataType: 'json',
            success: function (config) {
                // activate the desktop
                // TODO: make loader gather username.
                desktop.port = $('#port').val()*1;
                desktop.activate(config);
                
            }
        });
    });
})(JUI, jQuery);