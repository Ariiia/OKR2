
class Note {
    constructor({id, title, date, body}, noteManager) {
        this.el = null;

        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.body = body;

        this.notesManager = noteManager;
    }

    html() {
        return `
        <li class="nav-note" id='${this.id}'>
            <button class="remove-button"><img src="images/del.png"></button>
            <div class = 'note_name'>${this.title}</div>
            <div class = 'note_time'>${this.date.toLocaleDateString('en-US')}</div>
        </li>`
    }

    inEvents() {
        let btnRemove = this.el.querySelector('.remove-button');
     
        btnRemove.onclick = () => {
            this.notesManager.removeNote(this);

        }

        this.el.addEventListener('click', (e) => {
            if (e.target !== btnRemove[0])
                this.notesManager.onShowNote(this);
        });

    }

    putInPage() {
        let htmlBuffer = this.html();
        let list = document.createElement('li');
        list.innerHTML = htmlBuffer;

        this.el = list.children[0];

        this.inEvents();

        return this.el
    }
}

class NoteBody {
    constructor(note, noteManager) {
        this.el = null;

        this.note = note;
        this.date = new Date();
        this.notesManager = noteManager;
    }

    html(){
        return `
        <div class = 'note-body'>
            <div class = 'note-body-time'>${this.date.toLocaleString('en', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
            <div class = 'note-body-text'>
                <textarea class="note-title" type="text" maxlength = 18
                 placeholder="Type note name here" 
                contenteditable="true">${this.note.title}</textarea>
                <textarea class="note-textarea" placeholder="Type your text here"
                 contenteditable="true">${this.note.body}</textarea>
            </div>
        </div>`;
    }

    inEvents() {
        let titleField = this.el.querySelector('.note-title');
        let bodyField = this.el.querySelector('.note-textarea');

        titleField.addEventListener('input', ()=>  {
            this.notesManager.onEditTitle(this.note);
        });

        bodyField.addEventListener('input', ()=> {
            this.notesManager.onEditBody(this.note);
        });
    }

    putInPage() {
        let htmlBuffer = this.html();
        let div = document.createElement('div');
        div.innerHTML = htmlBuffer;
        this.el = div.children[0];

        this.inEvents();

        return this.el
    }
}

class NoteManager {
    constructor ({el, noteBody, notes}) {
        this.el = el;
        this.noteBody = noteBody;

        this.notes = notes.map(note => new Note(note, this));
        this.currentNote = null;

        this.updateNotes();

        this.onNewNote =()=>{};
        this.onEditNote =()=>{};
        this.onRemoveNote =()=>{};

    }

    updateNotes() {
        this.el.innerHTML = '';
        this.notes.forEach(note => this.renderNote(note.putInPage()));
    }

    renderNote(note) {
        this.el.append(note);
    }

    removeNote(note) {

        this.notes.splice(this.notes.indexOf(note), 1);
        this.onRemoveNote(note);

        if (this.currentNote === note) {
            this.currentNote = null;
        }
        this.updateNotes();

    }

    onShowNote(note) {
        this.updateNotes();
        this.currentNote = note;
        history.pushState(null, null, ('#' + note.id));

        let editField = new NoteBody(note, this);
        let newEd = editField.putInPage();

        this.noteBody.replaceWith(newEd);
        this.noteBody = newEd;

        let choosenNote = document.getElementById(note.id);
        choosenNote.style.backgroundColor = '#a3d1ae';
    }

    onEditTitle(note) {
        note.title = this.noteBody.querySelector('.note-title').value;
        note.date = new Date();
        this.updateNotes();
        this.onEditNote(note);

        let choosenNote = document.getElementById(note.id);
        choosenNote.style.backgroundColor = '#a3d1ae';
    }

    onEditBody(note) {
        note.body = this.noteBody.querySelector('.note-textarea').value;
        note.date = new Date();
        this.updateNotes();
        this.onEditNote(note);

        let choosenNote = document.getElementById(note.id);
        choosenNote.style.backgroundColor = '#a3d1ae';
    }

    addNote(note) {
        const objNote = new Note(note, this);
        this.notes.unshift(objNote);

        this.updateNotes();
        this.onNewNote(objNote);
        this.onShowNote(objNote);
    }
}



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

(function () {
    window.addEventListener('hashchange', () => onRouteChange());
    if (window.location.hash){
        if (!loadContent(window.location.hash.substring(1)))
            history.pushState(null, null, '/');
    }

    noteManager.updateNotes();

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