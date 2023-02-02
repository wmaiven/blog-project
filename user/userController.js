const { Router } = require('express');
const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(user => {
        res.render('../views/adm/users/users', {
            user:user
        })
    })
})
router.get('/admin/users/create', (req, res) => {
    User.findAll().then(user => {
        res.render('../views/adm/users/create', {
            user: user
            });
    })
})
router.post('/users/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var verifiemail;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {
            verifiemail = true;
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash,
                verifiemail: verifiemail
            }).then(() => {
                res.redirect('/admin/users');
            })

        } else {
            res.send('email has been registrated')
        }
    })
   
})

router.get("/login", (req, res) => {
    res.render('../views/adm/users/login');
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {
            var validation = bcrypt.compareSync(password, user.password);
            if (validation) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.send("senha invalida");
            }

        } else {
            res.send("conta não registrada");
        }
    })

})
router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})



module.exports = router;
