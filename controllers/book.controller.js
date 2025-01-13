"use strict";

const Book = require("../models/book.model"); // Inkludera bokmodel 

// Hämta alla böcker 
exports.getBooks = async (request, h) => {
    try {
        const books = await Book.find();
        // Kontroll om det finns böcker att hämta
        if (books.length === 0) {
            return h.response("Hittade inga böcker.").code(404);
        }
        // Returna böcker om det finns några
        return h.response(books).code(200);
        // Fånga ev fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av böcker.");
        return h.response(error).code(500);
    }
};

// Hämta bok per ID 
exports.getBookById = async (request, h) => {
    try {
        const book = await Book.findById(request.params.id);
        // Kontroll om boken finns 
        if (!book) {
            return h.response("Boken hittades inte.").code(404);
        }
        // Returnera boken om den finns 
        return h.response(book).code(200);
        // Fånga ev fel
    } catch (error) {
        console.error("Något fick fel vid hämtning av boken.");
        return h.response(error).code(500);
    }
};

// Lägg till bok 
exports.createBook = async (request, h) => {
    try {
        // Lägg till ny bok baserat på payloaden 
        const book = new Book(request.payload);
        const savedBook = await book.save();
        // Returnera boken om OK vid tillägg 
        return h.response({
            message: "Boken har lagts till.",
            book: savedBook
        }).code(201);
        // Fånga ev fel 
    } catch (error) {
        // Kontrollera om valideringsfel 
        if (error.title === "ValidationError") {
            // Objekt för att lagra valideringsfel 
            const errors = {};
            // Loopa igenom fel och lägga i errors-objekt 
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            // Returnera felmeddelanden
            return h.response(errors).code(400);
        }
        // Fånga upp fel och returnera 
        console.error("Något gick fel vid tillägg av ny bok: ", error);
        return h.response(error).code(500);
    }
};

// Uppdatera bok baserat på ID 
exports.updateBook = async (request, h) => {
    try {
        // Uppdatera bok med data från payload 
        const updatedBook = await Book.findByIdAndUpdate(
            request.params.id,
            request.payload,
            { new: true, runValidator: true } // Säkerställ validering 
        );

        // Kontroll att boken hittas 
        if (!updatedBook) {
            return h.response("Kunde inte hitta bok.").code(404);
        }
        // Uppdatera quantityStatus (lagersaldo)
        updatedBook.hasQuantity = updatedBook.quantity > 0;
        if (updatedBook.quantity === 0) {
            updatedBook.quantityStatus = "Finns ej i lager";
        } else if (updatedBook.quantity < 5) {
            updatedBook.quantityStatus = "Snart slut";
        } else {
            updatedBook.quantityStatus = "Finns i lager";
        }
        // Spara uppdatering 
        return h.response(updatedBook).code(200);
        // Fånga fel 
    } catch (error) {
        console.error("Något gick fel vid uppdatering: ", error);
        return h.response(error).code(500);
    }
}; 

// Ta bort bok baserat på ID 
exports.deleteBook = async (request, h) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(request.params.id);
        // Kontroll att boken hittas 
        if (!deletedBook) {
            return h.response("Boken hittades inte.").code(404);
        }
        // Returnera borttagen bok 
        return h.response("Boken togs bort.").code(200);
        // Fånga fel 
    } catch (error) {
        console.error("Något gick fel vid borttagning av bok: ", error);
        return h.response(error).code(500);
    }
};

