const userController = require('../controllers/user.controller'); // Importera controller för användare 
const Joi = require('joi'); // Inkludera Joi 

module.exports = (server) => {
    server.route({
        // Hämta alla användare 
        method: 'GET',
        path: '/users',
        handler: userController.getAllUsers,
        options: {
            auth: false
        }
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
            auth: false
        }
    });

    // Redigera användare per ID
    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: userController.updateUser
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
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().min(1),
                    password: Joi.string().min(1)
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    });

    // Logga ut användare 
    server.route({
        method: 'GET',
        path: '/users/logout',
        handler: userController.logoutUser,
        options: {
            auth: false
        }
    });

}