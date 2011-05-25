; !!window['JUI'] && (function ($N, $) {
    $N.File = $N.Window.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },
        getData: function () {
            
        },
        config: {
            templateNode: '#file', type: 'File',w: 1312, h: 584, x: 110, y: 1, leash: false,
            template: '/ui/templates/window.htm', parentLink: null,
            isRestore: false, fx: 'toggle', duration: 300
        }
    });

})(JUI, jQuery);