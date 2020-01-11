var LocalStrategy = require("passport-local").Strategy;
var con = require("./db");
var bcrypt = require("bcryptjs");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email"}, function (email, password, done) {
            // Match user
            con.query("SELECT * FROM users where email = ?", [email], function(err, rows) {
                if(!err) {
                    if(rows.length > 0) {
                        var user = rows[0];
                        // Match password
                        bcrypt.compare(password, user.password, function(err, isMatch) {
                            if(err) throw err;

                            if(!isMatch)
                                return done(null, false, { message: "Incorrect password" });
                            else
                                return done(null, user);
                        });
                    } else {
                        return done(null, false, { message: "User with the given email id does not exists" });
                    }
                } else {
                    console.error(err);
                }
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        con.query("SELECT * FROM users where id = ?", [id], function(err, rows) {
            var user = rows[0];
            done(err, user);
        });
    });
};