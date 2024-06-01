const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        res.status(400).send("Username or password not provided!");
    }
    
    if(!isValid(username)) {
        users.push({username, password})
        res.status(200).send("User successfully registered. Now you can login.")
    }
    else {
        res.send("User already exists!");
    }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const formattedBooks = JSON.stringify(books, null, 4);
  res.status(200).send(formattedBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if(!book) {
    res.status(404).send("Book not found")
  }
  else {
    res.status(200).send(JSON.stringify(book, null, 4))
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const bookKeys = Object.keys(books);

  const authorBooks = []

  bookKeys.forEach((isbn) => {
    if(books[isbn].author === author) {
        authorBooks.push({
            isbn, 
            title: books[isbn].title,
            reviews: books[isbn].reviews 
        
        });
    }
  })

  if(authorBooks.length <= 0) {
    res.status(404).send("Books for given author not found")
  }
  else {
    const response = {
        booksbyauthor: authorBooks
    }

    res.status(200).send(JSON.stringify(response, null, 4));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const bookKeys = Object.keys(books);
  
    const titleBooks = []
  
    bookKeys.forEach((isbn) => {
      if(books[isbn].title === title) {
          titleBooks.push({
              isbn, 
              author: books[isbn].author,
              reviews: books[isbn].reviews 
          
          });
      }
    })
  
    if(titleBooks.length <= 0) {
      res.status(404).send("Books for given author not found")
    }
    else {
      const response = {
          booksbytitle: titleBooks
      }
  
      res.status(200).send(JSON.stringify(response, null, 4));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  const book = books[isbn];

  if(!book) {
    res.status(404).send(`Book with ISBN ${isbn} not found`)
  }
  else {
    const review = book.reviews;

    res.status(200).send(JSON.stringify(review, null, 4));
  }
});

module.exports.general = public_users;
