"use strict";

const BookController = require("../controllers/book.controller"); // Inkludera bokcontroller 

module.exports = (server) => {
    server.route({
        // Hämta alla böcker 
        method: 'GET',
        path: '/books',
        handler: BookController.getBooks,
        options: {
            auth: false,
        }
    });
    // Hämta bok per id 
    server.route({
        method: 'GET',
        path: '/books/{id}',
        handler: BookController.getBookById,
        options: {
            auth: false,
        }
    });
    // Lägg till bok 
    server.route({
        method: 'POST',
        path: '/books',
        handler: BookController.createBook,
        options: {
            auth: false,
        }
    });
    // Uppdatera bok 
    server.route({
        method: 'PUT',
        path: '/books/{id}',
        handler: BookController.updateBook,
        options: {
            auth: false,
        }
    });
    // Ta bort bok 
    server.route({
        method: 'DELETE',
        path: '/books/{id}',
        handler: BookController.deleteBook,
        options: {
            auth: false,
        }
    });
}