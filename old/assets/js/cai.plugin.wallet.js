// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

const WalletStatus = {'guest':0 , 'wallet':1 , 'register':2 }
// remember to change every instance of "pluginName" to the name of your plugin!
;(function($) {

    // here we go!
    $.wallet = function(element, options) {

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {
            addr: '0x',
            wallet: {address:'0x'}, 
            provider: {},
            balance:0.0,
            status: WalletStatus.guest,
            // if your plugin is event-driven, you may provide callback capabilities for its events.
            // execute these functions before or after events of your plugin, so that users may customize
            // those particular events without changing the plugin's code
            onCreate: function() {},
            onOpen: function() {},
            onPin: ()=> false,
            // onError: (e)=>alert(e),
            onError: (e)=> oDlg.msg( 'danger',e),
            onCobro: ()=> oDlg.msg( 'success','has cobrado'),
            onPago:  ()=> oDlg.msg( 'warning','has pagado'),
            onUpdate: ()=>{}

        }

        // to avoid confusions, use "plugin" to reference the current instance of the object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('pluginName').settings.propertyName from outside the plugin, where "element" is the
        // element the plugin is attached to;
        plugin.settings = {}

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
             element = element;        // reference to the actual DOM element

        // the "constructor" method that gets called when the object is created
        plugin.init = function() {
            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
            // code goes here
            plugin.settings.provider = options.provider;
            plugin.update();
        }

        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
        // is the element the plugin is attached to;
        plugin.create = function() {
            plugin.settings.wallet = ethers.Wallet.createRandom();
            plugin.settings.status = WalletStatus.wallet;
            plugin.settings.onOpen(plugin.settings.wallet);
            plugin.connect();
            plugin.update();
            this.settings.onCreate(plugin.settings.wallet);
            this.connect();
        }

        plugin.export = async function() {
            var pin = await  plugin.settings.onPin();
            if(!pin){return;}
            var json= await plugin.settings.wallet.encrypt(pin);
            var a = document.createElement('a');
            a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(json));
            a.setAttribute('download', plugin.settings.addr+'.json');
            a.click()
        }
        plugin.import_prvK = function(prvK) {
            try {
                plugin.settings.wallet = new ethers.Wallet( prvK );
                plugin.settings.onOpen(plugin.settings.wallet);
                plugin.connect();
                plugin.update();
            } catch (error) {
                plugin.settings.onError(error)
                return false
            }
            return true;
        }
        plugin.import_json = async function(e) {
            var pin = await  plugin.settings.onPin();
            if(!pin){return;}
            readDataFromFile = new FileReader();
            readDataFromFile.onload = () => {
                data = readDataFromFile.result;
                try { 
                    plugin.settings.wallet = ethers.Wallet.fromEncryptedJsonSync( data , pin );
                    plugin.settings.onOpen(plugin.settings.wallet);
                    plugin.connect();
                    plugin.update();
                } catch (error) {
                    plugin.settings.onError(error);
                }
               
            };
            readDataFromFile.readAsText(e.files[0]);
           
           
        }

        plugin.save_local = async function() {
            var pin = await plugin.settings.onPin();
            if(!pin){return;}
            var json= await plugin.settings.wallet.encrypt(pin);
            localStorage.setItem("wallet", json);
            
        }
        plugin.load_local = async function(prvK) {
            var json = localStorage.getItem("wallet");
            if(json){
                var pin = await plugin.settings.onPin();
                if(!pin){return;}
                try {
                    plugin.settings.wallet = await ethers.Wallet.fromEncryptedJsonSync( json , pin );
                    plugin.settings.status = WalletStatus.wallet;                 
                    plugin.settings.onOpen(plugin.settings.wallet);
                    plugin.connect();
                    plugin.update();
                    
                } catch (error) {
                    plugin.settings.onError(error)
                    
                }
              
            }
        }
        plugin.delete_local = async function() {
            localStorage.removeItem("wallet");
            location.reload();

        }

        plugin.connect = function(){
            console.log("plugin.connect");
            plugin.settings.wallet = plugin.settings.wallet.connect ( plugin.settings.provider )  ;
            
            var f_cobro = { 
                address :"0x0000000000000000000000000000000000001010",
                topics: [ null , null , null , ethers.utils.hexZeroPad(plugin.settings.addr, 32)]  };
            var f_pago = { 
                    address :"0x0000000000000000000000000000000000001010",
                    topics: [ null , null , ethers.utils.hexZeroPad(plugin.settings.addr, 32), null ]  };
    
            plugin.settings.provider.on(f_cobro, (log,event) => {
                plugin.update();
                plugin.settings.onCobro();

            });
            plugin.settings.provider.on(f_pago, (log,event) => {
                plugin.update();
                plugin.settings.onPago();
            });




            console.log("he conectado")


        }

        plugin.setProvider_json = function(urlRpc,chainId,name) {
            plugin.settings.provider = new ethers.providers.StaticJsonRpcProvider(
                urlRpc, { chainId: chainId, name }
            );


            
        }
        plugin.send_Gas = async function( to , amount) {
            console.log("to", to);
            console.log("amount", amount);

            let wei_cant = ethers.utils.parseEther(amount);
            let wei_bal  = ethers.utils.parseEther(plugin.settings.balance);

            let eth_cant = parseFloat(ethers.utils.formatEther(wei_cant)); 
            let eth_bal = parseFloat(ethers.utils.formatEther(wei_bal)) ;
            //ethers.utils.formatEther(bi_cant).toFixed(2);
            //let eth_bal = ethers.utils.formatEther(bi_bal).toFixed(2);
            //console.log(eth_cant, eth_bal , eth_cant +1 , eth_bal + 0.1);
            
            
            

            var nonce =  await plugin.settings.provider.getTransactionCount(plugin.settings.wallet.address, "latest") ;

            let tx = {
                to: to,
                value: ethers.utils.parseEther(amount),
                nonce: nonce,
            }
            
            let walletSigner = plugin.settings.wallet.connect(window.ethersProvider);
            var w = new ethers.Wallet(walletSigner.privateKey, plugin.settings.provider);
            
           
            //console.log(walletSigner);

            //console.log(plugin.settings.wallet);
            //plugin.settings.wallet.provider = plugin.settings.provider;
            //plugin.settings.wallet.sendTransaction(tx)
            try {
                //w.sendTransaction(tx)
                //.then((txObj) => {
                //    console.log('txHash', txObj.hash)
                    // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
                    // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
                //}) 
                await w.sendTransaction(tx);
                
            } catch (error) {
                console.log("error", error)
                plugin.settings.onError("No tienes saldo Gas: "+ eth_bal.toFixed(2) + ' -> Solic: ' +eth_cant.toFixed(2)) ;   
            }
        
        }



        plugin.update =  async function() {
            plugin.settings.addr = plugin.settings.wallet.address; 
            $('.cai-widget-addr').text(plugin.settings.addr);
            if(plugin.settings.addr!="0x"){
                plugin.settings.balance = ethers.utils.formatEther(await plugin.settings.provider.getBalance(plugin.settings.wallet.address));
                $('.cai-widget-bal').text(plugin.settings.balance);
             
            }
            
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
    $.fn.wallet = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            console.log($(this).data('wallet'));

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('wallet')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.wallet(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('wallet', plugin);

            }

        });

    }

})(jQuery);