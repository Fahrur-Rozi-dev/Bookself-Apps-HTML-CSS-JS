
function displayCompletedBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";
    const completedBooks = books.filter(book => book.isComplete === true);

    completedBooks.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book_item");

        const bookInfo = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun Terbit: ${book.year}</p>
        `;
        bookItem.innerHTML = bookInfo;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_button");
        editButton.addEventListener("click", () => {
            displayEditPopup(book);
        });
        bookItem.appendChild(editButton);

        const markAsIncompleteButton = document.createElement("button");
        markAsIncompleteButton.textContent = "Tandai Belum Selesai";
        markAsIncompleteButton.addEventListener("click", () => {
            markBookAsIncomplete(book);
        });
        bookItem.appendChild(markAsIncompleteButton);
        completeBookshelfList.appendChild(bookItem);
    });
}

function displayIncompleteBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";
    const incompleteBooks = books.filter(book => book.isComplete === false);

    incompleteBooks.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book_item");

        const bookInfo = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun Terbit: ${book.year}</p>
        `;
        bookItem.innerHTML = bookInfo;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_button");
        editButton.addEventListener("click", () => {
            displayEditPopup(book);
        });
        bookItem.appendChild(editButton);

        const markAsCompleteButton = document.createElement("button");
        markAsCompleteButton.textContent = "Tandai Selesai";
        markAsCompleteButton.addEventListener("click", () => {
            markBookAsComplete(book);
        });
        bookItem.appendChild(markAsCompleteButton);
        incompleteBookshelfList.appendChild(bookItem);
    });
}

displayCompletedBooks();
displayIncompleteBooks();

function displayEditPopup(book) {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";
    
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editYear").value = book.year;

    const editForm = document.getElementById("editForm");
    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const editedTitle = document.getElementById('editTitle').value;
        const editedAuthor = document.getElementById('editAuthor').value;
        const editedYear = document.getElementById('editYear').value;

        let books = JSON.parse(localStorage.getItem("books")) || [];
        const index = books.findIndex(item => item.id === book.id);

        if (index !== -1) {
            books[index].title = editedTitle;
            books[index].author = editedAuthor;
            books[index].year = editedYear;

            localStorage.setItem("books", JSON.stringify(books));

            alert("Buku berhasil diubah.");

            displayCompletedBooks();

            modal.style.display = "none"
        } else {
            alert("Buku tidak ditemukan.");
        }
    });

    const deleteButton = document.getElementById("deleteBookButton");
    deleteButton.addEventListener("click", function() {
        if (confirm("Anda yakin ingin menghapus buku ini?")) {
            let books = JSON.parse(localStorage.getItem("books")) || [];
            const index = books.findIndex(item => item.id === book.id);

            if (index !== -1) {
                books.splice(index, 1);
                localStorage.setItem("books", JSON.stringify(books));
                alert("Buku berhasil dihapus.");
                displayCompletedBooks();
                displayIncompleteBooks();
                modal.style.display = "none";
            } else {
                alert("Buku tidak ditemukan.");
            }
        }
    });
}

function markBookAsComplete(book) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const index = books.findIndex(item => item.id === book.id);
    if (index !== -1) {
        books[index].isComplete = true;
        localStorage.setItem("books", JSON.stringify(books));
            displayCompletedBooks();
            displayIncompleteBooks();
        
    } else {
        alert("Buku tidak ditemukan.");
    }
}

function markBookAsIncomplete(book) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const index = books.findIndex(item => item.id === book.id);
    if (index !== -1) {
        books[index].isComplete = false;
        localStorage.setItem("books", JSON.stringify(books));
            displayCompletedBooks();
            displayIncompleteBooks();
        
    } else {
        alert("Buku tidak ditemukan.");
    }
}

function saveBook(event) {
    event.preventDefault();

    const judul = document.getElementById('inputJudul').value;
    const penulis = document.getElementById('inputPenulis').value;
    const tahun = document.getElementById('inputTahun').value;
    const statusInput = document.querySelector('input[name="status"]:checked');

    const status = statusInput ? (statusInput.value === "sudah_dibaca" ? true : false) : false;
    
    const book = {
        id: new Date().getTime(),
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: status
    };

    let books = localStorage.getItem('books');

    if (!books) {
        books = [];
    } else {
        books = JSON.parse(books);
    }

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));

displayCompletedBooks();
displayIncompleteBooks();
}

document.getElementById('inputAddBook').addEventListener('submit', function(event) {
    saveBook(event);
    displayCompletedBooks();
    displayIncompleteBooks();
    location.reload()
});


function searchBook(keyword) {
    const storedBooks = localStorage.getItem("books");

    if (!storedBooks) {
        return [];
    }

    const books = JSON.parse(storedBooks);

    const searchResults = books.filter(book => {
        return book.title.toLowerCase().includes(keyword.toLowerCase());
    });

    return searchResults;
}

function handleSearch(event) {
    event.preventDefault();

    const keyword = document.getElementById("searchBookTitle").value.trim();

    if (keyword !== "") {
        const searchResults = searchBook(keyword);

        displaySearchResults(searchResults);
    } else {
        document.getElementById("searchResults").innerHTML = "mau cari apa? kok gak di isi sih, masukin judul buku nya dong!"
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById("searchResults");

    searchResultsContainer.innerHTML = "";

    if (results.length > 0) {
        
        results.forEach(book => {
            const bookItem = document.createElement("div");
            bookItem.classList.add("book_item");
            bookItem.classList.add("margin-top");
            bookItem.classList.add("book_shelf");

            const bookInfo = `
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun Terbit: ${book.year}</p>
            `;
            bookItem.innerHTML = bookInfo;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit_button");
            editButton.addEventListener("click", () => {
                displayEditPopup(book);
            });
            bookItem.appendChild(editButton);

            if (book.isComplete) {
                const markAsIncompleteButton = document.createElement("button");
                markAsIncompleteButton.textContent = "Tandai Belum Selesai";
                markAsIncompleteButton.addEventListener("click", () => {
                    markBookAsIncomplete(book);
                });
                bookItem.appendChild(markAsIncompleteButton);
            } else {
                const markAsCompleteButton = document.createElement("button");
                markAsCompleteButton.textContent = "Tandai Selesai";
                markAsCompleteButton.addEventListener("click", () => {
                    markBookAsComplete(book);
                });
                bookItem.appendChild(markAsCompleteButton);
            }

            searchResultsContainer.appendChild(bookItem);
        });
    } else {
        const noResultsMessage = document.createElement("h2");
        noResultsMessage.textContent = "bukunya gak ketemu nih. coba cari buku yang lain.";
        searchResultsContainer.appendChild(noResultsMessage);
    }
}


const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", handleSearch);


