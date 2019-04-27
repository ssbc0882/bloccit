const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    create() {
        return this.new();
    }

    edit() {
        return this._isAdmin() || this._isOwner();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}