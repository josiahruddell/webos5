; !!window['JUI'] && (function ($N, $) {
    $N.Button = $N.Action.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },
        append: function () {
            // set data from object not element (find .content etc)
            // every set data can have it's own implementation. pull object from
            // windows[this.parentLink].setData()...
            $(this.parentLink).find('.content').append(this.$link);
        },
        templateNode: '#button', w: 200, h: 100, type: 'Button'
    });
})(JUI, jQuery);