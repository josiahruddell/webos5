;!!window['JUI'] && (function ($N, $) {
    $N.Sketch = $N.Window.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },
        getData: function () {

        },
        config: {
            templateNode: '#sketch', type: 'Sketch', w: 830, h: 771, x: 100, y: -10, orientX: 'left',
            template: '/ui/templates/window.htm', parentLink: null,
            isRestore: false, fx: 'toggle', duration: 300
        }
    });
})(JUI, jQuery);