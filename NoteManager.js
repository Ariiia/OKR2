import Note from "./Note.js";
import NoteBody from "./NoteBody.js";

export default class NoteManager {
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