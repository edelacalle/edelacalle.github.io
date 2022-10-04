// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

// remember to change every instance of "pluginName" to the name of your plugin!
;(function($) {

    // here we go!
    $.dialog = function(element, options) {
        var defaults = {}
        var plugin = this;
        plugin.settings = {}

        var $element = $(element), element = element;        

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            // code goes here
        }

        
        plugin.refresh = async function( opts ) {
           await $element.loadTemplate( "assets/templates/dialogs/loading.html",opts,{async:false});
           if(opts.visible) $element.show(); else $element.hide();
        }

        plugin.prompt = async function( opts ) {
            var dfd = jQuery.Deferred();
            await $element.loadTemplate( "assets/templates/dialogs/modal-prompt.html",opts,{async:false});
                var child = $element.children();
                $(child).find("#btn-no").click(function() {        
                    dfd.resolve(null);
                });
                $(child).find("#btn-yes").click(function() {
                    dfd.resolve($(child).find("#input-data").val());
                });
                var myModal = bootstrap.Modal.getOrCreateInstance(child);
                myModal.show();
            return dfd.promise();
        }

        plugin.modalmsg = async function( opts ) {
            var dfd = jQuery.Deferred();
            await $element.loadTemplate( "assets/templates/dialogs/modal-msg.html",opts,{async:false});
                var child = $element.children();
                $(child).find("#btn-yes").click(function() {
                    dfd.resolve($(child).find("#input-data").val());
                });
                var myModal = bootstrap.Modal.getOrCreateInstance(child);
                myModal.show();
            return dfd.promise();
        }

        plugin.yesno = async function( opts ) {
            var dfd = jQuery.Deferred();
            await $element.loadTemplate( "assets/templates/dialogs/modal-yesno.html",opts,{async:false});
                var child = $element.children();
                $(child).find("#btn-no").click(function() {        
                    dfd.resolve(false);
                });
                $(child).find("#btn-yes").click(function() {
                    dfd.resolve(true);
                });
                var myModal = bootstrap.Modal.getOrCreateInstance(child);
                myModal.show();
            return dfd.promise();
        }

        plugin.disclaim = async function( opts ) {
            var dfd = jQuery.Deferred();
            var lVisible = true;
            await $element.loadTemplate( "assets/templates/dialogs/modal-disclaimer.html",opts,{async:false});
            var child = $element.children();
            $(child).find("#id_check").on( 'change' ,function() {        
                console.log("ha cambiado el check");
                // dfd.resolve(null);
                lVisible = false
            });
            $(child).find("#btn-yes").click(function() {
                dfd.resolve(lVisible);
            });
            var myModal = bootstrap.Modal.getOrCreateInstance(child);
            myModal.show();
            return dfd.promise();
        }

        plugin.msg = async function(tipo,msg) {
            $element.loadTemplate("assets/templates/dialogs/msg.html",{tipo:'alert alert-'+tipo, msg:msg});
        }
        
        plugin.pin = ( opts ) => {
            var dfd = jQuery.Deferred();
            $element.loadTemplate( "assets/templates/dialogs/modal-pin.html", opts , {async:false});

            //$element.load( "assets/templates/dialogs/modal-pin.html",  function() {
                var child = $element.children();
                $(child).on('shown.bs.modal', function (e) {
                    var obj =  $(child).find('#pincode');
                    obj.pincodeInput({
                        inputs: 4,
                        complete: async function (text) {
                            myModal.hide();
                            dfd.resolve(text);
                            return text;
                        }
                    });
                    //autofocus
                    obj.pincodeInput().data('plugin_pincodeInput').clear();
                    obj.pincodeInput().data('plugin_pincodeInput').focus();
                });
                var myModal = bootstrap.Modal.getOrCreateInstance(child);
                myModal.show();
            //});
            return dfd.promise();
          }

        plugin.toast = function(tipo,msg) {
            $element.loadTemplate( "assets/templates/dialogs/toast.html", {tipo:'alert alert-'+tipo, msg:msg } , {async:false});
            var myToast = bootstrap.Toast.getOrCreateInstance($element.children());
            myToast.show();
        }

  
        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var foo_private_method = function() {

            // code goes here

        }

        

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.dialog = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('dialog')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.dialog(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('dialog', plugin);

            }

        });

    }

})(jQuery);