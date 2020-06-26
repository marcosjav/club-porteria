var ws;
        var wsUri = "ws:";
        //var loc = window.location;
        ////console.log(loc);
        //if (loc.protocol === "https:") { wsUri = "wss:"; }
        // This needs to point to the web socket in the Node-RED flow
        // ... in this case it's ws/simple
        //wsUri += "//" + loc.host + loc.pathname.replace("simple","ws/simple");
        wsUri += "//localhost:1880/ws/simple";
        
        function wsConnect() {
            //console.log("connect",wsUri);
            ws = new WebSocket(wsUri);
            //var line = "";    // either uncomment this for a building list of messages
            ws.onmessage = function(msg) {
                //console.log(msg);
                let json;
                try {
                    json = JSON.parse(msg.data);
                    //console.log(json);
                } catch (error) {
                    if (msg.data === "wait") {
                        $('#message-alert').html("por favor espere...");
                    }
                }
                if (json){
                    client = json;
                    addClient(json);
                }
            }
            ws.onopen = function() {
                // update the status div with the connection status
                document.getElementById('status').innerHTML = '<span class="badge badge-success text-success">0</span> connected';
                //ws.send("Open for data");
                //console.log("connected");
            }
            ws.onclose = function() {
                // update the status div with the connection status
                document.getElementById('status').innerHTML = '<span class="badge badge-danger text-danger">0</span> not connected';
                // in case of lost connection tries to reconnect every 3 secs
                setTimeout(wsConnect,3000);
            }
        }
        
        function doit(m) {
            if (ws) { ws.send(m); }
        }
        var client;
        function addClient(client){
            let d = new Date(client.time);
            let l = client.last;
            let u = client.until;

            //row += d.getHours() + ":" + (d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes());
            
            $('#name').html(client.name);
            $('#category').html(client.category);
            $('#number').html(client.number);
            $('#dni').html(client.dni);
            $('#last').html(l);
            $('#until').html(u);

            convertImage(client.photo.data);

            $('#msg-card').hide();
            //$('#card').fadeIn("slow");
            
            $.when($('#card').fadeIn(500))
                        .done(function() {
                $('#message-alert').html('<h3>Bienvenido!</h3>Pase la tarjeta por el lector');
            });
            
            setTimeout(function() { 
                //$('#card').fadeOut("slow");
                $.when($('#card').fadeOut(500))
                                            .done(function() {
                    $('#msg-card').show();
                });
             }, 3500);

        }

        function convertImage(bytesArray){
            let uInt8Array = new Uint8Array(bytesArray);
            let i = uInt8Array.length;
            
            let binaryString = [i];

            while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }

            let data = binaryString.join('');

            let base64 = window.btoa(data);

            //console.log(base64);
            $('#photo').css({
                'background-image':'url("data:image/png;base64,' + base64 + '")',
                'background-repeat':'no-repeat',
                'background-size':'contain',
                'background-position':'center',
                'width':'350px',
                'height':'350px'
                });
        }
