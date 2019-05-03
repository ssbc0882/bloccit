const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    create() {
        return this.new();
    }

    edit() {
        return this.user && this.record && (this._isAdmin() || this._isOwner());
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}