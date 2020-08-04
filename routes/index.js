var express = require('express');
const { render } = require('pug');
var router = express.Router();
const Books = require('../models').Book;  

//modular async function to allow other functions async nature
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
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
        book: false
    })
}));

//CREATE Posts a new book to the database.
router.post('/books/new', asyncHandler(async (req, res) => {
    const newBook = await Books.create(req.body)
    res.redirect("/books/")
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
        res.render('page_not_found');
    } 
}));

//UPDATE book info in the database.
router.post('/books/:id', asyncHandler(async (req, res) => {
    const book = await Books.findByPk(req.params.id);
    if(book){
        await book.update(req.body);
        res.redirect("/books/" + book.id)
    } else {
        res.render('page_not_found');
    } 
}));

//show DELETE form to make sure users really wants to delete a book
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToBeDeleted = await Books.findByPk(req.params.id)
    if(bookToBeDeleted){
        res.render('delete', { 
            book: bookToBeDeleted 
        })
    } else {
        res.render('page_not_found');
    } 
}));

//DELETES a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const bookToBeDeleted = await Books.findByPk(req.params.id)
    if(bookToBeDeleted){
        await bookToBeDeleted.destroy(req.body);
        res.redirect('/')
    } else {
        res.render('page_not_found');
    } 
}));

module.exports = router;
