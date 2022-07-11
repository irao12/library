let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

function displayBook(book) {
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = '<div> <h2>' + book.title + '</h2>' +
                        '<p>by ' + book.author + '</p> </div>' + 
                        '<p>page count: ' + book.pages + '</p>' +
                        '<p>status: ' + (book.read ? 'finished' : 'not finished') + '</p>' +
                        '</div>';
                        

    bookDiv.classList.add("book-div");

    const add = document.querySelector('.add-div');
    add.parentNode.insertBefore(bookDiv, add);
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", 208, false);
const book2 = new Book ("Because of Winn-Dixie", "Kate DiCamillo", 182, false);

addBookToLibrary(book1);
addBookToLibrary(book2);

displayLibrary();