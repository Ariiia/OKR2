export default class Routing {
    constructor(noteManager) {
        window.addEventListener('hashchange', () => this.onRouteChange());
        this.noteManager = noteManager;

        if (window.location.hash){
            if (!this.loadContent(window.location.hash.substring(1)))
                history.pushState(null, null, '/');
        }
    }

    onRouteChange() {
        let hashLocation = window.location.hash.substring(1);

        if (!this.loadContent(hashLocation))
            history.pushState(null, null, '/');
    }

    loadContent(hash) {
        let t = this.noteManager.notes;
        for (let i = 0; i < t.length; i++) {
            if (t[i].id === hash) {
                this.noteManager.onShowNote(t[i]);
                return true;
            }
        }
        return false;
    }
}