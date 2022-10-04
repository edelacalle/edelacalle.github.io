// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

// remember to change every instance of "pluginName" to the name of your plugin!
;(function($) {
    $.armonia = function(element, options) {
       var defaults = {
            address: '',
            abi:'',
            provider:null,
            wallet:null,
            roContract: null,
            rwContract:null,
            onError: (e)=> oDlg.msg( 'danger',e),
            onSuccess: (e)=> oDlg.msg( 'success',e),
        }
        var plugin = this;
        plugin.settings = {}

        var $element = $(element),  element = element;        
        
        plugin.init = async  function() {
            plugin.settings = $.extend({}, defaults, options);
            var response = await $.get( options.abi);
            plugin.settings.abi = response.abi;
            plugin.settings.roContract = new ethers.Contract(options.address, response.abi, options.provider);

        }

        // public methods
        plugin.setWallet = function(oW) {
            var w = new ethers.Wallet(oW.privateKey, plugin.settings.provider);
            plugin.settings.rwContract = new ethers.Contract(options.address, plugin.settings.abi, w);
        }
            
        
        plugin.send_Gas = function( to , amount) {
            // Ether amount to send
            // Create a transaction object
            let tx = {
                to: to,
                // Convert currency unit from ether to wei
                value: ethers.utils.parseEther(amount)
            }
          
           
            plugin.settings.wallet.sendTransaction(tx)
            .then((txObj) => {
                console.log('txHash', txObj.hash)
                // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
                // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
            }) 
        }


        plugin.findUser =  async function(addr) {
            if(!plugin.settings.roContract) return;
            var aux = await plugin.settings.roContract.PER_AddrToGente(addr);
            if(aux.addr !="0x0000000000000000000000000000000000000000"){
                plugin.settings.nombre = aux.name;
                plugin.settings.alias  = aux.nomalias;
                plugin.settings.parent  = aux.parent;
                plugin.settings.pubK  = aux.pubK;
                plugin.settings.wallet.settings.status = WalletStatus.register;
                this.update();
                return(sanitize_PER(aux));
            }
        }

        plugin.PER_allAlias = async () =>  await plugin.settings.roContract.PER_allAlias();
        plugin.COM_allAlias = async () =>  await plugin.settings.roContract.COM_allComunidades();


        plugin.PER_allGente = async () => {
            var oRet = [];
            var aRet = await plugin.settings.roContract.PER_allGente();
            aRet.forEach(e => {
                oRet.push(sanitize_PER(e))
            });
            return oRet;
        }
        plugin.PER_register = async (alias, nombre) => {
            console.log(plugin.settings.roContract);
            try {
                await plugin.settings.rwContract.PER_register(alias,nombre,plugin.settings.wallet.settings.wallet.publicKey);
                plugin.settings.onSuccess('Usuario dado de alta:'+ nombre + plugin.settings.wallet.settings.wallet.addr );
            } catch (error) {
                plugin.settings.onError(error)
                
            }
        }

        plugin.PER_getSilverByAddr = async (addr) => {
            var res = await plugin.settings.roContract.PER_getSilverByAddr(addr);
            return parseInt(ethers.utils.formatUnits( res  , "ether" )) ;
        }

        plugin.DAO_getCoin = async () => {

            var res = await plugin.settings.roContract.DAO_getCoin();
            console.log(res);
            //return ethers.utils.parseEther( res.toNumber().toString() );
        }


        plugin.update =  async function() {
            //cai-widget-arm-nombre
            //console.log("update",  plugin.settings.wallet.settings.addr  );
            //var aux = await plugin.settings.cArm.PER_AddrToGente(plugin.settings.wallet.settings.addr);
            //console.log(aux);
            $('.cai-widget-arm-nombre').text(plugin.settings.nombre);
            $('.cai-widget-arm-alias').text(plugin.settings.alias);
            
        }



        

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var foo_private_method = function() {

            // code goes here

        }
        var sanitize_PER = function(e) {
            return {
                active:e.active,
                addr:e.addr,
                ifps:e.ipfs,
                name:e.name,
                nomalias: e.nomalias.split('.').pop(),
                parent:e.parent,
                pubK:e.pubK
            }
        }

        

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.armonia = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('armonia')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.armonia(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('armonia', plugin);

            }

        });

    }

})(jQuery);