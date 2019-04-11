module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const rulesRoutes = require("../routes/rules");

        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(rulesRoutes);
    }
}