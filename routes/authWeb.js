const express = require('express');
const router = express.Router();
const webAuthController = require('../controllers/webAuthController');

router.get('/login', webAuthController.showLogin);
router.post('/login', webAuthController.postLogin);

router.get('/register', webAuthController.showRegister);
router.post('/register', webAuthController.postRegister);

router.post('/logout', webAuthController.postLogout);

module.exports = router;
