const { app } = require("@azure/functions");
const model = require("./Schema/Notes");
const Notes = model.Notes;
const dbConnection = require("./Db_connection");
const JWTauth = require("./Middleware/JWTauth");
const logger = require('../logger')

app.http("addNote", {
    methods: ["POST"],
    authLevel: "anonymous",
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
            const newNote = new Notes(reqBody);
            newNote.userId = userId
            
            await dbConnection();
            const savedNote = await newNote.save();
            logger.info('Note created')
            return {
                status: 201,
                jsonBody : savedNote
            };
        } catch (err) {
            logger.error('Add Note error', err)
            return {
                status: 500,
                jsonBody: { err },
            };
        }
    },
});
