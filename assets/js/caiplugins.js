;(function($) {
 
    $.fn.wallet = function(method) {
        var _wallet;
        var _json; 

        const status = {
            'none':0 , 'wallet':1 , 'register':2 
        }
 
        var defaults = {
            addr: '0x',
            provider:null,
            onCreate: ()=>{}
        }
 
        var settings = {}
 
        var methods = {
 
            init : function(options) {
                return this.each(function() {
                    settings = $.extend({}, defaults, options)
                    var element = $(this);
                    element.html('<button class="btn btn-danger" id="id_test" >'+settings.addr+'</button>');
                    console.log("init", settings)
                    // code goes here
                });
            },
            create_Wallet(pin)  {
                console.log($(this));
                console.log(this.defaults);
                console.log(this.settings);
                

                _wallet = ethers.Wallet.createRandom();
                _json = _wallet.encrypt(pin);
                console.log(settings);
                //this.settings.onCreate();

                
                //eth_SaveWallet(oCrypt);
                //updwallet(wallet);
            },
 
            foo_public_method: function(a,b) {
                console.log("codio public ", arguments )
                console.log(settings)
                console.log(defaults)
                console.log(a);
                console.log(b)
                // code goes here
            },

            listen(msg){
                this.find('#id_test').text(msg);
            }
 
        }
 
        var helpers = {
 
            foo_private_method: function() {
                // code goes here
            }
 
        }
        console.log("method", method)
        
 
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in pluginName plugin!');
        }
 
    }
 
})(jQuery);


/*

  $("#tpl-wallet").loadTemplate("templates/wallet.html",{
                    addr: jCfg.addr,
                });

*/