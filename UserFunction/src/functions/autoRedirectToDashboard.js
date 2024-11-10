const { app } = require('@azure/functions');
const dbConnection = require('./Db_connection')
const UserSchema = require('./Schema/User').User
const JWTauth = require('./Middleware/JWTauth')
const logger = require('../logger')

app.http('autoRedirectToDashboard', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        
        try {
            const authResult = await JWTauth(request, context);
            if(authResult.error){
                return {
                    status : authResult.status,
                    jsonBody : {error : authResult.error || {name : "Internal Server Error"}}
                }
            }
            logger.info(`HTTP request "${request.url}"`);
            
            const userId = authResult.userId
            if (!userId) {
                return {
                    status: 400,
                    jsonBody: { err: "User ID is required" },
                };
            }
            await dbConnection()
            const user = await UserSchema.findOne({ _id: userId });

            if (user) {
                return {
                    status: 200,
                    jsonBody: { username: user.name }
                };
            } else {
                return {
                    status: 404,
                    jsonBody: { error: "User not found" }
                };
            }
        } catch (err) {
            logger.error('auto redirect to dashboard error', err)
        
            return {
                status: 401,
                jsonBody: { error: "Unauthorized", details: err }
            };
        }
    }
});