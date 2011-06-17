(function ($) {
    $.getUID = function () { // '[uid]-[random]-[time]'
        return 'uid-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' + new Date().getTime();
    };
    $.fn.getUID = function () {
        if (!this.length) {
            return 0;
        }
        var fst = this.first(), id = fst.attr('id');
        if (!id) {
            id = $.getUID();
            fst.attr('id', id);
        }
        return id;
    };
    
    function resultProcessor(result){
      if(result.url)
        location.href = result.url;
    };
    
    $.fn.ajaxForm = function(){
      return this.each(function(){
        var el = $(this);
      
        el.bind('submit.ajaxForm', function(e){
          $.ajax({
            type: el.attr('method') || 'post',
            url: el.attr('action'),
            data: el.serialize(),
            success: resultProcessor
          });
          e.preventDefault();
        });
        var t = '';
        if(t = el.data('trigger'))
          $(t).click(function(e){ 
            el.triggerHandler('submit.ajaxForm'); 
            e.preventDefault();
        });
      });
    };
    
})(jQuery);

(function ($) { var a = $.ui.mouse.prototype._mouseMove; $.ui.mouse.prototype._mouseMove = function (b) { if ($.browser.msie && document.documentMode >= 9) { b.button = 1 }; a.apply(this, [b]); } } (jQuery));