const Advertisements = require("./models").Advertisements;

module.exports = {

    getAllAds(callback) {
        return Advertisements.findAll()

            .then((advertisements) => {
                callback(null, advertisements)
            })
            .catch((err) => {
                callback(err);
            })
    },

    createAd(newAd, callback) {
        return Advertisements.create({
            title: newAd.title,
            description: newAd.description
        })
            .then((advertisements) => {
                callback(null, advertisements);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getAd(id, callback) {
        return Advertisements.findByPk(id)
            .then((advertisements) => {
                callback(null, advertisements);
            })
            .catch((err) => {
                callback(err);
            })
    },

    deleteAd(id, callback) {
        return Advertisements.destroy({
            where: { id }
        })
            .then((advertisements) => {
                callback(null, advertisements);
            })
            .catch((err) => {
                callback(err);
            })
    },

    updateAd(id, updatedAd, callback) {
        return Advertisements.findById(id)

            .then((advertisements) => {
                if (!advertisements) {
                    return callback("Advertisements not found");
                }

                advertisements.update(updatedAd, {
                    fields: Object.keys(updatedAd)
                })
                    .then(() => {
                        callback(null, advertisements);
                    })
                    .catch((err) => {
                        callback(err);
                    });
            });
    }

}