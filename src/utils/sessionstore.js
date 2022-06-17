// const sessionstore = require("sessionstore");
class SessionStore {
    getSession(id) {}
    saveSession(id, session) {}
    getAllSessions() {}
  }
class StoreSessions extends SessionStore{
    constructor() {
        super()
        this.session = new Map()
    }

    getSession(userId) {
        return this.session.get(userId);
    }

    saveSession(user, session) {
        this.session.set(user, session);
    }

    getAllSessions() {
        return [...this.session.values()];
    }

}

module.exports = {StoreSessions}