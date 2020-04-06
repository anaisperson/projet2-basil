const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");

router.get("/signup", function(req, res, next) {
    res.render('signup', { error: req.query.error });
});

router.post("/signup", function(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const verifMail = User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                const error = encodeURIComponent('This email is already used !');
                res.redirect(`/users/signup?error=${error}`);
            }
        });

    const newUser = User(req.body);
    newUser.save()
        .then((user) => {
            if (user !== newUser) {
                const error = encodeURIComponent('Error on user signup !');
                res.redirect(`/users/signup?error=${error}`);
            }
            res.redirect('/users/login');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: 'System error on signup !' });
        });
});

router.get("/login", function(req, res, next) {
    res.render('login');
});

router.post("/login", function(req, res, next) {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(400).send({ message: "This email does not exist" });
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).send({ message: "The password is invalid" });
            }

            req.session.user = user;
            res.redirect('/users/profile');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: 'System error on login !' });
        });
});

router.get("/logout", function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get("/profile", function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/users/login');
    }

    res.render('dashboard', { user: req.session.user });
});

module.exports = router;