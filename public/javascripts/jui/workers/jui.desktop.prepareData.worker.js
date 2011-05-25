var prepare = {
    WindowState: function (activeWindows) {
        // prepare array in order of lowest to highest for saving
        var data = [];
        var highest = 0, insert = 'push';
        // create array from kvs
        for (var win in activeWindows) {
            if (win == 'count') continue; // avoid custom count prop
            data[insert]({ invoke: 'Window', config: activeWindows[win].config });
        }
        //sort array
        data.sort(function (a, b) {
            if (a.css.zIndex < b.css.zIndex) {
                return -1;
            }
            if (a.css.zIndex > b.css.zIndex) {
                return 1;
            }
            if (a.css.zIndex == b.css.zIndex) {
                return 0;
            }
        });
        return data;
    }

};

onmessage = function (event) {
    debugger;
    var message = event.data;
    var data = prepare[message.table](message.data);
    postMessage(data);
}
//this.addEventListener('message', function (event) {
//    debugger;
//    var message = event.data;
//    var data = prepare[message.table](message.data);
//    this.postMessage(data);
//}, false);