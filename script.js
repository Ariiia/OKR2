import NoteManager from "./NoteManager.js";


let noteManager = new NoteManager({
    el: document.querySelector('.left-bar-nav'),
    noteBody: document.querySelector('.note-body'),
    notes: localDB().sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    })
})

function localDB(){
    let notes=[];
    for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);
        if (key === 'loglevel:webpack-dev-server')
            continue;

        let raw = localStorage.getItem(key);
        notes.unshift(JSON.parse(raw));
    }
    return notes;

}



document.getElementById("add-button").onclick=function(){
    let newNote=AddNote();
    localStorage.setItem(newNote.id, JSON.stringify(newNote));

};

(function () {
    window.addEventListener('hashchange', () => onRouteChange());
    if (window.location.hash){
        if (!loadContent(window.location.hash.substring(1)))
            history.pushState(null, null, '/');
    }

    noteManager.renderNotes();

    let newNoteBtn = document.getElementById('add-button');

    newNoteBtn.onclick = () => {
        noteManager.addNote({
            id: '_' + Math.random().toString(36).substr(2, 9),
            title: "",
            body: "",
            date: new Date()
        })
    };
})();


noteManager.onNewNote = (note)=>{
    localStorage.setItem(note.id, JSON.stringify({id:note.id,
         title:note.title,
         body:note.body,
         date:note.date}));
};

noteManager.onEditNote = (note) => {
    localStorage.setItem(note.id, JSON.stringify({id:note.id,
        title:note.title,
        body:note.body,
        date:note.date}));
};

noteManager.onRemoveNote = (note) => {
    localStorage.removeItem(note.id);
};



function onRouteChange() {
    let hashLocation = window.location.hash.substring(1);

    if (!loadContent(hashLocation))
        history.pushState(null, null, '/');
}

function loadContent(hash) {
    let t = noteManager.notes;
    for (let i = 0; i < t.length; i++) {
        if (t[i].id === hash) {
            noteManager.onShowNote(t[i]);
            return true;
        }
    }
return false;
}