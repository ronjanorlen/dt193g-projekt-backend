const User = require('../models/user.model'); // Inkludera user-model 
const Jwt = require('@hapi/jwt'); // Inkludera hapi jtw-plugin 
const bcrypt = require("bcrypt"); // Inkludera bcrypt

// Hämta alla användare 
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();
        return h.response(users).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av användare: ", error);
        return h.response(error).code(500);
    }
};

// Hämta användare per ID 
exports.getUserById = async (request, h) => {
    try {
        const user = await User.findById(request.params.id);
        return h.response(user).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Kunde inte hämta användare: ", error);
        return h.response(error).code(500);
    }
};

// Skapa ny användare 
exports.createUser = async (request, h) => {
    try {
        // Hämta uppgifter från payload 
        const { email, password } = request.payload;

        // Kontrollera om användaren redan finns 
        const userExist = await User.findOne({ email });
        if (userExist) {
            return h.response({ error: "Denna e-postadress finns redan. " }).code(400);
        }

        // Skapa objekt med ny användare 
        const user = new User({ email, password });

        console.log(user);

        const savedUser = await user.save(); // Spara ny användare 
        return h.response({ message: "Användare skapad.", user: { email: savedUser.email } }).code(201);

        // fånga upp fel
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Ta bort användare 
exports.deleteUser = async (request, h) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        return h.response({ message: "Användaren togs bort." }).code(20);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid borttagning av användare: ", error);
        return h.response(error).code(500);
    }
};


// Logga in 
exports.loginUser = async (request, h) => {
    try {
        // Hämta e-postadress och lösen från payload 
        const { email, password } = request.payload;
        // Hämta användare från databas 
        let user = await User.findOne({ email });

        // Kontroll att användare finns 
        if (!user) {
            return h.response({ message: "Felaktig e-postadress/lösenord. "}).code(401);
        }
        // Kontrollera lösenordet 
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return h.response({ message: "Felaktig epost-adress/lösenord. "}).code(401);
        }

        // Hämta användare, exkludera lösenord 
        const { email: userEmail } = user;

        // Generera token
        const token = generateToken(user);

        return h.response({ message: "Lyckad inloggning.", user: {email: userEmail } }).state("jwt", token); // Skapa HTTP-cookie
        // Fånga upp fel
    } catch (error) {
        console.error("Fel vid inloggning: ", error);
        return h.response(error).code(500);
    }
};

// Logga ut 
exports.logoutUser = async (request, h) =>{
        return h.response({ message: "Du har loggats ut." }).unstate("jwt");
};

// Generera JWT-token 
const generateToken = user => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 * 1000 } // 24 timmar 
    );
    return token;
}