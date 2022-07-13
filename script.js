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

function openModal() {
    document.querySelector('.modal').classList.add("active");
}

function closeModal() {
    // modal only shows if it has the active class, so remove it to close it
    document.querySelector('.modal').classList.remove("active");
}

function closeAddEditModal() {
    closeModal();

    document.querySelector('.close').classList.remove('active');
    const bookForm = document.querySelector('.book-form');

    bookForm.classList.remove('active');
    bookForm.firstChild.remove();
    bookForm.lastChild.remove();
    bookForm.reset();

    const error = document.querySelector('.error');
    if (error) error.remove();
    const invalid = document.querySelector('.invalid');
    if (invalid) invalid.remove();
    
}

function openAddEditForm() {
    document.querySelector('.book-form').classList.add('active');
    document.querySelector('.close').classList.add('active');
}

function isValid(title, numPages, numRead) {
    const author = document.querySelector('author-input');

    const titleValue = title.value;
    const numPagesValue = numPages.value;
    const numReadValue = numRead.value;

    const button = title.parentNode.parentNode.lastElementChild;


    const hasValid = (numPagesValue - numReadValue) >= 0;

    const errorExists = document.querySelector('.error');

    // title must be empty, if it is, display an error
    if (!titleValue) {
        // checks if the invalid message is present, if not, it will display it
        if (!errorExists){
            const error = document.createElement('p');
            error.classList.add("error");
            error.textContent = "* please enter a title"
            title.parentNode.insertBefore(error, author);
        }
        return false;
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
            title.parentNode.parentNode.insertBefore(invalid,  title.parentNode.parentNode.lastChild);
        }
        return false;
    }
    else if (invalidExists) {
        // remove the invalid message if the values are no longer invalid
        invalidExists.remove();
    }

    return true;
}

function openAddBook (bookDiv) {
    openModal();
    openAddEditForm();

    const form = document.querySelector('.book-form');
    form.prepend("add book");

    const addButton = document.createElement('button');
    addButton.textContent = 'add';
    addButton.classList.add('add-button');
    addButton.setAttribute('type', 'button');
    addButton.bookDiv = bookDiv;
    form.appendChild(addButton);
    
    addButton.addEventListener('click', addBook);
}

function addBook () {
    const title = document.querySelector('#title-input');
    const author = document.querySelector('#author-input');
    const numPages = document.querySelector('#pages-input');
    const numRead = document.querySelector('#read-input');

    // retrieve values from the form inputs
    const titleValue = title.value;
    const authorValue = author.value;
    const numPagesValue = numPages.value;
    const numReadValue = numRead.value;
    
    if (isValid(title, numPages, numRead)){
        const newBook = new Book (titleValue, 
                                  authorValue == '' ? 'unknown' : authorValue, 
                                  numPagesValue == '' ? 0 : numPagesValue,
                                  numReadValue == '' ? 0 : numReadValue,
                                  (numPagesValue != '' && numPagesValue == numReadValue) ? true : false
                                 );
        currIndex++;

        addBookToLibrary(newBook);
        displayBook(newBook);

        closeAddEditModal();
    }
}

function addBookToLibrary(book){
    myLibrary.push(book);
}

function openEditBook (bookDiv) {
    openModal();
    openAddEditForm();

    const currBook = myLibrary[bookDiv.getAttribute('number')];

    const title = document.querySelector('#title-input');
    title.value = currBook.title;

    const author = document.querySelector('#author-input');
    author.value = currBook.author;

    const numPages = document.querySelector('#pages-input');
    numPages.value = currBook.pages;

    const numRead = document.querySelector('#read-input');
    numRead.value = currBook.read;

    const form = document.querySelector('.book-form')
    form.prepend("edit book");

    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.classList.add('edit-button');
    editButton.setAttribute('type', 'button');
    editButton.bookDiv = bookDiv;
    form.appendChild(editButton);
    
    editButton.addEventListener('click', editBook);
}

function editBook(element) {
    const bookDiv = element.target.bookDiv;
    const currBook = myLibrary[bookDiv.getAttribute('number')];
    
    const title = document.querySelector('#title-input');
    const author = document.querySelector('#author-input');
    const numPages = document.querySelector('#pages-input');
    const numRead = document.querySelector('#read-input');

    if (isValid(title, numPages, numRead)) {
        currBook.title = title.value;
        currBook.author = author.value;
        currBook.pages = numPages.value ? numPages.value : 0;
        currBook.read = numRead.value ? numRead.value : 0;
        currBook.finished = currBook.pages == currBook.read;

        console.log(currBook.pages)
        updateBookDiv(bookDiv);
        closeAddEditModal();
    }
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
    pagesSection.children[0].innerText = 'page count: ' + currBook.pages;
    pagesSection.children[1].innerText = 'pages read: ' + currBook.read;

    // update the progress bar
    const progressIndicator = bookDiv.children[3].firstChild;
    let percentageRead = currBook.read / currBook.pages;
    if (currBook.pages == 0) percentageRead = 0;
    progressIndicator.style.width= "" + Math.floor(percentageRead * 100) + "%";

    // update the status
    const status = bookDiv.children[4];
    status.innerText = ('status: ' + (currBook.finished ? 'finished' : 'not finished'));
}

function confirmDelete (bookDiv) {
    document.querySelector('.modal').classList.add('active');
    document.querySelector('.confirm-delete-div').classList.add('active');

    const confirmDeleteDiv = document.querySelector('.confirm-delete-div');
    
    const titleAndAuthor = bookDiv.children[1]; 
    const titleAndAuthorMessage = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = titleAndAuthor.firstChild.textContent;
    titleAndAuthorMessage.appendChild(title);

    const author = document.createElement('p');
    author.textContent = titleAndAuthor.lastChild.textContent;
    titleAndAuthorMessage.appendChild(author);

    confirmDeleteDiv.appendChild(titleAndAuthorMessage);

    const deleteButtons = document.createElement('div');
    deleteButtons.classList.add('delete-buttons');
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'delete';
    deleteButtons.appendChild(deleteButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'cancel';
    deleteButtons.appendChild(cancelButton);
    confirmDeleteDiv.append(deleteButtons);

    deleteButtons.firstElementChild.addEventListener('click', (e)=>{
        let bookNum = parseInt(bookDiv.getAttribute('number'));

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

        titleAndAuthorMessage.remove();
        deleteButtons.remove();
        document.querySelector('.confirm-delete-div').classList.remove('active');
        closeModal();
    });
    
    deleteButtons.lastElementChild.addEventListener('click', (e)=>{
        titleAndAuthorMessage.remove();
        deleteButtons.remove();
        document.querySelector('.confirm-delete-div').classList.remove('active');
        closeModal();
    });
}

function displayBook(book) {
    const bookDiv = document.createElement("div");

    /* delete button*/
    const toolsDiv = document.createElement('div');
    toolsDiv.classList.add('tools');

    const editDiv = document.createElement('div');

    editDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
    editDiv.classList.add('edit');
    toolsDiv.appendChild(editDiv);

    const deleteDiv = document.createElement('div');
    deleteDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
    deleteDiv.classList.add('delete');
    toolsDiv.appendChild(deleteDiv);

    bookDiv.appendChild(toolsDiv);

    /* title and author section */
    const titleAndAuthorDiv = document.createElement('div');
    titleAndAuthorDiv.classList.add('title-and-author')
    titleAndAuthorDiv.innerHTML =  '<h2>' + book.title + '</h2>' +
                                '<p>by ' + book.author + '</p>';
    bookDiv.appendChild(titleAndAuthorDiv);

    /* page count and pages read */
    const pagesDiv = document.createElement('div');
    pagesDiv.innerHTML = '<p>page count: ' + book.pages + '</p>' +
                        '<p>pages read: ' + book.read + '</p>';
    bookDiv.appendChild(pagesDiv);

    // progress bar 
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    bookDiv.append(progressBar);
    let percentageRead = book.read / book.pages;

    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    progressIndicator.style.width= "" + Math.floor(percentageRead * 100) + "%";
    progressBar.appendChild(progressIndicator);

    /* status */
    const status = document.createElement('p');
    status.textContent = 'status: ' + (book.finished ? 'finished' : 'not finished');
    bookDiv.appendChild(status);

    /* change status button */
    const changeStatusButton = document.createElement('button');
    changeStatusButton.innerText = book.finished ? "mark as unfinished" 
                                                 : "mark as finished";
    changeStatusButton.classList.add('status-button');

    changeStatusButton.addEventListener('click', () => {
        const currBook = myLibrary[parseInt(bookDiv.getAttribute('number'))]
        currBook.changeStatus();
        if (currBook.finished){
            currBook.read = currBook.pages;
        }
        else {
            currBook.read = 0;
        }
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
            confirmDelete(bookDiv);
        }

        else if (e.target.parentNode.classList.contains('edit') ||
            e.target.parentNode.parentNode.classList.contains('edit'))
        {
            openEditBook(bookDiv);
        }
    });
}

function displayLibrary () {
    myLibrary.forEach(displayBook);
}

// add button
document.querySelector('.add').addEventListener('click', (e) => {
    openAddBook();
});

// close button for the add modal
document.querySelector('.close').addEventListener('click', () => {
    closeAddEditModal();
});


const book1 = new Book ("The Great Gatsby", "F. Scott Fitzgerald", 208, 102,  false);
const book2 = new Book ("Because of Winn-Dixie", "Kate DiCamillo", 182, 32, false);
book2.bookNumber = 1;
currIndex = 2;

addBookToLibrary(book1);
addBookToLibrary(book2);

displayLibrary();