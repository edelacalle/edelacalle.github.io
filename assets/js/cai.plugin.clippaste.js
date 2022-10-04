;(function($) {
    $.clippaste = function(element, options) {
        var defaults = {
            orig: ""
        }
        
        var plugin = this;
        plugin.settings = {}
        var $element = $(element), element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.settings.orig = $element.data('orig')
//            plugin.settings.value = $($element.data("orig")).val();
            plugin.settings.methods = {paste:plugin.paste};

            $element.html('<label onclick="$(this).parent().clippaste(\'paste\')"  class="input-group-text" > <i class="bi bi-clipboard"></i></label>');



            /*
            <label  onclick="pasteClipboard('#id_index2 #id_prvK')"  class="input-group-text" >
            <i class="bi bi-clipboard"></i>
        </label>
        */

            /*
            
            $eCopy.html(
                $('<label/>')
                .addClass('input-group-text')
                .attr("onclick","$(this).parent().parent().clipboard('copy')")
                .append('<i class="bi bi-clipboard-data"/>')
            );
            */


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
            console.log("paste", sel, plugin.settings);
            navigator.clipboard.readText().then(function(data) {
                console.log("pego ", data);
                $(plugin.settings.orig).val(data);


                $element
                 .attr('title', "pegado")
                 .tooltip('show');
                 setTimeout(function() {
                     $element.tooltip('dispose');
                }, 1000);
              
            });
        }
        
        // a private method. for demonstration purposes only - remove it!
        //var foo_private_method = function() {
            // code goes here
        //}

        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.clippaste = function(options) {
               
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            if (undefined == $(this).data('clippaste')) {
                var plugin = new $.clippaste(this, options);
                $(this).data('clippasted', plugin);
            }else{
                var plugin = $(this).data('clippaste');
            }

          
            if(plugin.settings.methods[options]){
              // var pp = plugin.settings.methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
              // console.log('esto que es ' , Array.prototype.slice.call(arguments, 1))
               //plugin.settings.methods[options].call(this, Array.prototype.slice.call(arguments, 1));
               plugin.settings.methods[options].call(this, Array.prototype.slice.call(arguments, 1));
            }
        });
    }
})(jQuery);
