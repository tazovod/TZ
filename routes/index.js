const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth'); 

//Стартовая страница
router.get('/', (req, res) => res.render('register'));
//Личный кабинет
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));


module.exports = router;
