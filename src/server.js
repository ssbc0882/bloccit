const app = require("./app");
const http = require("http");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("listening", () => {

    console.log(`server is listening for requests on ${server.address().port}`);
});