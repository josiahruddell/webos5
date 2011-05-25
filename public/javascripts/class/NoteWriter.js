;!!window['JUI'] && (function ($N, $) {
    $N.NoteWriter = $N.Window.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },

        getData: function () {

        },
        config: {
            templateNode: '#notewriter', type: 'NoteWriter', w: 719, h: 772, x: 10, y: -10, orientX: 'left',
            template: '/ui/templates/window.htm', parentLink: null,
            isRestore: false, fx: 'toggle', duration: 300
        }
    });
})(JUI, jQuery);