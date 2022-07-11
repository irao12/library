let myLibrary = [];

function Book(name, author, read) {
    this.name = name;
    this.author = author;
    this.read = read;
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", false);

addBookToLibrary(book1);

console.log(myLibrary)