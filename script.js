let myLibrary = [];
let currIndex = 0;

function Book(title, author, pages, read, finished) {
    this.bookNumber = currIndex;
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
        currIndex++;

        addBookToLibrary(newBook);
        displayBook(newBook);

        closeAdd();

        // reset form values
        document.querySelector('#add-book-form').reset();
    }
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

function displayBook(book) {
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = '<div class="delete"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg> </div>'+
                        '<div> <h2>' + book.title + '</h2>' +
                        '<p>by ' + book.author + '</p> </div>' + 
                        '<p>page count: ' + book.pages + '</p>' +
                        '<p>pages read: ' + book.read + '</p>' +
                        '<p>status: ' + (book.finished ? 'finished' : 'not finished') + '</p>' +
                        '</div>';

    bookDiv.setAttribute('number', book.bookNumber);
    bookDiv.classList.add("book-div");

    const add = document.querySelector('.add-div');
    add.parentNode.insertBefore(bookDiv, add);

    bookDiv.addEventListener('click', (e) => {
        if (e.target.parentNode.classList.contains('delete') ||
            e.target.parentNode.parentNode.classList.contains('delete'))
        {
            bookNum = parseInt(bookDiv.getAttribute('number'));

            myLibrary.splice(bookNum, 1);

            let nextBook = bookDiv.nextSibling;
            while (nextBook && nextBook.getAttribute('number')){
                nextBook.setAttribute('number', bookNum - 1)
                nextBook = nextBook.nextSibling;
            }

            for (let i = bookNum; i < myLibrary.length; i++){
                myLibrary[i].bookNumber--;
            }

            bookDiv.remove();

            console.log(myLibrary);

            currIndex--;   
        }
    });
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

// add button
document.querySelector('.add').addEventListener('click', (e) => {
    document.querySelector('.add-modal').classList.add("active");
});

// close button for the add modal
document.querySelector('.close').addEventListener('click', closeAdd);


const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", 208, 0,  false);
const book2 = new Book ("Because of Winn-Dixie", "Kate DiCamillo", 182, 0, false);
book2.bookNumber = 1;
currIndex = 2;

addBookToLibrary(book1);
addBookToLibrary(book2);

displayLibrary();