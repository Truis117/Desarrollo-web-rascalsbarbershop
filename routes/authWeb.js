const express = require('express');
const router = express.Router();
const webAuthController = require('../controllers/webAuthController');
console.log('Loading authWeb routes');

router.get('/login', webAuthController.showLogin);
console.log('auth route GET /login registered');
router.post('/login', webAuthController.postLogin);
console.log('auth route POST /login registered');

router.get('/register', webAuthController.showRegister);
console.log('auth route GET /register registered');
router.post('/register', webAuthController.postRegister);
console.log('auth route POST /register registered');

router.post('/logout', webAuthController.postLogout);
console.log('auth route POST /logout registered');

module.exports = router;
