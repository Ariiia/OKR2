export default class Note {
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
            <div class = 'note_time'>${this.date.toLocaleDateString('ru')}</div>
        </li>`
    }

    attachEventListeners() {
        let btnRemove = this.el.querySelector('.remove-button');
     
        btnRemove.onclick = () => {
            this.notesManager.removeNote(this);

        }

        this.el.addEventListener('click', (e) => {
            if (e.target !== btnRemove[0])
                this.notesManager.onShowNote(this);
        });

    }

    buildNote() {
        let htmlBuffer = this.html();
        let list = document.createElement('li');
        list.innerHTML = htmlBuffer;

        this.el = list.children[0];

        this.attachEventListeners();

        return this.el
    }

}