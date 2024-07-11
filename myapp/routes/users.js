var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController')
var { createUserTable } = require('../model/userModel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

createUserTable()
router.post('/login', authController.login);
router.post('/signUp', authController.signUp);


module.exports = router;

