import NoteManager from "./NoteManager.js";
import Routing from "./Routing.js";


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
    new Routing(noteManager);
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
function make_json_note({id, title, body, date}) {
    return {
        id,
        title,
        body,
        date
    }
}

noteManager.onNewNote = (note)=>{
    localStorage.setItem(note.id, JSON.stringify(make_json_note(note)));
};

noteManager.onEditNote = (note) => {
    localStorage.setItem(note.id, JSON.stringify(make_json_note(note)));
};

noteManager.onRemoveNote = (note) => {
    localStorage.removeItem(note.id);
};

