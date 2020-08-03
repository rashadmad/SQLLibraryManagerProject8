var express = require('express');
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
router.get('/', asyncHandler(async (req, res, next) => {
    res.redirect('/books');
}));

//READ Shows the full list of books.
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Books.findAll()
  const blankValue = " "
    res.render('index', {
        booksToView: [...books],
        book: {}
    })
}));

//CREATE Shows the create new book form.
router.get('/books/new', asyncHandler(async (req, res, next) => {
    res.render('new')
}));

//CREATE Posts a new book to the database.
router.post('/books', asyncHandler(async (req, res, next) => {
    const newBook = await Books.create(req.body)
    const newBookId = await newBook.id
    res.redirect("/books/" + newBookId);
}));

//READShows book detail form.
router.get('/books/:id', asyncHandler(async (req, res, next) => {
    const selectedBook = await Books.findByPk(req.params.id)
    //need to check if the selected book exists 
    if(selectedBook){
        res.render('edit', {
            book: selectedBook
        })
    } else {
        res.sendStatus(404);
    } 
}));

//UPDATE book info in the database.
router.post('/books/:id/edit', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/")
    if(book){
        await book.update(req.body);
        res.redirect("/")
    } else {
        res.sendStatus(404);
    } 
}));

//show DELETE form to make sure users really wants to delete a book
router.get('/books/:id/delete', asyncHandler(async (req, res, next) => {
    const bookToBeDeleted = await Book.findByPk(req.params.id)
    if(bookToBeDeleted){
        await book.update(req.body);
        res.render('books/delete', { 
            book: bookToBeDeleted 
        })
    } else {
        res.sendStatus(404);
    } 
}));

//DELETES a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {
    const bookToBeDeleted = await Books.findByPk(req.params.id)
    await bookToBeDeleted.destroy(req.body);
    res.redirect('/')
    if(bookToBeDeleted){
        await book.update(req.body);
        res.render('books/delete', { 
            book: bookToBeDeleted 
        })
    } else {
        res.sendStatus(404);
    } 
}));

module.exports = router;
