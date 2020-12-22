export default class NoteBody {
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

    attachEventListeners() {
        let titleField = this.el.querySelector('.note-title');
        let bodyField = this.el.querySelector('.note-textarea');

        titleField.addEventListener('input', ()=>  {
            this.notesManager.onEditTitle(this.note);
        });

        bodyField.addEventListener('input', ()=> {
            this.notesManager.onEditBody(this.note);
        });
    }

    buildNote() {
        let htmlBuffer = this.html();
        let div = document.createElement('div');
         div.innerHTML = htmlBuffer
        this.el = div.children[0];

        this.attachEventListeners();

        return this.el
    }


}