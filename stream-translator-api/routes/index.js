const express = require('express');
const router = express.Router();

const Controller = require("../controller/Controller");
const ControllerInstance = new Controller();


router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

router.post('/chat', (req, res) => {
  ControllerInstance.sendMessage(req, res);
});

router.get('/chat/:amount', (req, res) => {
  return ControllerInstance.getMessages(req, res);
});

router.get('/chat', (req, res) => {
  console.log("GET chat");
  const messages = ControllerInstance.getMessages(req, res);
  console.log(`Messages: ${messages}`);
  return res.json(messages);
});

router.get('/message', (req, res) => {
  return ControllerInstance.getMessage(req, res);
});

router.post('/channel/:channelName', (req, res) => {
  return ControllerInstance.setChannelName(req, res);
});

router.get('/channel', (req, res) => {
  return ControllerInstance.getChannel(req, res);
});

router.post('/language', (req, res) => {
  return ControllerInstance.setLanguages(req, res);
});

router.get('/language', (req, res) => {
  return ControllerInstance.getLanguages(req, res);
});

router.post('/me/:username', (req, res) => {
  return ControllerInstance.setMyUsername(req, res);
});

router.get('/me', (req, res) => {
  return ControllerInstance.getMyUsername(req, res);
});

module.exports = router;
