var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");

var con = require("./config/db");

var app = express();

// Passport config
require("./config/passport")(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

var PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server started on port " + PORT));