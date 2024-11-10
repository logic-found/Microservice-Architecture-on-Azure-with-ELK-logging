const { app } = require('@azure/functions');
const User = require('./Schema/User').User
const jwt = require('jsonwebtoken');
require('dotenv').config();
const dbConnection = require('./Db_connection')
const logger = require('../logger')

app.http('signIn', {
    methods: ['POST'], 
    authLevel: 'anonymous', 
    handler: async (request, context) => {
        logger.info(`Http request "${request.url}"`);
        
        try {
            const reqBody = await request.json();
            const { email, password } = reqBody;
            await dbConnection()
            
            const user = await User.findOne({ email });
            
            if (user) {
                const { _id: id, name, password: hash } = user;
                const userId = id.toString();
                //const result = await bcrypt.compare(password, hash);
                const result = password === hash? true:false;
                
                if (result) {
                    const privateKey = process.env.HMAC_PRIVATE_KEY;
                    const options = { expiresIn: '1h' };
                    const token = jwt.sign({ userId }, privateKey, options);
                    
                    // Save the token for the user
                    user.token = token;
                    await user.save();
                    
                    logger.info(`User login success`);
                    return {
                        status: 200,
                        jsonBody: { name, token, result }
                    };
                } else {
                    // Password didn't match
                    logger.error(`Invalid mail/password`);
                    return {
                        status: 400,
                        jsonBody: { result : false }
                    };
                }
            } else {
                // User doesn't exist
                logger.error(`User doesn't exist`);
                return {
                    status: 404,
                    jsonBody: { err: { message : "User doesn't exist"}, result : false  }
                };
            }
        } catch (err) {
            logger.error('Sign In error', err)
            
            return {
                status: 500,
                jsonBody: { err, result : false }
            };
        }
    }
});
