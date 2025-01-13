const userController = require('../controllers/user.controller'); // Importera controller för användare 
const Joi = require('joi'); // Inkludera Joi 

module.exports = (server) => {
    server.route({
        // Hämta alla användare 
        method: 'GET',
        path: '/users',
        handler: userController.getAllUsers
    });
    // Hämta användare per ID 
    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: userController.getUserById
    });

    // Skapa användare 
    server.route({
        method: 'POST',
        path: '/users',
        handler: userController.createUser,
        options: {
            auth: false,
        },
    });

    // Ta bort användare per ID
    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: userController.deleteUser
    });

    // Logga in användare 
    server.route({
        method: 'POST',
        path: '/users/login',
        handler: userController.loginUser,
        options: {
            auth: false
        },
    });

    // Logga ut användare 
    server.route({
        method: 'GET',
        path: '/users/logout',
        handler: userController.logoutUser
    });

}