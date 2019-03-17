var express = require('express');
var actionService = require('../services/bot-service');
var ACTIONS = require('../services/bot-actions');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('control', {
    title: 'Garden Bot',
    actions: Object.entries(ACTIONS)
  });
});

router.post('/action', function(req, res, next) {
  console.log('Action ' + req.body.action);
  actionService.toggle(req.body.action);
  res.send('success');
});

module.exports = router;
