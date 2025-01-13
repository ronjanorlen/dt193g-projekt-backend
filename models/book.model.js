const mongoose = require('mongoose'); // Inkludera mongoose 

// Schema för böcker 
const bookSchema = new mongoose.Schema({
    // Titel
    title: {
        type: String,
        required: [true, "Ange bokens titel."]
    },
    // Författare
    author: {
        type: String,
        required: [true, "Ange bokens författare."]
    },
    // Genre 
    genre: {
        type: String,
        required: [true, "Ange vilken genre boken tillhör."]
    },
    // Beskrivning
    description: {
        type: String,
        required: [true, "Du måste ange bokens beskrivning."],
        maxlength: [500, "Beskrivningen får vara max 500 tecken lång."]
    }, 
    // Pris
    price: {
        type: Number,
        required: [true, "Ange pris."],
        min: [0, "Lägsta pris är 0."]
    },
    // Antal (lager)
    quantity: {
        type: Number,
        required: [true, "Ange hur många som finns i lager."],
        min: [0, "Minsta antal i lager är 0."]
    },
    // Finns i antal (lager)
    hasQuantity: {
        type: Boolean,
        default: true
    },
    // Antal status (lagerstatus)
    quantityStatus: {
        type: String,
        default: "Finns i lager."
    },
}, { timestamps: true }); // Timestamps 

// Pre-hook som uppdaterar hasQuantity (finns i lager) och quantityStatus (lagerstatus) baserat på quantity (antal)
bookSchema.pre('save', function (next) {
    // Sätt true/false att det finns böcker i lager om quantity är större än 0
    this.hasQuantity = this.quantity > 0;
    // Uppdatera lagerstatus 
    if (this.quantity === 0) {
        this.quantityStatus = "Finns ej i lager"; // om det är 0
    } else if (this.quantity < 5) {
        this.quantityStatus = "Snart slut"; // om det är mindre än 5 
    } else {
        this.quantityStatus = "Finns i lager"; // annars finns i lager 
    }
    next();
});


const Book = mongoose.model('Book', bookSchema); // Skapa model för böcker 

module.exports = Book; // Exportera model 