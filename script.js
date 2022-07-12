let myLibrary = [];

function Book(title, author, pages, read, finished) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.finished = finished;
}

function closeAdd () {
    // modal only shows if it has the active class, so remove it to close it
    document.querySelector('.add-modal').classList.remove("active");
}

function createNewBook () {
    const title = document.querySelector('#title-input');
    const author = document.querySelector('#author-input');
    const numPages = document.querySelector('#num-pages-input');
    const numRead = document.querySelector('#num-read-input');
    const addButton = document.querySelector('.add-button');

    const titleValue = title.value;
    const authorValue = author.value;
    const numPagesValue = numPages.value;
    const numReadValue = numRead.value;

    console.log(titleValue, authorValue, numPagesValue, numReadValue);   

    let hasTitle = titleValue != '';
    let hasValid = numPagesValue >= numReadValue;

    const errorExists = document.querySelector('.error');

    // title must be empty, if it is, display an error
    if (!hasTitle) {
        // checks if the invalid message is present, if not, it will display it
        if (!errorExists){
            const error = document.createElement('p');
            error.classList.add("error");
            error.textContent = "* please enter a title"
            title.parentNode.insertBefore(error, author);
        }
    }
    else if (errorExists) {
        // remove the error message if there is a title present
        errorExists.remove();
    }

    // number of pages must be greater than or equal to the number of pages read

    // checks if the invalid message is present, if not, it will display it
    const invalidExists = document.querySelector('.invalid');
    if (!hasValid) {
        if (!invalidExists) {
            const invalid = document.createElement('p');
            invalid.classList.add('invalid');
            invalid.textContent = "* pages read must be less than the number of pages";
            title.parentNode.insertBefore(invalid, addButton);
        }
    }
    else if (invalidExists) {
        // remove the invalid message if the values are no longer invalid
        invalidExists.remove();
    }
    
    if (hasTitle && hasValid){
        const newBook = new Book (titleValue, 
                                  authorValue == '' ? 'unknown' : authorValue, 
                                  numPagesValue == '' ? 0 : numPagesValue,
                                  numReadValue == '' ? 0 : numReadValue,
                                  (numPagesValue != '' && numPagesValue == numReadValue) ? true : false
                                 );
        myLibrary.push(newBook);
        displayBook(newBook);
        closeAdd();

        // reset form values
        title.value = '';
        author.value = '';
        numPages.value = '';
        numRead.value = '';
    }
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

function displayBook(book) {
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = '<div> <h2>' + book.title + '</h2>' +
                        '<p>by ' + book.author + '</p> </div>' + 
                        '<p>page count: ' + book.pages + '</p>' +
                        '<p>pages read: ' + book.read + '</p>' +
                        '<p>status: ' + (book.finished ? 'finished' : 'not finished') + '</p>' +
                        '</div>';
                        

    bookDiv.classList.add("book-div");

    const add = document.querySelector('.add-div');
    add.parentNode.insertBefore(bookDiv, add);
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

document.querySelector('.add').addEventListener('click', (e) => {
    document.querySelector('.add-modal').classList.add("active");
});

document.querySelector('.close').addEventListener('click', closeAdd);


const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", 208, 0,  false);
const book2 = new Book ("Because of Winn-Dixie", "Kate DiCamillo", 182, 0, false);

addBookToLibrary(book1);
addBookToLibrary(book2);

displayLibrary();