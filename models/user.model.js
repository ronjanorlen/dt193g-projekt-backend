const mongoose = require('mongoose'); // Inkludera mongoose 
const bcrypt = require('bcrypt'); // Inkludera bcrypt för hashning av lösenord 

// Schema för användare 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Du måste ange en e-postadress."],
        unique: [true, "Denna e-postadress finns redan."],
        match: [/.+\@.+\..+/, "Ange en giltig e-postadress"] // Kontrollera att e-postadress är giltig 
    },
    password: {
        type: String,
        required: [true, "Du måste ange ett lösenord."],
        validate: {
            validator: function (value) {
                // Validera att lösen innehåller minst en stor bokstav, en siffra samt är minst 8 tecken långt
                return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
            },
            message: "Lösenord måste vara minst 8 tecken långt samt innehålla en stor bokstav och en siffra"
        }
    }
}, { timestamps: true }); // Skapa timestamps 

// Hasha lösenord innan det sparas
userSchema.pre('save', async function (next) {
    
    if (!this.isModified('password')) return next();

    try {

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Kontroll av hashat lösen 
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
        // Fånga upp fel
    } catch (error) {
        throw error;
    }
}

// Skapa model för användare
const User = mongoose.model("User", userSchema);

// Exportera modell
module.exports = User;