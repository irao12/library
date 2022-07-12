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

Book.prototype.changeStatus = function () {
    // change the status 
    this.finished = this.finished ? false : true;

    // pages read becomes the same as the page count if finished, 0 if not
    if (this.finished) {
        this.read = this.pages;
    }
    else {
        this.read = 0;
    }
}


function closeAdd () {
    // modal only shows if it has the active class, so remove it to close it
    document.querySelector('.modal').classList.remove("active");
}

function createNewBook () {
    const title = document.querySelector('#title-input');
    const author = document.querySelector('#author-input');
    const numPages = document.querySelector('#num-pages-input');
    const numRead = document.querySelector('#num-read-input');
    const addButton = document.querySelector('.add-button');

    // retrieve values from the form inputs
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
        document.querySelector('.add-book-form').reset();
    }
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

function updateBookDiv (bookDiv) {
    const bookNum = parseInt(bookDiv.getAttribute('number'));
    const currBook = myLibrary[bookNum];

    // update the title and author
    const titleAndAuthorDiv = bookDiv.children[1];
    const title = titleAndAuthorDiv.firstChild;
    const author = titleAndAuthorDiv.lastChild;
    title.textContent = currBook.title;
    author.textContent = "by " + currBook.author;

    // updated page count and pages read
    const pagesSection = bookDiv.children[2];
    pagesSection.children[1].innerText = 'pages read: ' + currBook.read;

    // update the status
    const status = bookDiv.children[3];
    status.innerText = ('status: ' + (currBook.finished ? 'finished' : 'not finished'));
}

function displayBook(book) {
    const bookDiv = document.createElement("div");

    /* delete button*/
    const deleteDiv = document.createElement('div');
    deleteDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
    deleteDiv.classList.add('delete');
    bookDiv.appendChild(deleteDiv);

    /* title and author section */
    const titleAndAuthorDiv = document.createElement('div');
    titleAndAuthorDiv.innerHTML =  '<h2>' + book.title + '</h2>' +
                                '<p>by ' + book.author + '</p>';
    bookDiv.appendChild(titleAndAuthorDiv);

    /* page count and pages read */
    const pagesDiv = document.createElement('div');
    pagesDiv.innerHTML = '<p>page count: ' + book.pages + '</p>' +
                        '<p>pages read: ' + book.read + '</p>';
    bookDiv.appendChild(pagesDiv);

    /* status */
    const status = document.createElement('p');
    status.textContent = 'status: ' + (book.finished ? 'finished' : 'not finished');
    bookDiv.appendChild(status);

    /* change status button */
    const changeStatusButton = document.createElement('button');
    changeStatusButton.innerText = "mark as finished";
    changeStatusButton.classList.add('status-button');

    changeStatusButton.addEventListener('click', () => {
        myLibrary[parseInt(bookDiv.getAttribute('number'))].changeStatus();
        updateBookDiv(bookDiv);
        changeStatusButton.textContent = changeStatusButton.textContent == 'mark as finished' 
                                         ? 'mark as unfinished'
                                         : 'mark as finished';
    });
    bookDiv.appendChild(changeStatusButton);

    bookDiv.setAttribute('number', book.bookNumber);
    bookDiv.classList.add("book-div");

    const add = document.querySelector('.add-div');
    add.parentNode.insertBefore(bookDiv, add);

    /* if the user clicks on the delete button, remove the book */
    bookDiv.addEventListener('click', (e) => {
        /* since a click can be registered on the svg or its path, check both parents */
        if (e.target.parentNode.classList.contains('delete') ||
            e.target.parentNode.parentNode.classList.contains('delete'))
        {
            bookNum = parseInt(bookDiv.getAttribute('number'));

            // decrement the book number of every other book after it
            let nextBook = bookDiv.nextSibling;

            //while the nextBook exists and has a number, decrement the number
            while (nextBook && nextBook.getAttribute('number')){
                nextBook.setAttribute('number', nextBook.getAttribute('number') - 1)
                nextBook = nextBook.nextSibling;
            }

            // decrement the bookNumber attribute in each book object after as well
            for (let i = bookNum; i < myLibrary.length; i++){
                myLibrary[i].bookNumber--;
            }

            // remove the book from the library and DOM. Decrement the index
            myLibrary.splice(bookNum, 1);

            bookDiv.remove();
            currIndex--;   
        }
    });
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

// add button
document.querySelector('.add').addEventListener('click', (e) => {
    document.querySelector('.modal').classList.add("active");
    document.querySelector('.add-book-form').classList.add("active");
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