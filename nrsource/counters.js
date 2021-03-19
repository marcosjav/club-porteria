const filename = "/home/pi/www/node-counters.json";
var fs = global.get('fsModule');

// generate the date string
var d = new Date();
var m = d.getMonth() + 1;
if (m < 10) m = '0' + m;
var dateString = d.getFullYear() + '-' + m  + '-' + d.getDate();

// read the json array object
var jsonArray = JSON.parse(fs.readFileSync(filename).toString());

// create metrics object
var jsonValue = {
    "date": dateString,
    "dni": 0,
    "rfid": 0,
    "member": 0
};

// check if array contains this date
var jsonItemIndex = jsonArray.findIndex(item => item.date === dateString);

if (msg.payload.dni != '0')
    jsonValue.dni += 1;
else if (msg.payload.rfid != '0')
    jsonValue.rfid += 1;
else if (msg.payload.member != '0')
    jsonValue.member += 1;

if (jsonItemIndex >= 0) {
    jsonArray[jsonItemIndex].dni += jsonValue.dni;
    jsonArray[jsonItemIndex].rfid += jsonValue.rfid;
    jsonArray[jsonItemIndex].member += jsonValue.member;
} else {
    jsonArray.push(jsonValue);
}

fs.writeFileSync(filename, JSON.stringify(jsonArray));

return msg;