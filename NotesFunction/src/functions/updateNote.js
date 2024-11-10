const { app } = require('@azure/functions');
const model = require('./Schema/Notes');
const Notes = model.Notes;
const dbConnection = require('./Db_connection')
const JWTauth = require("./Middleware/JWTauth");
const logger = require('../logger')

app.http('updateNote', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'updateNote/{id}',
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
            
            const reqBody = await request.json();
            const noteId = request.params.id;
            
            if (!noteId) {
                logger.error('Note ID not found');
                return {
                    status: 400,
                    jsonreBody: { err: 'Note ID not found' }
                };
            }
            await dbConnection();
            const updatedNote = reqBody
            
            const savedNote = await Notes.findOneAndUpdate(
                { _id: noteId },
                updatedNote,
                { returnDocument : 'after' }
            );

            if (!savedNote) {
                logger.error('Note not found')
                return {
                    status: 404,
                    jsonBody: { err: 'Note not found' }
                };
            }

            logger.info('Note updated')
            return {
                status: 200,
                jsonBody: savedNote
            };
        } catch (err) {
            logger.info('Update Note error', err)
            return {
                status: 500,
                jsonBody: { err }
            };
        }
    }
});