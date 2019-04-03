const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const marcoPolo = "http://localhost:3000/marco";

describe("routes : static", () => {

    describe("GET /", () => {

        it("should return status code 200", (done) => {

            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);

                done();
            });
        });
    });

    describe("GET /", () => {
        it('should return status code 200', (done) => {

            request.get(marcoPolo, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                done();
            });
        });
        it("should return the string Polo", (done) => {
            request.get(marcoPolo, (err, res, body) => {
                expect(body).toBe("Polo");
                done();
            });
        });
    });
});