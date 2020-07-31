'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
      title: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  // custom error message
                  msg: 'Please provide a value for "title"',
              }
           },
      },
      author: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  // custom error message
                  msg: 'Please provide a value for "Author"',
              }
           },
      },
      genre: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  // custom error message
                  msg: 'Please provide a value for "genre"',
              }
           },
      },
      year: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
              notEmpty: {
                  // custom error message
                  msg: 'Please provide a value for "year"',
              }
           },
      },
  }, { sequelize }); // same as { sequelize: sequelize }

  return Book;
};