var express = require('express');
var actionService = require('../services/bot-service');
var ACTIONS = require('../services/bot-actions');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('control', {
        title: 'Garden Bot',
        actions: Object.entries(ACTIONS)
    });
});

router.post('/action', function (req, res, next) {
    actionService.toggle(req.body.action);
    res.send('success');
});

router.get('/action/:action', async function (req, res, next) {
    try {
        let data = await actionService.getActionState(req.params.action);
        console.log('action ' + req.params.action + ' result ' + data);
        res.send(data);
    } catch (e) {
        console.log('Error getting state for action ' + req.params.action);
    }
});

module.exports = router;
