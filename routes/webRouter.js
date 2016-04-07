var express = require('express');
var login = require('../controllers/login.js');
var index = require('../controllers/index.js');
var weixin = require('../controllers/weixin.js');
var info = require('../controllers/info.js');
var book = require('../controllers/book.js');
var backstage = require('../controllers/backstage.js');
var multiparty = require('connect-multiparty')();
var router = express.Router();
//首页模块
router.get('/', index.showIndex);
router.post('/index/userMessage', multiparty , index.userMessage);
router.get('/index/userMessage', index.getUserMessage);
router.post('/index/addGood', index.addGood);
router.post('/index/addComment', index.addComment);
router.get('/index/getComment', index.getComment);
router.post('/index/retransmission', index.retransmission);
//注册登陆模块
router.get('/login', login.showLogin);
router.get('/login/signOut', login.signOut);
router.post('/login/signIn', login.signIn);
router.post('/login/signUp', login.signUp);
router.get('/login/checkPhone', login.checkPhone);
router.get('/login/checkEmail', login.checkEmail);
router.get('/login/verify', login.verifyMail);
router.post('/login/findVerify', login.findVerify);
router.post('/login/verifyIdentityCode', login.verifyIdentityCode);
router.post('/login/modifyPassword', login.modifyPassword);

//微信模块
router.get('/weixin', weixin.checkSignature);
router.post('/weixin', weixin.weixinEvent);

//详情模块
router.get('/info', info.showInfo);
router.get('/info/showDetails', info.showDetails);

//书库模块
router.get('/book_center', book.showCenter);
router.get('/book_details', book.book_details);

//后台模块
router.get('/backstage', backstage.showBackstage);

module.exports = router;
