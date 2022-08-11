let http = new XMLHttpRequest();

let books;

var btnAbout = document.getElementById("nav-about");
var aboutContainer = document.getElementById("about-container");

http.open("get", "data/booksOfQuotidian.json", true);

http.send();

let out = "";
var bookContainer = document.getElementById("book-cards-container");

function addBooks(books) {
  console.log(books);
  let out = "";
  let arr = [];

  bookContainer.innerHTML = "";

  for (let book of books) {
    if (arr.includes(book.eNumber)) {
      console.log(book.eNumber);
      addAdditionalBook(book.eNumber, book.name, book.author);
    } else {
      arr.push(book.eNumber);
      out = `<div class="book-card" id="book-card">
      <div class="episode-no" id="${book.eNumber}">Quotidian ${book.eNumber}</div>
      <div class="episode-no" id="${book.eName}">${book.eName}</div>
      <div class="books" id="${book.eNumber}books">
        <div class="book" id="book">
          ${book.name} by ${book.author}
        </div>
      </div>
    </div>`;

      bookContainer.innerHTML += out;
    }
    //console.log(book.eNumber);
  }
}

function addAdditionalBook(eNumber, name, author) {
  var out = ` <div class="book">
  ${name} by ${author}
</div>`;
  var bookElement = document.getElementById(eNumber + "books");
  bookElement.innerHTML += out;
  //console.log(bookElement);
}

var searchBar = document.getElementById("search-field");

searchBar.addEventListener("keyup", (text) => {
  var searchString = text.target.value.toUpperCase();
  let filteredBooks = books.filter((book) => {
    return (
      book.eNumber.toUpperCase().includes(searchString) ||
      book.eName.toUpperCase().includes(searchString) ||
      book.name.toUpperCase().includes(searchString) ||
      book.author.toUpperCase().includes(searchString)
    );
  });
  console.log(filteredBooks);
  addBooks(filteredBooks);
});

btnAbout.addEventListener("click", () => {
  aboutContainer.classList.add("show");
});

aboutContainer.addEventListener("click", () => {
  aboutContainer.classList.remove("show");
});

http.onload = function () {
  if (this.readyState == 4 && this.status == 200) {
    books = JSON.parse(this.responseText);

    addBooks(books);
  }
};
