const { app } = require('@azure/functions');
const model = require('./Schema/Notes');
const Notes = model.Notes;
const dbConnection = require('./Db_connection');
const JWTauth = require("./Middleware/JWTauth");
const logger = require('../logger')

app.http('getAllNotes', {
    methods: ['GET'],
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
            logger.info(`Http request "${request.url}"`);
            
            const userId = authResult.userId
            if (!userId) {
                logger.error(`User ID not found in JWT auth"${request.url}"`);
                return {
                    status: 400,
                    jsonBody: { err: "User ID not found" },
                };
            }

            await dbConnection();
            const allNotes = await Notes.find({userId})
            logger.info('Get all note success')
            return {
                status: 200,
                jsonBody: allNotes
            };
        }
        catch(err){
            logger.error('Get all notes error', err)
        
            return {
                status: 500,
                jsonBody: { err }
            };
        }
    }
});
