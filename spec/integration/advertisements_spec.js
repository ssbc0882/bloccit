const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";

const sequelize = require("../../src/db/models/index").sequelize;
const Advertisements = require("../../src/db/models").Advertisements;

describe("routes : advertisements", () => {

    beforeEach((done) => {
        this.advertisements;
        sequelize.sync({ force: true }).then((res) => {

            Advertisements.create({
                title: "JS Frameworks",
                description: "There is a lot of them"
            })
                .then((advertisements) => {
                    this.advertisements = advertisements;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("GET /advertisements", () => {

        it("should return status code 200 and all advertisements", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Advertisements");
                expect(body).toContain("JS Frameworks");
                done();
            });

        });
    });

    describe("GET /advertisements/new", () => {

        it("should render a new ad form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Ad");
                done();
            });
        });
    });

    describe("GET /advertisements/:id", () => {

        it("should render a view with the selected ad", (done) => {
            request.get(`${base}${this.advertisements.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("JS Frameworks");
                done();
            });
        });

    });

    describe("GET /advertisements/:id/edit", () => {

        it("should render a view with an edit ad form", (done) => {
            request.get(`${base}${this.advertisements.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Advertisement");
                expect(body).toContain("JS Frameworks");
                done();
            });
        });

    });

    describe("POST /advertisements/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "blink-182 songs",
                description: "What's your favorite blink-182 song?"
            }
        };

        it("should create a new advertisement and redirect", (done) => {

            request.post(options, (err, res, body) => {
                Advertisements.findOne({ where: { title: "blink-182 songs" } })
                    .then((advertisements) => {
                        expect(res.statusCode).toBe(303);
                        expect(advertisements.title).toBe("blink-182 songs");
                        expect(advertisements.description).toBe("What's your favorite blink-182 song?");
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

    describe("POST /advertisements/:id/destroy", () => {

        it("should delete the ad with the associated ID", (done) => {


            Advertisements.findAll()
                .then((advertisements) => {

                    const adCountBeforeDelete = advertisements.length;

                    expect(adCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.advertisements.id}/destroy`, (err, res, body) => {
                        Advertisements.findAll()
                            .then((advertisements) => {
                                expect(err).toBeNull();
                                expect(advertisements.length).toBe(adCountBeforeDelete - 1);
                                done();
                            })

                    });
                });

        });

    });

    describe("POST /advertisements/:id/update", () => {

        it("should update the ad with the given values", (done) => {
            const options = {
                url: `${base}${this.advertisements.id}/update`,
                form: {
                    title: "JavaScript Frameworks",
                    description: "There are a lot of them"
                }
            };

            request.post(options, (err, res, body) => {

                expect(err).toBeNull();

                Advertisements.findOne({
                    where: { id: this.advertisements.id }
                })
                    .then((advertisements) => {
                        expect(advertisements.title).toBe("JavaScript Frameworks");
                        done();
                    });
            });
        });

    });
});




