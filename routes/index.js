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
            res.status(500).send(error);
            res.render('error', {
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
    res.render('index', {
        booksToView: [...books]
    })
}));

//Shows the create new book form.
router.get('/books/new', asyncHandler(async (req, res, next) => {
    res.render('new')
}));

//Posts a new book to the database.
router.post('/', asyncHandler(async (req, res, next) => {
    const newBook = await Books.create(req.body)
    const newBookId = await newBook.id
    res.redirect("/books/4");
}));

//Shows book detail form.
router.get('/books/:id', asyncHandler(async (request, response, next) => {
    const selectedBook = await Books.findByPk(request.params.id)
    response.render('edit', {
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
