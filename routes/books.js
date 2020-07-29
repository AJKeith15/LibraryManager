const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// the routes below will be called if url starts with /books

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET articles listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]})
  res.render("index", { books, title: "Books" });
}));

/* GET new book form */
router.get('/new', (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
});

/* POST new book to database */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id
      res.render("new-book", {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));

/* GET book detail form */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    res.render("update-book", { book, title: book.title }); 
  } else {
    const err = new Error()
    err.status = 404
    err.message = 'This book does not exist in the library.'
    next(err)
  }
}));

/* POST update book info in database */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: error.errors, title: ""})
    } else {
      throw error;
    }
  }
}));

/* POST delete a book in database */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    await book.destroy()
    res.redirect("/books");
  } else {
    res.sendStatus(404)
  }
}));

module.exports = router;