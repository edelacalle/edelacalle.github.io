;(function($) {
    $.armonia = function(element, options) {
       var defaults = {
            address: '',
            abi:'',
            provider:null,
            wallet:null,
            roContract: null,
            rwContract:null,
            onError: (e)=> app.dlg.msg( 'danger',e),
            onSuccess: (e)=> app.dlg.msg( 'success',e),
            onRegister: ()=> app.dlg.msg( 'success','Pasaporte Registrado'),
        }
        var plugin = this;
        plugin.settings = {}

        var $element = $(element),  element = element;        
        
        plugin.init = async  function() {
            plugin.settings = $.extend({}, defaults, options);
            //console.log("init", options.abi);
            //var response = await $.get( options.abi);
            //console.log("desp", response)
            plugin.settings.abi = JSON.stringify(options.jAbi);
            plugin.settings.roContract = new ethers.Contract(options.address, plugin.settings.abi, options.provider);
        }

        // public methods
        plugin.setWallet = function(oWallet , oW) {
            plugin.settings.oWallet = oWallet;
            plugin.settings.wallet = new ethers.Wallet(oW.privateKey, plugin.settings.provider);
            plugin.settings.rwContract = new ethers.Contract(options.address, plugin.settings.abi, plugin.settings.wallet);
            
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
                //plugin.settings.oWallet.settings.status = WalletStatus.register;
                    
                              
                var oUser = sanitize_PER(aux);                                 
                oUser.silver = await plugin.PER_getSilverByAddr(addr) || 0;

                this.update();
                return oUser;
                //return(sanitize_PER(aux));
            }
        }

        plugin.PER_allAlias = async () =>  (plugin.settings.roContract) ?  await plugin.settings.roContract.PER_allAlias():[];
        plugin.PER_allAddr  = async () =>  (plugin.settings.roContract) ?  await plugin.settings.roContract.PER_allAddr():[];
        plugin.COM_allAlias = async () =>  (plugin.settings.roContract) ?  await plugin.settings.roContract.COM_allComunidades() :[];
        plugin.PER_AliasToAddr = async (alias) =>  (plugin.settings.roContract) ?  await plugin.settings.roContract.PER_AliasToAddr(alias) :[];


        plugin.PER_allGente = async () => {
            var oRet = [];
            var aRet = await plugin.settings.roContract.PER_allGente();
            aRet.forEach(e => {
                oRet.push(sanitize_PER(e))
            });
            return oRet;
        }
        plugin.PER_register = async (alias, nombre) => {
            const feeData = await provider.getFeeData()
            console.log("fee", feeData);
            try {
                await plugin.settings.rwContract.PER_register(alias,nombre,plugin.settings.wallet.publicKey,{ gasPrice: feeData.gasPrice });
                console.log("ya registrado")
                plugin.settings.onRegister(nombre);
            } catch (error) {
                console.log("error", error)
                plugin.settings.onError(error)
            }
        }

        plugin.PER_getSilverByAddr = async (addr) => {
            var res = await plugin.settings.roContract.PER_getSilverByAddr(addr);
            return parseInt(ethers.utils.formatUnits( res  , "ether" )) ;
        }

        plugin.DAO_getCoin = async () => {
            if(!plugin.settings.roContract) return;
            return await plugin.settings.roContract.DAO_getCoin();
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