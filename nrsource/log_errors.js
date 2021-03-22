/**
 * Stores debug log into JSON file
 * Save a different log file for each day
 * */

// generate the date string
var dt = new Date();
var M = dt.getMonth() + 1;
var d = dt.getDate();
var h = dt.getHours();
var m = dt.getMinutes();

// add zeros
if (M < 10) M = '0' + M;
if (d < 10) d = '0' + d;
if (h < 10) h = '0' + h;
if (m < 10) m = '0' + m;

var dateString = dt.getFullYear() + '-' + M  + '-' + d + '-' + h + ':' + m;

const filename = "/home/pi/www/logs/log-" + dt.getFullYear() + M + d + ".json";
const levelName = ['DEBUG', 'ERROR'];
const minLevel = 0; // 0 = DEBUG, 1 = ERROR

// gets the filesystem module
var fs = global.get('fsModule');

// read the json array object
var jsonArray; 
try {
    jsonArray = JSON.parse(fs.readFileSync(filename).toString());
} catch(e) {
    jsonArray = [];
}

// check the message level
let level = 0, jsonClient = {};
if ((!msg.client || msg.client === '') || (!msg.client[0]["Numero"] || msg.client[0]["Numero"] === ''))
    level = 1;

try{
    jsonClient['Numero'] = msg.client[0]['Numero'];
    jsonClient['Socio'] = msg.client[0]['Socio'];
    jsonClient['DNI'] = msg.client[0]['DNI'];
} catch(e) {
    jsonClient['error'] = e;
}

if (minLevel <= level){
    // get values
    let dni = '', rfid = '', member = '', response = '';

    if (msg.payload.dni != '0') dni = msg.payload.dni + '';
    if (msg.payload.rfid != '0') rfid = msg.payload.rfid + '';
    if (msg.payload.member != '0') member = msg.payload.member + '';
    response = JSON.stringify(jsonClient);

    // create metrics object
    var jsonValue = {
        "date": dateString,
        "rfid": rfid,
        "dni": dni,
        "member": member,
        "level": levelName[level],
        "response": response
    };

    // save into file
    jsonArray.push(jsonValue);

    fs.writeFileSync(filename, JSON.stringify(jsonArray));
}

return msg;
