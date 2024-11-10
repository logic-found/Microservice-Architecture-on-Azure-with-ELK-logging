const { app } = require('@azure/functions');
const dbConnection = require('./Db_connection')
const UserSchema = require('./Schema/User').User
const JWTauth = require('./Middleware/JWTauth')
const logger = require('../logger')

app.http('autoRedirectToDashboard', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        logger.info("autoRedirectToDashboard accessed.");

        try {
            await dbConnection()
            const { userId } = await request.json();
            await JWTauth(request, context);
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
            return {
                status: 401,
                jsonBody: { error: "Unauthorized", details: err }
            };
        }
    }
});