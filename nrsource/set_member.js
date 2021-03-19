let member = msg.payload;
msg.payload = {};
msg.payload.rfid = '0';
if (member.length > 6) {
    msg.payload.member = '0';
    msg.payload.dni = member;
} else {
    msg.payload.member = member;
    msg.payload.dni = '0';
}
return msg;