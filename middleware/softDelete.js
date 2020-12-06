var softDelete = {};

softDelete.filterDeletedSpots = function(campgrounds) {
    const filteredCampgrounds = [];
    campgrounds.forEach(function (campground) {
        if (!campground.deleted) {
            filteredCampgrounds.push(campground);
        }
    });
    return filteredCampgrounds;
}

module.exports = softDelete
