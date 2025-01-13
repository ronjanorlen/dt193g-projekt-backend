'use strict';

const Hapi = require('@hapi/hapi'); // Använd hapi
const mongoose = require("mongoose"); // Inkludera mongoose
require("dotenv").config(); // Använd dotenv för miljövariabler 
const auth = require('./auth'); // Importera autentiserings-fil

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ["*"], // Tillåt alla CORS-anrop
                credentials: true,
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        },
    });

    // Anslut till mongoDB
    mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB");
    }).catch((error) => {
        console.error("Något gick fel vid anslutning till databasen: " + error); 
    });

    // Registrera autentisering 
    await auth.register(server);

    // Registrera routes 
    require('./routes/book.route')(server);
    require('./routes/user.routes')(server);

    // Starta servern 
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Hantering av ev fel 
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init(); // Starta server