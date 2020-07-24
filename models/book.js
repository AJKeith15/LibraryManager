const Sequelize = require('sequelize');

// define model for Book, outlines columns in table and validates
// title and author fields
module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Title is required',
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Author is required',
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER,
    }, { sequelize });

    return Book;
};