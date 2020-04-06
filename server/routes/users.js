const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");

router.post("/signup", function(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const newUser = User(req.body);
    newUser.save()
        .then((user) => {
            if (user !== newUser) {
                res.status(500).send({ message: 'Error on user signup !' });
                return;
            }
            res.status(200).send(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: 'System error on signup !' });
        });
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

            res.send({ message: "The username and password combination is correct!" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: 'System error on login !' });
        });
});

router.get("/logout", function(req, res, next) {});

router.get("/profile", function(req, res, next) {});

module.exports = router;