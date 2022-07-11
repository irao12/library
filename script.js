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
    bookDiv.innerHTML = '<h2>' + book.title + '</h2>' +
                        '<p>by ' + book.author + '</p>';
    bookDiv.classList.add("book-div");

    const mainContent = document.querySelector('.main');
    mainContent.appendChild(bookDiv);
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", false);
const book2 = new Book ("Because of Winn-Dixie", "Kate DiCamillo", false);

addBookToLibrary(book1);
addBookToLibrary(book2);

displayLibrary();