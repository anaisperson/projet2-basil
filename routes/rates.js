const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');
const RateHistory = require('../models/RateHistory');
const mongoose = require('mongoose');

router.post('/', async function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }

    const user = req.session.user;
    const options = { upsert: true, new: true };
    const data = req.body;

    for (let [name, value] of Object.entries(data)) {
        let toUpdateOrCreate = { title: name, rate: value, user: user };
        Rate.findOneAndUpdate({ user: user, title: name }, toUpdateOrCreate, options)
            .then()
            .catch(err => {
                return res.status(500).send({ message: err });
            });
    };

    // Rate History
    const history = RateHistory({
        mindHistory: data.mind,
        bodyHistory: data.body,
        soulHistory: data.soul,
        user: user,
    });
    history.save()
        .then()
        .catch(err => {
            return res.status(500).send({ message: `On history : ${err}` });
        });

    res.redirect('/users/profile');
});

module.exports = router;