const { app } = require('@azure/functions');
const model = require('./Schema/Notes');
const Notes = model.Notes;
const dbConnection = require("./Db_connection");
const JWTauth = require("./Middleware/JWTauth");
const logger = require('../logger')

app.http('getNote', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'getNote/{id}',
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
                logger.error(`User id not found in JWT auth"${request.url}"`);
                return {
                    status: 400,
                    jsonBody: { err: "User ID is required" },
                };
            }
            
            const noteId = request.params.id;
            if (!noteId) {
                logger.error(`Note ID not found`);
                return {
                    status: 400,
                    jsonBody: { err: 'Missing NoteId' }
                };
            }
            
            await dbConnection();
            const note = await Notes.findOne({ _id: noteId });
            
            if (!note) {
                logger.error(`Note not found`);
                return {
                    status: 404,
                    jsonBody: { err: 'Note not found' }
                };
            }

            logger.info(`Note found`);
            return {
                status: 200,
                jsonBody: note
            };
        } catch (err) {
            logger.error('Get Note error', err)
            return {
                status: 500,
                jsonBody: { err }
            };
        }
    }
});