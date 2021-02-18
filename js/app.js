var ws;
var timer;
var wsUri = "ws://localhost:1880/ws/simple"; // PROD
//var wsUri = "ws://192.168.1.151:1880/ws/simple"; // DEV

function wsConnect() {
    //console.log("connect",wsUri);
    ws = new WebSocket(wsUri);
    //var line = "";    // either uncomment this for a building list of messages
    ws.onmessage = function(msg) {
        //console.log(msg);
        let json;
        try {
            json = JSON.parse(msg.data);
            console.log(json);
            if (jQuery.isEmptyObject(json)){
                json = false;
                $('#message-alert').html("Tarjeta no válida");

                timer = new Timer(function() { // init timer with 5 seconds
                        $.when($('#message-alert').fadeOut(500)).done(function() {
                                resetMsgCard();
                                $('#message-alert').fadeIn(500);
                            });
                         }, 3000);
            }
        } catch (error) {
            switch (msg.data) {
                case "wait":
                    $('#message-alert').html("por favor espere...");
                    break;
                case "ok":
                    document.getElementById('status').innerHTML = '<span class="badge badge-success"><h6>Conectado</h6></span>';
                    break;
                case "disconnected":
                    document.getElementById('status').innerHTML = '<span class="badge badge-danger"><h3>Fallo en la red. Sin conexión con base de datos</h3></span>';
                    break;
            }
        }
        if (json){
            addClient(json);
            addHistory(json);
        }
    }
    ws.onopen = function() {
        // update the status div with the connection status
        //document.getElementById('status').innerHTML = '<span class="badge badge-success"><h6>Conectado</h6></span>';
        //ws.send("Open for data");
        //console.log("connected");
    }
    ws.onclose = function() {
        // update the status div with the connection status
        
        // in case of lost connection tries to reconnect every 3 secs
        setTimeout(wsConnect,3000);
    }
    ws.onerror = function(error) {
        console.log(error);
        // if isn't production, try to connect to development
        wsUri = "ws://192.168.1.169:1880/ws/simple";
    }
}

function doit(m) {
    if (ws && ws.readyState == 1 && m !== '') { ws.send(m); }
}

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
    $('#payment').html(client.status);
    // $('#message').html(client.message); // CHANGED TO HIDDEN

    if (client.enter){
        $('#enter').removeClass('badge-danger');
        $('#enter').addClass('badge-success');
        // $('#enter').html("PERMITIDO"); // CHANGED TO SHOW CLIENT.MESSAGE
    } else {
        $('#enter').removeClass('badge-success');
        $('#enter').addClass('badge-danger');
        // $('#enter').html("DENEGADO"); // CHANGED TO SHOW CLIENT MESSAGE
    }
    $('#enter').html(client.message);

    if (client.photo && client.photo.data)
        convertImage(client.photo.data);
    else
        noProfilePicture();

    $('#msg-card').hide();

    // SHOW CLIENT CARD
    $.when($('#card').fadeIn(500))
                .done(function() {
        resetMsgCard();
    });

    if(!timer || timer.finished){
        // HIDE CARD AFTER...
        timer = new Timer(function() { // init timer with 5 seconds
            $.when($('#card').fadeOut(500)).done(function() {
                        $('#msg-card').show();
                    });
                 }, 6500);
    } else {
        timer.setTime(6500); // add two seconds
    }

}

function addHistory(client){
    let row = $('<tr></tr>');
    let tbody = $('#table-history tbody');

    let h = $('<th></th>');
    let s = $('<td></td>');
    let n = $('<td></td>');
    
    let d = new Date();
    d = d.getHours() + ":" + (d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes());

    h.attr('scope', 'row');
    h.html(d);

    s.html(client.number);
    n.html(client.name);

    row.append(h)
        .append(s)
        .append(n);

    if (!client.enter)
        row.addClass('text-denegado');

    row.hide();

    // CHECK LENGTH
    if (tbody.children().length > 15){
        $.when(tbody.children().last().fadeOut(500)).done(function() {
            tbody.children().last().remove();
        });
    }

    tbody.prepend(row);
    row.fadeIn(500);
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

function noProfilePicture() {
    $('#photo').css({
        'background-image':'url("img/logo_azul.jpg")',
        'background-repeat':'no-repeat',
        'background-size':'contain',
        'background-position':'center',
        'width':'350px',
        'height':'350px'
        });
}

function resetMsgCard(){
    $('#message-alert').html('<h3>Bienvenido!</h3>Pase la tarjeta por el lector');
}

function sendNumber() {
    doit(document.getElementById("member-number").value);
    console.log(document.getElementById("member-number").value);
    document.getElementById("member-number").value = '';
}

// self executing function here
(function() {
    // your page initialization code here
    // the DOM will be available here
    var input = document.getElementById("member-number");
    input.addEventListener("keyup", function(event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
       event.preventDefault();
       doit(input.value);
       console.log(input.value);
       input.value = '';
      }
    });

 })();
