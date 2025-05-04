var moment = require('moment-timezone');
var fs = require('fs');
const { format } = require('path');

const app_debug_mode = true;
const timezone_name = "Asia/Kolkata";
const msg_server_internal_error = "Server Internal Error"

module.exports = {


    ThrowHtmlError: (err, res) => {

        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------")
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        })

        if (res) {
            res.json({ 'status': '0', "message": msg_server_internal_error })
            return
        }
    },

    ThrowSocketError: (err, client, eventName) => {

        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------")
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        })

        if (client) {
            client.emit(eventName, { 'status': '0', "message": msg_server_internal_error })
            return
        }
    },

    CheckParameterValid: (res, jsonObj, checkKeys, callback) => {

        var isValid = true;
        var missingParameter = "";

        checkKeys.forEach((key, indexOf) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });


        if (!isValid) {

            if (!app_debug_mode) {
                missingParameter = "";
            }
            res.json({ 'status': '0', "message": "Missing parameter (" + missingParameter + ")" })
        } else {
            return callback()
        }
    },

    CheckParameterValidSocket: (client, eventName, jsonObj, checkKeys, callback) => {

        var isValid = true;
        var missingParameter = "";

        checkKeys.forEach((key, indexOf) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });


        if (!isValid) {

            if (!app_debug_mode) {
                missingParameter = "";
            }
            client.emit(eventName, { 'status': '0', "message": "Missing parameter (" + missingParameter + ")" })
        } else {
            return callback()
        }
    },



    Dlog: (log) => {
        return Dlog(log);
    },

    serverDateTime: (format) => {
        return serverDateTime(format);
    },

    serverYYYYMMDDHHmmss: () => {
        return serverYYYYMMDDHHmmss();
    }

}


function serverDateTime(format) {
    var jun = moment(new Date());
    jun.tz(timezone_name).format();
    return jun.format(format);
}

function Dlog(log) {
    if (app_debug_mode) {
        console.log(log);
    }
}

function serverYYYYMMDDHHmmss() {
    return serverDateTime('YYYY-MM-DD HH:mm:ss');
}

process.on('uncaughtException', (err) => {

})