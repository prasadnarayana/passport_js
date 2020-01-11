module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            console.log("authenticated function");
            return next();
        }

        req.flash("error_msg", "Please login to view this resource");
        res.redirect("/users/login");
    },

    ensureNotAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            console.log("not authenticated function");
            return res.redirect("/dashboard");
        }

        next();
    }
};