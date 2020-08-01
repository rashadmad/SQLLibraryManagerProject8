var express = require('express');
var router = express.Router();
const Books = require('../models').Book;  

//modular async function to allow other functions async nature
const asyncHandler = (cb) => {
    return async (req,res,next) => {
        try {
          await cb(req,res,next);  
        }
        catch(err) {
            res.render('./errors/error', {
                errors: err
            })
        }
    }
}


//Home route should redirect to the /books route.
router.get('/', asyncHandler(async (req, res, next) => {
    res.redirect('/books');
}));

//Shows the full list of books.
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Books.findAll()
  console.log(books)
    res.render('index', {
        booksToView: [...books]
    })
}));

//Shows the create new book form.
router.get('/books/new', asyncHandler(async (req, res, next) => {
    res.render('new-book')
}));

//Posts a new book to the database.
router.post('/books/new', asyncHandler(async (req, res, next) => {
    const newBook = await Books.create(req.body)
    res.redirect('/book_detail/' + newBook.id)
}));

//Shows book detail form.
router.get('/book_detail/:id', asyncHandler(async (request, response, next) => {
    const selectedBook = await Books.findByPk(request.params.id)
    response.render('book_detail', {
        _booksToView: selectedBook,
        get booksToView() {
            return this._booksToView;
        },
        set booksToView(value) {
            this._booksToView = value;
        },
    })
}));

//Updates book info in the database.
router.post('/books/:id', asyncHandler(async (request, response, next) => {
        response.render('book_detail', {
        _booksToView: books[request.params.id],
        get booksToView() {
            return this._booksToView;
        },
        set booksToView(value) {
            this._booksToView = value;
        },
    })
}));

//Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/books/:id/delete', asyncHandler(async (request, response, next) => {
    response.render('index')
}));

module.exports = router;
