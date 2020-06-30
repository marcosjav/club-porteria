var express = require('express');
var app = express();
var url = require('url');

app.get('/', function (req, res) {
   
    var sql = require("mssql");
    var parts = url.parse(req.url, true);
	var query = parts.query;

    // config for your database
    var config = {
        user: 'sa',
        password: '12345678',
        server: '192.168.1.171', 
        database: 'club' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('EXEC [dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = '+ query.rfid +';', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            //res.send(recordset);
            res.json(recordset);
            
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
