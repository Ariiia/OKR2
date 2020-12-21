// here should be your code

function noteItem(id, name, text, date) {
    this.id = id;
    this.name = name;
    this.text=text;
    this.date=date;
}
//cам объект заметки
//левая панель с заметками

//main func
window.onload=function(){
    let AllNotes={};
  //document.getElementById("Add").onclick()=

};

function AddButton(){
    let newNote = new noteItem(getId, getName, getText, getDate);
    return newNote;
};

function getId(){
    let id=-1;
    return id;
}

function getName(){
    let name="Notename";
    return name;
}

function getText(){
    let text="textnote";
    return text;
};

function getDate(){
    let date=0;
    return date;
};