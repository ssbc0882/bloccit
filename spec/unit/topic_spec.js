const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        sequelize.sync({ force: true }).then((res) => {

            Topic.create({
                title: "Expeditions to Alpha Centauri",
                description: "A compilation of reports from recent visits to the star system."
            })
                .then((topic) => {
                    this.topic = topic;

                    Post.create({
                        title: "The better gaming consoles",
                        body: "Separate the console rankings by decade",
                        topicId: this.topic.id
                    })
                        .then((post) => {
                            this.post = post;
                            done();
                        })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })
    })

    describe("#create()", () => {

        it("should create a new topic with a title and description", (done) => {

            Topic.create({
                title: "Build your own personal computer",
                description: "Pay someone else to do it.",
            })
                .then((topic) => {

                    expect(topic.title).toBe("Build your own personal computer");
                    expect(topic.description).toBe("Pay someone else to do it.");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a topic with missing title or description", (done) => {
            Topic.create({
                title: "Build your own personal computer",
                description: "Pay someone else to do it"
            })
                .then((post) => {

                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Topic.title cannot be null");
                    expect(err.message).toContain("Topic.description cannot be null");
                    done();
                })
        })

    });

    describe("#getPosts()", () => {

        it("should return an array of posts with the associated topic", (done) => {

            this.topic.getPosts()
                .then((posts) => {
                    expect(posts[0].title).toBe("The better gaming consoles");
                    done();
                });
        });
    });
})