var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var User = require("../models/user");

router.get("/", function(req, res){
	var noMatch = null;
	const conditions = {};
	const category = req.query.category;
	if (category != 'all') {
		conditions.category = category;
	}
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		conditions.description = regex;
		Campground.find(conditions, function(err, allcampgrounds){
			if(err){
				console.log(err);
			} else {
				if(allcampgrounds.length < 1) {
					noMatch = "No spots match that query, please try again.";
				}
				res.render("campgrounds/index", {campgrounds: allcampgrounds, noMatch: noMatch});
			}
		});
	} else {
		Campground.find(conditions, function(err, allcampgrounds){
			if(err){
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allcampgrounds, noMatch: noMatch});
			}
		});
	}
});

router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from the form and add to campsgrounds array
	var name = req.body.name;
	const category = req.body.category;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}	
	var newCampground = {name: name, category: category, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})
	
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground, User : User});
		}
	})
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground : foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;