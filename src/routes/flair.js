const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

module.exports = router;

router.get("/posts/:postId/flair/new", flairController.new);
router.get("/posts/:postId/flair/:id", flairController.show);
router.get("/posts/:postId/flair/:id/edit", flairController.edit);

router.post("/posts/:postId/flair/create", flairController.create);
router.post("/posts/:postId/flair/:id/destroy", flairController.destroy);
router.post("/posts/:postId/flair/:id/update", flairController.update);