const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/auth/signup', userController.createUser);
router.post('/auth/login', userController.getUsers);
router.put('/auth/:id', userController.updateUser);
router.delete('/auth/:id', userController.deleteUser);  

module.exports = router;
