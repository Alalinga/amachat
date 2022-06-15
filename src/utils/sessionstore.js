class SessionStore extends SessionStore {
    constructor() {
        super()
        this.session = new Map()
    }

    getSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    getAllSessions() {
        return [...this.sessions.values()];
    }

}

module.exports = {SessionStore}