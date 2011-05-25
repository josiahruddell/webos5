;!!window['JUI'] && (function ($N, $) {
    $N.MenuStrip = $N.Window.extend({
        // functions
        init: function (config, data, isRestore) {
            this._super(config, data, isRestore);
        },
        // for Strip data is an array of buttons
        getData: function () {
            console.log('impl get data');
            //TODO: pull programs from server
            var uid = '#' + this.$link.attr('id');
            return [{
                type: "Button",
                config: {
                    parentLink: uid,
                    //type: "button",
                    text: "",
                    templateNode: "#button",
                    throws: [{ name: "SketchClicked", closeParent: true, on: "click", invoke: { type: "Sketch", config: {}}}]
                }
            },
            {
                type: "Button",
                config: {
                    parentLink: uid,
                    //type: "button",
                    text: "",
                    templateNode: "#button",
                    throws: [{ name: "NotewriterClicked", closeParent: true, on: "click", invoke: { type: "NoteWriter", config: {}}}]
                }
            }];
        },
        config: {
            templateNode: '#strip', type: 'MenuStrip', w: 674, h: 158, x: 110, y: 1, orientX: 'right', leash: true,
            template: '/ui/templates/window.htm', parentLink: null,
            isRestore: false, fx: 'toggle', duration: 300
        }
    });
})(JUI, jQuery);