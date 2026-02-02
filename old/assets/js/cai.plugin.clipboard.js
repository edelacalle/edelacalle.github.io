
;(function($) {
    $.clipboard = function(element, options) {
        var defaults = {
            value: null
        }
        
        var plugin = this;
        plugin.settings = {}
        var $element = $(element), element = element;
        var $eCopy = $element.find('#id_copy');    


        plugin.init = function() {
            
            plugin.settings = $.extend({}, defaults, options);
            plugin.settings.value = $($element.data("orig")).val();
            plugin.settings.methods = {copy:plugin.copy,test:plugin.test};
            
            $eCopy.html(
                $('<label/>')
                .addClass('input-group-text')
                .attr("onclick","$(this).parent().parent().clipboard('copy')")
                .append('<i class="bi bi-clipboard-data"/>')
            );


        }

        plugin.copy = () =>  {
            navigator.clipboard.writeText(this.settings.value).then(function() {
                $eCopy
                .attr('title', "copiado")
                .tooltip('show');
                setTimeout(function() {
                    $eCopy.tooltip('dispose');
                }, 1000);
            });
        }

        plugin.paste = (sel) =>  {
            navigator.clipboard.readText().then(function(data) {
                //$eCopy
               // .attr('title', "copiado")
               // .tooltip('show');
               // setTimeout(function() {
               //     $eCopy.tooltip('dispose');
               // }, 1000);
               $(sel).val(data);
            });
        }
        
        // a private method. for demonstration purposes only - remove it!
        //var foo_private_method = function() {
            // code goes here
        //}

        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.clipboard = function(options) {
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            if (undefined == $(this).data('clipboard')) {
                var plugin = new $.clipboard(this, options);
                $(this).data('clipboard', plugin);
            }else{
                var plugin = $(this).data('clipboard');
            }

            if(plugin.settings.methods[options]){
              // var pp = plugin.settings.methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
              // console.log('esto que es ' , Array.prototype.slice.call(arguments, 1))
               //plugin.settings.methods[options].call(this, Array.prototype.slice.call(arguments, 1));
               plugin.settings.methods[options].call();
            }
        });
    }
})(jQuery);




