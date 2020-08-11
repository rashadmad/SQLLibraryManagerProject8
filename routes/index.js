var express = require('express');
const { render } = require('pug');
const { response } = require('../app');
var router = express.Router();
const Books = require('../models').Book;  

//modular async function to allow other functions async nature
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        next(error)
      }
    }
  }

//Home route should redirect to the /books route.
router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/books');
}));

//READ Shows the full list of books.
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Books.findAll()
    res.render('index', {
        booksToView: [...books]
    })
}));

//CREATE Shows the create new book form.
router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new-book', {
        book: false,
        validationError: false
    })
}));

//CREATE Posts a new book to the database.
router.post('/books/new', asyncHandler(async (req, res) => {
    let newBook;
    try {
      newBook = await Books.create(req.body);
      res.redirect("/books/" + newBook.id)
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        newBook = await Books.build(req.body);
        console.log("SequelizeValidationError initiated")
        res.status(400);
        res.render('new-book', { 
            book: false,
            errors: error.errors,
            validationError: true,
            bookTitle: req.body.title,
            bookAuthor: req.body.author,
            bookGenre: req.body.genre,
            bookYear: req.body.year
         })
      } else {
        throw error;
      }  
    }
}));

//READShows book detail form.
router.get('/books/:id', asyncHandler(async (req, res) => {
    const selectedBook = await Books.findByPk(req.params.id)
    //need to check if the selected book exists 
    if(selectedBook){
        res.render('update-book', {
            book: selectedBook
        })
    } else {
      const err = new Error("Page not found");
      err.status = 404;
      throw err;
    } 
}));

//UPDATE book info in the database.
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book
    try {
        book = await Books.findByPk(req.params.id);
        if (book){
            await book.update(req.body);
            res.redirect("/books/" + book.id)
        } else {
          const err = new Error("Page not found");
          err.status = 404;
          throw err;
        }
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
          book = await Books.build(req.body);
          book.id = req.params.id; // make sure correct article gets updated
          res.render("update-book", {
             book,
             errors: error.errors,
             validationError: true,
             bookTitle: req.body.title,
             bookAuthor: req.body.author,
             bookGenre: req.body.genre,
             bookYear: req.body.year
          })
          res.status(422);
        } else {
          throw error;
        }
      }
}));

//show DELETE form to make sure users really wants to delete a book
router.get('/books/:id/delete', asyncHandler(async (err, req, res) => {
    const bookToBeDeleted = await Books.findByPk(req.params.id)
    if(bookToBeDeleted){
        res.render('delete', { 
            book: bookToBeDeleted 
        })
    } else {
      const err = new Error("Page not found");
      err.status = 404;
      throw err;
    } 
}));

//DELETES a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToBeDeleted = await Books.findByPk(req.params.id)
    if(bookToBeDeleted){
        await bookToBeDeleted.destroy(req.body);
        res.redirect('/')
    } else {
      const err = new Error("Page not found");
      err.status = 404;
      throw err;
    } 
}));

module.exports = router;
