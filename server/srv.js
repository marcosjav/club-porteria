var express = require('express');
var app = express();
var url = require('url');

app.get('/', function (req, res) {
    var start = new Date();
    var sql = require("mssql");
    var parts = url.parse(req.url, true);
	var query = parts.query;

    // config for your database
    var config = {
        user: 'US_TARJETA',
        password: 'crc.2020',
        server: '192.168.0.1', 
        database: 'calipso' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        //request.query("Declare @T Table (Socio varchar(40));Declare @V VARCHAR(40);Insert @T EXEC calipso.[dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = "+query.rfid+";Select @V = Socio from @T;EXEC calipso.[dbo].[Porteriacontrol] @Numero = @V, @DNI='',@Servicio=''", function (err, recordset) {
        //request.query("EXEC calipso.[dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = "+query.rfid+";", function (err, recordset) {
        var q = "Declare @T Table (Socio varchar(40));Declare @V VARCHAR(40);Insert @T EXEC calipso.[dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = "+query.rfid+";Select @V = Socio from @T;EXEC calipso.[dbo].[Porteriacontrol] @Numero = @V, @DNI='',@Servicio='00001'";
        request.query(q, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            //res.send(recordset);
            //res.json(recordset);
            
            end = new Date() - start;
            start = new Date();
            console.log("-");
            console.log(q);
            console.log("tiempo: " + (end/1000) + " seg");
            console.log("");
            
            q = "EXEC calipso.[dbo].[Porteriacontrol] @Numero = 041590, @DNI='',@Servicio='00001';";
            request.query(q, function (err, recordset) {
            
                if (err) console.log(err)

                // send records as a response
                //res.send(recordset);
                //res.json(recordset);
                
                var end = new Date() - start;
                start = new Date();
                console.log("-");
                console.log(q);
                console.log("tiempo: " + (end/1000) + " seg");
                console.log("");
                
                q = "EXEC calipso.[dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = 74410027;";
                request.query(q, function (err, recordset) {
                    
                    if (err) console.log(err)

                    // send records as a response
                    //res.send(recordset);
                    //res.json(recordset);
                    res.send('ok');
                    
                    var end = new Date() - start;
                    console.log("-");
                    console.log(q);
                    console.log("tiempo: " + (end/1000) + " seg");
                    console.log("");
                });
            });
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
