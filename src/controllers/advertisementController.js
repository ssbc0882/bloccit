const advertisementQueries = require("../db/queries.advertisements.js");

module.exports = {
    index(req, res, next) {

        advertisementQueries.getAllAds((err, advertisements) => {

            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("advertisements/index", { advertisements });
            }
        })
    },

    new(req, res, next) {
        res.render("advertisements/new");
    },

    create(req, res, next) {
        let newAd = {
            title: req.body.title,
            description: req.body.description
        };

        advertisementQueries.createAd(newAd, (err, advertisements) => {
            if (err) {
                res.redirect(500, "/advertisements/new");
            } else {
                res.redirect(303, `/advertisements/${advertisements.id}`);
            }
        });
    },

    show(req, res, next) {

        advertisementQueries.getAd(req.params.id, (err, advertisements) => {

            if (err || advertisements == null) {
                res.redirect(404, "/");
            } else {
                res.render("advertisements/show", { advertisements });
            }
        });
    },

    edit(req, res, next) {
        advertisementQueries.getAd(req.params.id, (err, advertisements) => {
            if (err || topic == null) {
                res.redirect(404, "/");
            } else {
                res.render("advertisements/edit", { advertisements });
            }
        });
    },

    update(req, res, next) {

        advertisementQueries.updateAd(req.params.id, req.body, (err, advertisements) => {

            if (err || advertisements == null) {
                res.redirect(404, `/advertisements/${req.params.id}/edit`);
            } else {
                res.redirect(`/advertisements/${advertisements.id}`);
            }
        });
    },

    destroy(req, res, next) {

        advertisementQueries.deleteAd(req.params.id, (err, advertisements) => {
            if (err) {
                res.redirect(500, `/advertisements/${advertisements.id}`)
            } else {
                res.redirect(303, "/advertisements")
            }
        });
    }
}