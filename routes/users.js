var express = require("express");
var bcrypt = require("bcryptjs");
var passport = require("passport");
var { ensureNotAuthenticated } = require("../config/auth");
var router = express.Router();

var con = require("../config/db");

// Get request for login page
router.get("/login", ensureNotAuthenticated, function(req, res) {
	res.render("login");
});

// Get request for user registration page
router.get("/register", ensureNotAuthenticated, function(req, res) {
	res.render("register");
});

// Post request for inserting User details into the database
router.post("/register", function(req, res) {
	// res.send(JSON.stringify(req.body));
	// Form field values
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var cpassword = req.body.password2;

	var errors = [];

	// Check for required fields
	if(!name || !email || !password || !cpassword) {
		errors.push({ msg: "Please fill in all the fields" });
	}

	// Check password length
	if(password.length < 6) {
		errors.push({ msg: "Password should be atleast 6 characters" });
	}

	// Check passwords match
	if(password !== cpassword) {
		errors.push({ msg: "Passwords do not match" });
	}

	if(errors.length > 0) {
		res.render("register", {
			errors: errors,
			name: name,
			email: email,
			passwrod: password,
			password2: cpassword
		});
	} else {
		con.query("SELECT * FROM users where email = ?", [email], function(err, rows) {
			if (!err)
				if(rows.length > 0) {
					// User exists
					errors.push({ msg: "Email is already registered" });
					res.render("register", {
						errors: errors,
						name: name,
						email: email,
						passwrod: password,
						password2: cpassword
					});
				} else {
					// User does not exists
					// Hash Password
					bcrypt.genSalt(10, (err, salt) => 
						bcrypt.hash(password, salt, (err, hashPass) => {
							// If there is an error while hasing the password
							if(err) throw err;

							// Else insert the new user into the database
							con.query("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, hashPass], (error, user) => {
								if (!error) {
									req.flash("success_msg", "You are now registered and can login");
									res.redirect("/users/login");
								}
								else {
									console.log("Query failed \n Error " + JSON.stringify(error, undefined, 2));
								}
							});
						})
					);
				}
			else
				console.log('ERROR: ', err);
		});
	}
});

// Post request for user login
router.post("/login", function(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});

// Logout handle
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});

module.exports = router;

