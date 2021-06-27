var express = require('express');
var router = express.Router();
var env = process.env.CUSTOM_NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];
var request = require("request");
var jwt = require('jsonwebtoken');

/** Helpers */
function getZoomToken() {
    const payload = {
        iss: config.ZoomApiKey,
        exp: ((new Date()).getTime() + 5000)
    };
    const token = jwt.sign(payload, config.ZoomApiSecret);
    console.log('token', token)
    return token;
}

function createZoomMeeting(userId, zoomToken, params, cb) {
    console.log('createZoomMeeting')
    var options = {
        json: params,
        url: 'https://api.zoom.us/v2/users/' + userId + "/meetings",
        headers: {
            'authorization': 'Bearer ' + zoomToken,
            "content-type": "application/json"
        }
    };
    request.post(options, cb);
}

function getZoomUsers(zoomToken, cb) {
    var url = 'https://api.zoom.us/v2/users?status=active';
    request.get(url, {
        'auth': {
            'bearer': zoomToken
        }
    }, cb);
}
/** End Helpers */
// To create meeting in zoom
router.post('/createZoomMeeting', function (req, res) {
    var zoomToken = getZoomToken();
    var liveclass = req.body;
    console.log('liveclass', liveclass)
    var params = {
        "topic": liveclass.title,
        "type": 2,
        "schedule_for": liveclass.userId, //
        "start_time": liveclass.start_time,//"2019-08-30T22:00:00Z",
        "duration": liveclass.length,//10
        "timezone": liveclass.timezone, //"America/New_York",
        "password": "BEAMMEUP",
        "settings": {
            "host_video": true,
            "participant_video": false,
            "join_before_host": false,
            "mute_upon_entry": true,
            "use_pmi": false,
            "approval_type": 0,
            "registration_type": 2,
            "audio": "both",
            "auto_recording": "none",
            //"alternative_hosts": "optisoltesting2021@gmail.com",
            "close_registration": false,
            "waiting_room": false,
            "registrants_email_notification": false,
            "registrants_confirmation_email": false,
            "meeting_authentication": false
        }
    }
    createZoomMeeting(liveclass.userId, zoomToken, params, function (error, response, body) {
        var data = { error, response }
        if (!error && response.statusCode == 201) {
            data = { body }
            return res.send({ status: true, message: 'Zoom Meeting created successfully.', data })
        }
        return res.status(201).send({ status: true, message: 'Zoom Meeting creation failed.', data })
    })
});

// To get users in zoom
router.get('/getUsers', function (req, res) {
    var zoomToken = getZoomToken();
    getZoomUsers(zoomToken, function (error, response, body) {
        var data = { zoomToken, body, error }
        res.send({ status: true, message: 'Zoom Meeting created successfully.', data })
    })
});

module.exports = router;
