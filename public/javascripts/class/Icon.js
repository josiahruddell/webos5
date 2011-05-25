; !!window['JUI'] && (function ($N, $) {
    $N.Icon = $N.Action.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },
        append: function () {
            desktop.menu.append(this.$link);
        },
        templateNode: '#icon-one', w: 200, h: 100, type: 'Icon'
    });

})(JUI, jQuery);