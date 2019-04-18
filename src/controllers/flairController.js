const flairQueries = require("../db/queries.flair.js");

module.exports = {

    new(req, res, next) {
        res.render("flair/new", { postId: req.params.postId });
    },

    create(req, res, next) {
        let newFlair = {
            name: req.body.name,
            color: req.body.body,
            postId: req.params.postId
        };
        flairQueries.addFlair(newFlair, (err, flair) => {
            if (err) {
                res.redirect(500, "/flair/new");
            } else {
                res.redirect(303, `/posts/${newFlair.postId}/flair/${flair.id}`);
            }
        })
    },

    show(req, res, next) {
        flairQueries.getFlair(req.params.id, (err, flair) => {
            if (err || flair == null) {
                res.redirect(404, "/");
            } else {
                res.render("flair/show", { flair })
            }
        })
    },

    destroy(req, res, next) {
        flairQueries.deleteFlair(req.params.id, (err, deletedRecordsCount) => {
            if (err) {
                res.redirect(500, `/posts/${req.params.postId}/flair/${req.params.id}`);
            } else {
                res.redirect(303, `/posts/${req.params.postId}`);
            }
        })
    },

    edit(req, res, next) {
        flairQueries.getFlair(req.params.id, (err, flair) => {
            if (err || flair == null) {
                res.redirect(404, "/");
            } else {
                res.render("flair/edit", { flair });
            }
        })
    },

    update(req, res, next) {
        flairQueries.updateFlair(req.params.id, req.body, (err, flair) => {
            if (err || flair == null) {
                res.redirect(404, `/posts/${req.params.postId}/flair/${req.params.id}/edit`);
            } else {
                res.redirect(`/posts/${req.params.postId}/flair/${req.params.id}`)
            }
        })
    }
}