const express = require('express');
const router = express.Router();
const check_auth = require('../middleware/check_auth');
const userController = require('../controllers/user');

router.get('/:id', check_auth, userController.get_user_by_id);

router.get('/', check_auth, userController.get_all_users);

router.post('/sign_up', userController.sign_up);

router.post('/login', userController.login);

module.exports = router
