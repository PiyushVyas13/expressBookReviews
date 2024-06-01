const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 let commonUsers = users.filter((user) => user.username === username);

 return commonUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const validUsers = users.filter((user) => user.username === username && user.password === password)

    return validUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    res.status(400).send("Username or Password not provided")
  }

  if(authenticatedUser(username, password)) {
    let token = jwt.sign({
        data: password 
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken: token, username 
    }

    res.status(200).send("Customer successfully logged in!");
  }
  else {
    res.status(208).send("Invalid login credentials");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];

  if(!username) {
    res.status(403).send("Unauthorized");
  }

  const review = req.query.review;

  if(!review) {
    res.status.send("review not provided")
  }

  const isbn = req.params.isbn;

  const book = books[isbn];

  if(!book) {
    res.status(404).send(`book with ISBN ${isbn} does not exist.`)
  }

  book.reviews[username] = review;

  books[isbn] = book;
  res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);
});

// Delete a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username'];
    if(!username) {
        res.status(403).send("Unauthorized");
    
    }

    const isbn = req.params.isbn;

    const book = books[isbn];
  
    if(!book) {
      res.status(404).send(`book with ISBN ${isbn} does not exist.`)
    }

    delete book.reviews[username];
    books[isbn] = book;

    res.status(200).send(`Reviews for book with ISBN ${isbn} posted by user '${username}' deleted.`)
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
