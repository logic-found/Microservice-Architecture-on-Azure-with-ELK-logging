const { app } = require('@azure/functions');
const model = require('./Schema/User');
const User = model.User;
const dbConnection = require('./Db_connection')
require('dotenv').config();
const logger = require('../logger')

app.http('signUp', {
    methods: ['POST'], 
    authLevel: 'anonymous',
    handler: async (request, context) => {
        logger.info(`Http request "${request.url}"`);

        try {
            const reqBody = await request.json();
            const { name, email, password } = reqBody;
            await dbConnection()
            
            // Check if the email is already registered
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                // If user exists, return error
                logger.error('Already registered email')
                return {
                    status: 400,
                    jsonBody: { err: "Already registered email" }
                };
            } else {
                // Hash the password and create a new user
                //const hash = await bcrypt.hash(password, 5);
                
                const newUser = new User({
                    name,
                    email,
                    password,
                    // password: hash,
                    token: process.env.USER_DUMMY_TOKEN 
                });
                
                const savedUser = await newUser.save();
                
                logger.info('User created')
                return {
                    status: 201,
                    jsonBody: {
                        name: savedUser.name,
                        email: savedUser.email
                    }
                };
            }
        } catch (error) {
            logger.error('Sign Up error', err)
            return {
                status: 500,
                jsonBody: { err }
            };
        }
    }
});
