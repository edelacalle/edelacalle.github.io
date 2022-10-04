const WalletStatusMeta = {'guest':0 , 'wallet':1 , 'register':2 , 'data':3}
const IconStatusMeta = { 0:'bi bi-question'  , 1:'bi bi-wallet' , 2:'bi bi-person-badge-fill'  , 'data':'bi bi-person'}
const ColorStatusMeta = { 0:'btn btn-danger'  , 1:'btn btn-info' , 2:'btn btn-success'  , 'data':'btn btn-danger'}

;(function($) {

    // here we go!
    $.walletMeta = function(element, options) {
        var defaults = {
            w: null,
            addr: null,
            status: WalletStatusMeta.guest,
            provider: null,
            gas: 0.0,
            onCreate:   ()=>{},
            onOpen:     ()=>{},
            onPin:      ()=>{},
            onRefresh:  (lShow) => app.dlg.refresh(lShow),
            onError:    (e)=> app.dlg.msg( 'danger',e),
            onCobro:    ()=> app.dlg.msg( 'success','has cobrado'),
            onPago:     ()=> app.dlg.msg( 'warning','has pagado'),

        }
        var plugin = this;
        plugin.settings = {}

        var $element = $(element) , element = element;     

        
        plugin.init = async function() {
            plugin.settings = $.extend({}, defaults, options);
            const signer = plugin.settings.provider.getSigner();
            await plugin.settings.provider.send("eth_requestAccounts", []);
            plugin.settings.addr =  await signer.getAddress();
            if(plugin.settings.addr){
                plugin.settings.status = WalletStatusMeta.wallet;
                plugin.settings.onOpen();
     
            } 
            this.update();
        
        }
        plugin.setAddress = function(addr) {
            plugin.settings.addr = addr;
            plugin.settings.onOpen();
            this.update();
        }
 


        // public methods
        plugin.create = function(prvK) {
            alert("debes crear los wallets por metamask")
            /*
            if(!prvK || prvK == "" )
                plugin.settings.wallet = ethers.Wallet.createRandom();
            else
                plugin.settings.wallet = new ethers.Wallet( prvK );

            plugin.settings.status = WalletStatusMeta.wallet;
            plugin.settings.lSaveLocal = false;
            plugin.settings.onOpen(plugin.settings.wallet);
            plugin.settings.onCreate(plugin.settings.wallet);
            this.update();
            */
        }

        plugin.createFromMemo = function(memo) {
            /*
            if(!memo || memo == "" ) return;
            plugin.settings.wallet = ethers.Wallet.fromMnemonic ( memo ) ;
            plugin.settings.status = WalletStatusMeta.wallet;
            plugin.settings.lSaveLocal = false;
            plugin.settings.onOpen(plugin.settings.wallet);
            this.update();
            */
           alert("debes crear los wallets por metamask")
        }




        plugin.export = async function() {
            alert("debes exportar por metamask")
            /*
            var value = await  plugin.settings.onValue();
            if(!value){return;}
            var json= await plugin.settings.wallet.encrypt(value);
            var a = document.createElement('a');
            a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(json));
            a.setAttribute('download', plugin.settings.wallet.address+'.json');
            a.click()
            */
        }


        plugin.import_prvK = function(prvK) {
            /*
            try {
                plugin.settings.wallet = new ethers.Wallet( prvK );
                plugin.settings.status = WalletStatusMeta.wallet;
                plugin.settings.lSaveLocal = false;
                plugin.settings.onOpen(plugin.settings.wallet);
                this.update();
            } catch (error) {
                plugin.settings.onError(error)
                return false
            }
            return true;
            */
        }
        plugin.import_json = async function(e) {
            alert("no valido en metamask");
            /*
            //var pin = await  plugin.settings.onPin();
            //if(!pin){return;}
            var pin = await app.dlg.prompt({title:'Clave Pasaporte', msg:'Introduce la clave que pusiste cuando exportaste el pasaporte'})
            readDataFromFile = new FileReader();
            readDataFromFile.onload = () => {
                data = readDataFromFile.result;
                try { 
                    plugin.settings.wallet = ethers.Wallet.fromEncryptedJsonSync( data , pin );
                    plugin.settings.status = WalletStatusMeta.wallet;
                    plugin.settings.lSaveLocal = false;
                    plugin.settings.onOpen(plugin.settings.wallet);
                    plugin.settings.lSaveLocal = false;
                    this.update();
                } catch (error) {
                    plugin.settings.onError(error);
                }
            };
            readDataFromFile.readAsText(e.files[0]);
            */
        }

        plugin.save_local = async function(pin) {
            alert("no valido en metamask")
            /*
            if( pin == null || pin == "" ){
                pin = await plugin.settings.onPin();
            }
            
            //if(!pin){return;}
            //const prvK = (plugin.settings.wallet.privateKey.length == 64 ) ? plugin.settings.wallet.privateKey :plugin.settings.wallet.privateKey.substring(2);
            //var sig = sign_pin( prvK , pin );
            //localStorage.setItem("sig", sig);
            //var data = await plugin.settings.wallet.encrypt(ethers.utils.id( pin )) 
            var pin = "nosecure";
            
            try {
                app.dlg.refresh({visible:true, msg:"Encriptando el pasaporte , espere por favor"})
                var data = await plugin.settings.wallet.encrypt( pin) ;
                app.dlg.refresh({visible:false})
                localStorage.setItem("wallet", data);
               
            } catch (error) {
                console.log("error", error)
            }
            this.settings.lSaveLocal = true;
            //plugin.settings.onSave();
            */
            
        }


        plugin.load_local = async function() {
            alert("no valido en metamask")
            /*
            var json = localStorage.getItem("wallet");
            if(json){
                var data = JSON.parse(localStorage.getItem("wallet"));
                const addrWallet = ( data["address"].substring(0,2)=='0x')?data['address']: '0x'+data['address'];
                var pin = "nosecure";
                    try {
                        plugin.settings.wallet = await ethers.Wallet.fromEncryptedJsonSync( json , pin );
                        plugin.settings.status = WalletStatusMeta.wallet;                 
                        plugin.settings.lSaveLocal = false;
                        plugin.settings.onOpen(plugin.settings.wallet);
                    } catch (error) {
                        plugin.settings.onError(error)
                    }
            }
            */

        }


        plugin.prod_load_local = async function() {
            /*
            var json = localStorage.getItem("wallet");
            if(json){
                var pin = await plugin.settings.onPin();
                if(!pin){return;}
                var data = JSON.parse(localStorage.getItem("wallet"));
                const addrWallet = ( data["address"].substring(0,2)=='0x')?data['address']: '0x'+data['address'];
                var sig = localStorage.getItem("sig");
                if(!sig) return;
                const signer = EthCrypto.recover(sig,EthCrypto.hash.keccak256(pin));
                
                if(addrWallet.toLowerCase() == signer.toLowerCase()){
                    try {
                        plugin.settings.wallet = await ethers.Wallet.fromEncryptedJsonSync( json , ethers.utils.id(pin) );
                        plugin.settings.status = WalletStatusMeta.wallet;                 
                        plugin.settings.lSaveLocal = false;
                        plugin.settings.onOpen(plugin.settings.wallet);
                        this.update();
                    } catch (error) {
                        plugin.settings.onError(error)
                        
                    }
                }else{
                    plugin.settings.onError('Error en la firma')
                }

            }
            */
           alert("no valido en metamask")

        }


        plugin.delete_local = async function() {
            alert("no valido en metamask")
            // localStorage.removeItem("wallet");
            //location.reload();
        }

        plugin.connect = function(provider){
            
            plugin.settings.provider = provider ; 
            plugin.settings.wallet = plugin.settings.wallet.connect ( provider )  ;
            plugin.update();
            var f_cobro = { 
                address :"0x0000000000000000000000000000000000001010",
                topics: [ null , null , null , ethers.utils.hexZeroPad(plugin.settings.wallet.address, 32)]  };
            var f_pago = { 
                address :"0x0000000000000000000000000000000000001010",
                topics: [ null , null , ethers.utils.hexZeroPad(plugin.settings.wallet.address, 32), null ]  };
    
            provider.on(f_cobro, (log,event) => {
                plugin.update();
                plugin.settings.onCobro();

            });
            provider.on(f_pago, (log,event) => {
                plugin.update();
                plugin.settings.onPago();
            });
            

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
            plugin.settings.gas = await plugin.gas();
            this.settings.$w = $(this.settings.w);
            this.settings.$w.empty();



            var cText = (this.settings.status == WalletStatusMeta.guest)? 'Sin Pasaporte': 
                (this.settings.status == WalletStatusMeta.wallet ) ? this.abbr() :
                (this.settings.status == WalletStatusMeta.register && app.user ) ?  app.user.nomalias :''

            

            this.settings.$w.append(
                $('<button/>')
                  .attr("role", "button")
                  //.attr("onclick","clipboardCopy('"+this.addr()+"')")
                  .attr("onclick","navigate('passport')")
                  .addClass(ColorStatusMeta[this.settings.status])
                 // .append('<i/>')
                  .addClass(IconStatusMeta[this.settings.status])
                 // .addClass('pepeillo')
                  //.append("<span class='p-2'/>")
                    .text(" "+ cText )
              );



            //this.settings.$w.html('<button class="btn btn-danger" id="id_test" >'+'pepe'+'</button>');
          
            /*
            <button role="button" type="button" >
            <i class="bi bi-person-badge-fill"></i>
            <span cai-eval="app.wallet.abbr()" ></span>
          </button>
          */


            objs = $("[cai-eval]");
            objs.each((i,e) => {
                var value = eval($(e).attr("cai-eval"));
                $(e).html(value);
            })
            objs = $("[cai-eval-sync]");
            objs.each( async (i,e) => {
                var value = await eval( $(e).attr("cai-eval-sync"));
                $(e).html(value);
            })
            objs = $("[cai-visible]");
            objs.each((i,e)=>{
                var lRet = eval($(e).attr("cai-visible"));
                if(lRet){
                    $(e).show()
                }else{
                    $(e).hide()
                } 
            })

        }

        plugin.abbr =  () => plugin.settings.addr.substring(0,5) + '...' + plugin.settings.addr.substring(38);
        plugin.addr = () => plugin.settings.addr;
        plugin.pubK = () => '?';
        plugin.prvK = () => '?';
        plugin.memo = () => '?';
        plugin.gas = async () => ethers.utils.formatEther(await plugin.settings.provider.getBalance(plugin.settings.addr))
        

        //plugin.pubK = () => (plugin.settings.wallet)?plugin.settings.wallet.publicKey:'';
        //plugin.prvK = () => (plugin.settings.wallet)?plugin.settings.wallet.privateKey:'';
        //plugin.memo = () => (plugin.settings.wallet && plugin.settings.wallet.mnemonic )?plugin.settings.wallet.mnemonic.phrase:'';
        //plugin.gas =  async () => (plugin.settings.provider)?  ethers.utils.formatEther(await plugin.settings.provider.getBalance(plugin.settings.wallet.address)):0.0;
            
        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var sign_pin = function(prvK,pin){
            return EthCrypto.sign(prvK, EthCrypto.hash.keccak256(pin));
        }

        

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.walletMeta = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('walletMeta')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.walletMeta(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('walletMeta', plugin);

            }

        });

    }

})(jQuery);