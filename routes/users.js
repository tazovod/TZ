const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Модель пользователя
const User = require('../models/User')

//login страница
router.get('/login', (req, res) => res.render('login'));

//Register страница
router.get('/register', (req, res) => res.render('register'));

// Register проверки
router.post('/register', (req, res) => 
{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Проверка полей
    if(!name || !email || !password || !password2) 
    {
        errors.push({ msg: 'Заполните все поля' });
    }
    
    // Проверка пароля
    if(password !== password2)
    {
        errors.push({msg: ' Пароли не совпадают ' });    
    }
    // Проверка длины пароля Тут ошибка, не робит
    /*
    if(password.lenght < 8)
    {
        //console.log(password);
        errors.push({ msg: 'Пароль меньше 6 символов' });
    }*/

    if(errors.length > 0) 
    {
        res.render('register', 
        {
            errors,
            name,
            email,
            password,
            password2
        });
    } 
    else 
    {
        //Проверка пароля
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    errors.push({ msg: 'Почта уже зарегистрирована' });
                    res.render('register',
                    {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else 
                {
                    const newUser = new User(
                    {
                        name,
                        email,
                        password
                    });

                    // Хеширование пароля
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) =>
                            {
                            if(err) throw err;
                            // Установка пароля для хеширования
                            newUser.password = hash;
                            // Сохранение пользователя
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Теперь вы заригестрированы и можете войти в систему');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                            }))
                }
            });
    }
    
});

//Login 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Вы вышли из системы');
    res.redirect('/users/login');
})

module.exports = router;
