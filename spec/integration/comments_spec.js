const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

    beforeEach((done) => {

        this.user;
        this.topic;
        this.post;
        this.comment;

        sequelize.sync({ force: true }).then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
                .then((user) => {
                    this.user = user;

                    Topic.create({
                        title: "Expeditions to Alpha Centauri",
                        description: "A compilation of reports from recent visits to the star system.",
                        posts: [{
                            title: "My first visit to Proxima Centauri b",
                            body: "I saw some rocks.",
                            userId: this.user.id
                        }]
                    }, {
                            include: {
                                model: Post,
                                as: "posts"
                            }
                        })
                        .then((topic) => {
                            this.topic = topic;
                            this.post = this.topic.posts[0];

                            Comment.create({
                                body: "ay caramba!!!!!",
                                userId: this.user.id,
                                postId: this.post.id
                            })
                                .then((comment) => {
                                    this.comment = comment;
                                    done();
                                })
                                .catch((err) => {
                                    console.log(err);
                                    done();
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
        });
    });

    //start guests comments test 
    describe("guest attempting to perform CRUD actions for Comment", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0
                }
            },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

            it("should not create a new comment", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };
                request.post(options,
                    (err, res, body) => {

                        Comment.findOne({ where: { body: "This comment is amazing!" } })
                            .then((comment) => {
                                expect(comment).toBeNull();   // ensure no comment was created
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should not delete the comment with the associated ID", (done) => {
                Comment.findAll()
                    .then((comments) => {
                        const commentCountBeforeDelete = comments.length;

                        expect(commentCountBeforeDelete).toBe(1);

                        request.post(
                            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                Comment.findAll()
                                    .then((comments) => {
                                        expect(err).toBeNull();
                                        expect(comments.length).toBe(commentCountBeforeDelete);
                                        done();
                                    })

                            });
                    })
            });
        });
    });
    //end guest comment test

    //start signed in user test
    describe("signed in user performing CRUD actions for Comment", () => {

        beforeEach((done) => {
            this.altUser;
            this.altComment;

            User.create({
                email: "alt@email.com",
                password: "123456",
                comments: [{
                    body: "hi there",
                    postId: this.post.id
                }]
            }, {
                    include: {
                        model: Comment,
                        as: "comments"
                    }
                })
                .then((altUser) => {
                    this.altUser = altUser;
                    this.altComment = altUser.comments[0];

                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                            role: "member",
                            userId: this.user.id
                        }
                    },
                        (err, res, body) => {
                            done();
                        }
                    );
                })
        });


        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

            it("should create a new comment and redirect", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };
                request.post(options,
                    (err, res, body) => {
                        Comment.findOne({ where: { body: "This comment is amazing!" } })
                            .then((comment) => {
                                expect(comment).not.toBeNull();
                                expect(comment.body).toBe("This comment is amazing!");
                                expect(comment.id).not.toBeNull();
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

            it("should delete the comment with the associated ID", (done) => {

                Comment.findAll()
                    .then((comments) => {
                        const commentCountBeforeDelete = comments.length;

                        expect(commentCountBeforeDelete).toBe(2);

                        request.post(
                            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                expect(res.statusCode).toBe(302);
                                Comment.findAll()
                                    .then((comments) => {
                                        expect(err).toBeNull();
                                        expect(comments.length).toBe(commentCountBeforeDelete - 1);
                                        done();
                                    })

                            });
                    })

            });

            it("should not delete another members comment", (done) => {

                Comment.findAll()
                    .then((comments) => {

                        const commentCountBeforeDelete = comments.length;

                        expect(commentCountBeforeDelete).toBe(2);

                        request.post(
                            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.altComment.id}/destroy`,
                            (err, res, body) => {
                                Comment.findAll()
                                    .then((comments) => {
                                        expect(err).toBeNull();
                                        expect(comments.length).toBe(commentCountBeforeDelete);
                                        done();
                                    })
                            });
                    })
            });
        });

        //end signed in user test     
    });

    //start admin user test

    describe("admin performing CRUD actions for Comments", () => {
        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: "admin"
                }
            },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:commentId/destroy", () => {

            it("should be able to delete other user's comments", (done) => {

                Comment.findAll()
                    .then((comments) => {
                        expect(comments[0].id).toBe(1);
                        request.post(
                            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                Comment.findById(1)
                                    .then((comment) => {
                                        expect(err).toBeNull();
                                        expect(comment).toBeNull();
                                        done();
                                    });
                            }
                        );
                    });
            });
        });

    });
    //end admin user test 

});


