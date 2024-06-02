const express = require('express');
let books = require("./booksdb.js");
let axios = require("axios");
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

/*

    // Task 1 - Get the book list available in the shop (SYNC)
    public_users.get('/',function (req, res) {
        const formattedBooks = JSON.stringify(books, null, 4);
        res.status(200).send(formattedBooks);
    });

*/

// #################### TASK 10 ########################### 

const getAllBooks = () => new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.stringify(books, null, 4)), 600)
})


/*

    // Get the book list available in the shop (ASYNC/AWAIT)
    public_users.get('/', async function (req, res) {

        const formattedBooks = await getAllBooks();

        res.status(200).send(formattedBooks);
    });

    // Get the book list available in the shop (AXIOS)
    public_users.get('/', async function (req, res) {

        const response = await axios.get("<API_URL>");

        const formattedBooks = response.data;

        res.status(200).send(formattedBooks);
    });

*/

// Get the book list available in the shop (PROMISE CALLBACK)
public_users.get('/', async function (req, res) {

    getAllBooks()
        .then((formattedBooks) => {
            res.status(200).send(formattedBooks);
        })
        .catch((error) => {
            res.status(500).send("Something went wrong")
            console.log(error)
        })
    
  });


/*

    // TASK 2 - Get book details based on ISBN (SYNC)
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

*/

// #################### TASK 11 ########################### 

const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
    const book = books[isbn];
    setTimeout(() => {
        resolve(JSON.stringify(book, null, 4))
    }, 600);
})

/*

    // Get book details based on ISBN (ASYNC/AWAIT)
    public_users.get('/isbn/:isbn', async function (req, res) {
        const isbn = req.params.isbn;
    
        const book = await getBookByISBN(isbn);   
        
        if(!book) {
            res.status(404).send("Book not found");
        }
        else {
            res.status(200).send(book);
        }
    
    });


    // Get book details based on ISBN (AXIOS)
    public_users.get('/isbn/:isbn', async function (req, res) {
        const isbn = req.params.isbn;
    
        const book = await axios.get(`<API_URL>/isbn/${isbn}`);

        if(!book) {
            res.status(404).send("Book not found");
        }
        else {
            res.status(200).send(book);
        }
    
    });

*/

// Get book details based on ISBN (PROMISE CALLBACK)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    getBookByISBN(isbn).then((book) => {
        if(!book) {
            res.status(404).send("Book not found");
        }
        else {
            res.status(200).send(book);
        }
    });

});

/*

    // TASK 3 - Get book details based on author (SYNC)
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

*/

// #################### TASK 12 ########################### 

const getBooksByAuthor = (author) => new Promise((resolve, reject) => {
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

  setTimeout(() => resolve(authorBooks), 600);

})

/*

    // Get book details based on author (ASYNC/AWAIT)
    public_users.get('/author/:author', async function (req, res) {
        const author = req.params.author;
    
        const authorBooks = await getBooksByAuthor(author);
    
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

    // Get book details based on author (AXIOS)
    public_users.get('/author/:author', async function (req, res) {
        const author = req.params.author;
    
        const response = await axios.get(`<API_URL>/author/${author}`);
    
        const authorBooks = response.data;

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

*/

// Get book details based on author (PROMISE CALLBACK)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    getBooksByAuthor(author).then((authorBooks) => {
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
  
});

/*

    // TASK 4 - Get all books based on title
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

*/

// #################### TASK 13 ########################### 

const getBooksByTitle = (title) => new Promise((resolve, reject) => {
   
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

    setTimeout(() => resolve(titleBooks), 600);
})

/*

    // Get all books based on title (ASYNC/AWAIT)
    public_users.get('/title/:title', async function (req, res) {
        const title = req.params.title;

        const titleBooks = await getBooksByTitle(title);
    
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

    // Get all books based on title (AXIOS)
    public_users.get('/title/:title', async function (req, res) {
        const title = req.params.title;

        const titleBooks = await axios.get(`<API_URL>/title/${title}`);
    
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

*/

// Get all books based on title (PROMISE CALLBACK)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    getBooksByTitle(title).then((titleBooks) => {
        if(titleBooks.length <= 0) {
            res.status(404).send("Books for given author not found")
        }
        else {
            const response = {
                booksbytitle: titleBooks
            }
        
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    })
  
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
