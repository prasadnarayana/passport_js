var express = require("express");
var { ensureAuthenticated } = require("../config/auth");
var router = express.Router();

// Get request to index page
router.get("/", function(req, res) {
	res.render("welcome");
});

// Get request to dashboard page
router.get("/dashboard", ensureAuthenticated, function(req, res) {
	res.render("dashboard", {
		name: req.user.name
	});
});

module.exports = router;
