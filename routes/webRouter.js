var express = require('express');
var login = require('../controllers/login.js');
var index = require('../controllers/index.js');
var weixin = require('../controllers/weixin.js');
var multiparty = require('connect-multiparty')();
var router = express.Router();

router.get('/', index.showIndex);
router.post('/index/userMessage', multiparty , index.userMessage);

//注册登陆模块
router.get('/login', login.showLogin);
router.get('/login/signOut', login.signOut);
router.post('/login/signIn', login.signIn);
router.post('/login/signUp', login.signUp);
router.get('/login/checkPhone', login.checkPhone);
router.get('/login/checkEmail', login.checkEmail);
router.get('/login/verify', login.verifyMail);
module.exports = router;

//微信模块
router.get('/weixin', weixin.checkSignature);
router.post('/weixin', weixin.weixinEvent);