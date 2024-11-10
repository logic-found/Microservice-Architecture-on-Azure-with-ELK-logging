const { app } = require('@azure/functions');
const model = require('./Schema/Notes');
const Notes = model.Notes;
const dbConnection = require('./Db_connection');
const JWTauth = require("./Middleware/JWTauth");
const logger = require('../logger')

app.http('deleteNote', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'deleteNote/{id}',
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
                logger.error(`User ID not found in JWT auth"${request.url}"`);
                return {
                    status: 400,
                    jsonBody: { err: "User ID not found" },
                };
            }
            await dbConnection();
            let noteId = request.params?.id;

            if (!noteId) {
                logger.error('Note ID not found')
                return {
                    status: 400,
                    jsonBody: { err: "Note ID not found" }
                };
            }
            
            const deletedNote = await Notes.findOneAndDelete({ _id: noteId });
            if (deletedNote) {
                logger.info('Note deleted')
                return {
                    status: 200,
                    jsonBody: deletedNote
                };
            } else {
                logger.error('Note not found')
                return {
                    status: 404,
                    jsonBody: { err: 'Note not found' }
                };
            }
        } catch (err) {
            logger.error('Delete note error', err)
        
            return {
                status: 500,
                jsonBody: { err }
            };
        }
    }
});