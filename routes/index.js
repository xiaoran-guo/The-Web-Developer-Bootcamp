var express = require("express");
var router = express.Router();
var passport = require("passport");
var	User = require("../models/user");
var Campground = require("../models/campground");

router.get("/", function(req, res){
	res.render("landing");
});

// AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser= new User({username: req.body.username});
	if(req.body.adminCode === 'secretcode'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if (err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

router.post("/register/checkUsernameBeenUsed", function (req, res) {
	const username = req.body.username;
	User.find({username: username}, function (err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json({valid: users.length === 0});
		}
	})
})

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

router.get("/favorite/:id", function(req, res){
	var noMatch = null;
	User.findById(req.params.id, function(err, curUser){
	   	Campground.find({_id : {$in : curUser.favorites}}, function(err, allcampgrounds){
			if(err){
				console.log(err);
			} else {
				res.render("favorites/index", {campgrounds: allcampgrounds, noMatch: noMatch});
			}
		});
	});
});

router.post("/favorite/:id", function(req, res){
   	// console.log(req.body.campgroundId);
	User.findById(req.params.id, function(err, foundUser){
		if (!foundUser.favorites.includes(req.body.campgroundId)) {
			foundUser.favorites.push(req.body.campgroundId);
			foundUser.save();
	    }
	    res.status(204).send();
	});
});

router.delete("/favorite/:id", function(req, res){
	console.log("1234568");
	User.findOneAndUpdate({_id : req.params.id}, {"$pull" : { "favorites" : req.body.campgroundId}}, function(err,status){
		console.log("1234567");
		res.redirect("/favorite/" + req.params.id);
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;