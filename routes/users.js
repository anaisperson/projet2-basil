const express = require("express");
const router = express.Router();
const User = require("../models/User");

const login_style = "stylesheets/login.css";
const signup_style = "stylesheets/signup.css";
const dashboard_style = "stylesheets/index2.css";

const styles = ["stylesheets/stylesheet.css"];

/* /users/ */
router.get("/", function(req, res, next) {
  console.log(req.session);
  if (req.session.currentUser) {
    res.redirect("/users/dashboard");
  } else {
    res.redirect("/users/login");
  }

  res.status(200).render("login", { style: login_style });

  // UserModel.find(function(err, usersList) {
  //   res.render('index', {title: usersList}, function (err, html) {
  //     res.send(html)
  //   })
  // });
});

// SIGNUP
router.get("/new", function(req, res, next) {
  res.render("signup");
});

// router.post("/new") à créer pour ajouter de nouveaux users

// LOGIN
router.get("/login", function(req, res, next) {
  // if (req.session.currentUser) {
  //   res.status(200).render('dashboard', {style: dashboard_style});
  // }
  res.render("login");
});

router.post("/login", function(req, res, next) {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.redirect("/users/login");
    return;
  }

  res.redirect("/users/dashboard");

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login");
      }
    })
    .catch(error => {
      next(error);
    });
});

// DASHBOARD
router.get("/dashboard", function(req, res, next) {
  res.status(200).render("dashboard", { style: dashboard_style });
});

module.exports = router;
